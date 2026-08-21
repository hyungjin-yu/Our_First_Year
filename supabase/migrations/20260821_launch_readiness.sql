-- ============================================================================
-- Our First Year — 스토어 출시 준비 마이그레이션 (2026-08-21)
--
-- 실행 방법: Supabase Dashboard → SQL Editor에 전체 붙여넣기 후 실행.
-- ⚠️ 운영 DB에 직접 적용합니다. 실행 전 반드시 Database → Backups에서
--    백업을 한 번 떠두거나, 가능하면 스테이징 프로젝트에서 먼저 검증하세요.
--
-- 이 파일은 여러 번 실행해도 안전하도록(idempotent) 작성했습니다
-- (모든 정책은 DROP POLICY IF EXISTS 후 CREATE POLICY).
--
-- 전제: repo의 supabase/schema.sql은 오래된 초기 설계(couple_id/couples 테이블)를
-- 반영하고 있어 실제 운영 스키마와 다릅니다. 이 마이그레이션은 앱 코드가 실제로
-- 사용 중인 스키마(profiles.partner_id 기반, couples 테이블 없음)를 기준으로 작성했습니다.
-- 아래 정책들은 profiles/memories/letters 테이블에 이미 존재하는 컬럼(id, user_id,
-- partner_id, invite_code 등)만 사용하며 테이블/컬럼을 새로 만들지 않습니다.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 0. 헬퍼 함수: 내 파트너의 id를 반환 (RLS 정책에서 재사용, 자기참조 재귀 방지용)
-- ----------------------------------------------------------------------------
create or replace function public.current_partner_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select partner_id from public.profiles where id = auth.uid();
$$;


-- ----------------------------------------------------------------------------
-- 1. Storage 버킷 비공개 전환 + 소유자/파트너 기반 접근 정책
--    (경로 규칙: "<user_id>/<timestamp>.<ext>" — src/utils/supabase/storage.ts 참고)
-- ----------------------------------------------------------------------------
update storage.buckets set public = false where id = 'memories';

drop policy if exists "memories bucket: owner or partner can read" on storage.objects;
drop policy if exists "memories bucket: owner can insert" on storage.objects;
drop policy if exists "memories bucket: owner can update" on storage.objects;
drop policy if exists "memories bucket: owner can delete" on storage.objects;

create policy "memories bucket: owner or partner can read"
on storage.objects for select
using (
  bucket_id = 'memories'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or (storage.foldername(name))[1] = public.current_partner_id()::text
  )
);

create policy "memories bucket: owner can insert"
on storage.objects for insert
with check (
  bucket_id = 'memories'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "memories bucket: owner can update"
on storage.objects for update
using (
  bucket_id = 'memories'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "memories bucket: owner can delete"
on storage.objects for delete
using (
  bucket_id = 'memories'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- ----------------------------------------------------------------------------
-- 2. profiles: 기존(구설계) 정책 정리 + 본인/파트너 조회, 본인 insert/update
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "profiles_select_own_or_partner" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own_or_partner" on public.profiles
  for select using (
    id = auth.uid()
    or id = public.current_partner_id()
  );

create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());


-- ----------------------------------------------------------------------------
-- 3. memories: 기존(구설계) 정책 정리 + 본인/파트너 조회, 본인만 삽입/수정/삭제
-- ----------------------------------------------------------------------------
alter table public.memories enable row level security;

drop policy if exists "Couples can view memories" on public.memories;
drop policy if exists "Couples can insert memories" on public.memories;
drop policy if exists "memories_select_own_or_partner" on public.memories;
drop policy if exists "memories_insert_own" on public.memories;
drop policy if exists "memories_update_own" on public.memories;
drop policy if exists "memories_delete_own" on public.memories;

create policy "memories_select_own_or_partner" on public.memories
  for select using (
    user_id = auth.uid()
    or user_id = public.current_partner_id()
  );

create policy "memories_insert_own" on public.memories
  for insert with check (user_id = auth.uid());

create policy "memories_update_own" on public.memories
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "memories_delete_own" on public.memories
  for delete using (user_id = auth.uid());


-- ----------------------------------------------------------------------------
-- 4. letters: 정책이 하나도 없던 테이블 — 본인/파트너 조회, 본인만 삽입/수정/삭제
-- ----------------------------------------------------------------------------
alter table public.letters enable row level security;

drop policy if exists "letters_select_own_or_partner" on public.letters;
drop policy if exists "letters_insert_own" on public.letters;
drop policy if exists "letters_update_own" on public.letters;
drop policy if exists "letters_delete_own" on public.letters;

create policy "letters_select_own_or_partner" on public.letters
  for select using (
    user_id = auth.uid()
    or user_id = public.current_partner_id()
  );

create policy "letters_insert_own" on public.letters
  for insert with check (user_id = auth.uid());

create policy "letters_update_own" on public.letters
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "letters_delete_own" on public.letters
  for delete using (user_id = auth.uid());


-- ----------------------------------------------------------------------------
-- 5. link_couple RPC: settings 페이지의 초대 코드 연결 기능 (src/app/settings/page.tsx)
--    이미 운영 DB에 같은 이름의 함수가 있다면 아래 정의로 덮어씁니다.
-- ----------------------------------------------------------------------------
create or replace function public.link_couple(code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id uuid;
  caller_id uuid := auth.uid();
begin
  if caller_id is null then
    raise exception 'not authenticated';
  end if;

  select id into target_id
  from public.profiles
  where invite_code = code
    and id <> caller_id
  limit 1;

  if target_id is null then
    return false;
  end if;

  -- 둘 중 하나라도 이미 연결돼 있으면 실패 (기존 연결을 덮어쓰지 않음)
  if exists (select 1 from public.profiles where id = caller_id and partner_id is not null) then
    return false;
  end if;
  if exists (select 1 from public.profiles where id = target_id and partner_id is not null) then
    return false;
  end if;

  update public.profiles set partner_id = target_id where id = caller_id;
  update public.profiles set partner_id = caller_id where id = target_id;

  return true;
end;
$$;

grant execute on function public.link_couple(text) to authenticated;


-- ----------------------------------------------------------------------------
-- 6. delete_own_account_data RPC: 계정 삭제 시 앱 데이터 정리 (auth.users 삭제는
--    service_role 권한이 필요해 여기서 하지 않음 — supabase/functions/delete-account
--    Edge Function이 이 함수를 호출한 다음 admin.deleteUser로 최종 삭제한다)
-- ----------------------------------------------------------------------------
create or replace function public.delete_own_account_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_id uuid := auth.uid();
begin
  if caller_id is null then
    raise exception 'not authenticated';
  end if;

  -- 파트너 쪽 연결도 해제 (파트너가 나를 계속 partner_id로 물고 있지 않도록)
  update public.profiles set partner_id = null where partner_id = caller_id;

  delete from public.memories where user_id = caller_id;
  delete from public.letters where user_id = caller_id;
  delete from storage.objects
    where bucket_id = 'memories'
      and (storage.foldername(name))[1] = caller_id::text;
  delete from public.profiles where id = caller_id;
end;
$$;

grant execute on function public.delete_own_account_data() to authenticated;


-- ============================================================================
-- 참고: 기존 memories.image_url 컬럼에 "버킷이 public이던 시절" 저장된 공개 URL
-- 전체가 남아있을 수 있습니다. 코드(src/utils/supabase/storage.ts의
-- getSignedImageUrl)는 공개 URL과 경로를 모두 자동으로 처리하므로 백필은
-- 필수가 아니지만, DB를 깔끔하게 유지하고 싶다면 아래 SELECT로 대상을 먼저
-- 확인한 뒤 필요할 때만 UPDATE를 실행하세요. (경로만 남기는 것으로, 아래는 예시이며
-- 실제 프로젝트 URL 형식에 맞게 marker 문자열을 확인 후 사용할 것)
--
-- select id, image_url from public.memories where image_url like 'http%';
--
-- update public.memories
-- set image_url = split_part(image_url, '/object/public/memories/', 2)
-- where image_url like '%/object/public/memories/%';
-- ============================================================================
