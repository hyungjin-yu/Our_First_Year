# 스토어 출시 체크리스트

Play Store / App Store 정식 출시까지 남은 작업 정리. 항목 처리될 때마다 업데이트할 것.

**출시 범위 결정 (2026-08-22): Android 무료 버전만 먼저 출시.** Phase B(프리미엄 구독)와 iOS는 이번 출시 범위 밖 — 이번 런칭엔 블로킹 아님, 나중에 별도로 진행.

마지막 업데이트: 2026-08-22

## Phase A — 보안/정책 필수 (완료)

- [x] Storage 비공개 전환 (`getPublicUrl` → signed URL, `memories` 버킷 Private)
- [x] RLS 정책 정리 (letters/memories/profiles) + `link_couple`/`delete_own_account_data` RPC
  - `supabase/migrations/20260821120000_launch_readiness.sql`
- [x] 계정 및 데이터 영구 삭제 기능 (설정 화면 + `delete-account` Edge Function, 배포 완료)
- [x] 개인정보처리방침 / 이용약관 페이지 (`/privacy`, `/terms`) + Vercel 배포
  - https://our-first-year-iota.vercel.app/privacy
  - https://our-first-year-iota.vercel.app/terms
- [x] Android 빌드 보안 설정 (`allowBackup=false`, minify+shrinkResources, proguard 규칙)
- [x] Android 릴리스 키스토어 생성 (`android/release.keystore`, `android/keystore.properties` — 둘 다 git 제외)
- [x] Supabase Auth Redirect URL 등록 (`com.our.anniversary://auth/callback`)
- [x] 카카오/구글 로그인 버튼 숨김 (Supabase에서 Disabled 상태로 확인 — 실제로 연결된 적 없었음)

## 오늘/다음 할 것

- [x] Google Play Console 개발자 계정 생성 ($25 결제 완료, 계정명 "OPAD")
- [ ] **Play Console 본인 확인 + 연락처 전화번호 인증** — 신분증 파일 없어서 보류 중 (블로킹). 신분증 파일 준비되면 https://play.google.com/console/ → 홈 → "시작하기"
  - 본인 확인 끝나기 전까지는 "앱 만들기" 버튼 자체가 비활성화되어 있어 다음 단계 전부 막혀 있음
- [x] `npx cap sync android` → Android Studio에서 서명된 release AAB 빌드 완료
  - 결과물: `android/app/build/outputs/bundle/release/app-release.aab`
  - Android Studio에서 빌드할 땐 Build Variant를 `release`로 바꿔야 함 (기본값 `debug`라 서명 안 된 빌드가 나옴)
  - 로컬 빌드에 `.env.local` 필요 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase 대시보드 API Keys의 "Publishable key" 사용, "Secret key"는 절대 사용 금지). git 제외 파일이라 새 worktree/새 PC에서는 매번 다시 만들어야 함
  - `android/release.keystore`, `android/keystore.properties`도 git 제외라 새 worktree엔 없음 — `C:\Users\user\Projects\Our_First_Year\android\`에서 복사해서 씀. 백업본: `C:\Users\user\OneDrive\Backups\android-release-keystore\` (분실 시 앱 업데이트 영구 불가이니 유지할 것)
- [ ] Play Console에 앱 생성 (본인 확인 끝나야 진행 가능) — 이후 앱 생성만으로 끝나는 게 아니라 아래 항목들이 출시 전 필수:
  - [ ] Data Safety 설문 (개인정보처리방침 URL 위 링크 사용)
  - [ ] 콘텐츠 등급 설문 (IARC)
  - [ ] 타겟 연령층 선언
  - [ ] 광고 포함 여부 선언 (이 앱은 광고 없음)
  - [ ] 스토어 등록정보 — 스크린샷(최소 2장), 짧은 설명, 긴 설명, 카테고리 — **아직 준비 안 됨**
  - [ ] 첫 빌드(`app-release.aab`) 업로드 → 내부 테스트 트랙 추천
- [x] 앱 아이콘 제작 — 기존 PWA 아이콘(`public/icons/`)이 금색 톤이라 앱 실제 색감(`--app-primary: #84514f` 로즈브라운, 배경 `#fdf8f5`)이랑 안 맞아서 재제작
  - 소스: `resources/icon.png` (1024x1024) — 하트 아웃라인 + "1", 크림→핑크 그라데이션 배경
  - `@capacitor/assets` devDependency로 추가해서 Android 런처 아이콘 전 해상도 + 스플래시 화면 자동 생성 (`npx capacitor-assets generate --android`)
  - PWA 아이콘(`public/icons/icon-192x192.png`, `icon-512x512.png`)도 같이 교체
  - 아이콘/스플래시 반영 후 웹 빌드 → cap sync → release AAB 재빌드까지 완료
- [ ] (선택) 중복 RLS 정책 정리 — 예전에 대시보드에서 직접 만든 정책과 오늘 마이그레이션이 겹쳐있음. 기능상 문제는 없으나 정리하면 깔끔함.

## Phase B — 프리미엄 구독 결제 (이번 출시 범위 아님, 나중에)

- [ ] RevenueCat 계정 생성 + 프로젝트 생성
- [ ] Google Play Console에 구독 상품 등록 (예: `premium_monthly`)
- [ ] RevenueCat에 Android API 키 발급 → `@revenuecat/purchases-capacitor` 연동
- [ ] `premium-modal.tsx` 구매 플로우 연결, `write/page.tsx` 10장 제한 게이팅에 entitlement 반영

## iOS (이번 출시 범위 아님 — Mac/Xcode 필요, 나중에)

- [ ] Apple 개발자 프로그램 등록 (연 $99)
- [ ] iOS 딥링크/서명 설정은 코드상 준비되어 있음 (`Info.plist`, `auth-provider.tsx`) — 실제 빌드는 Mac에서
- [ ] App Store Connect에 구독 상품 등록 (Phase B와 함께)

## 나중에 살릴 수도 있는 것

- [ ] 카카오/구글 소셜 로그인 실제 연동 (각 콘솔에서 앱 생성 → Supabase Sign In/Providers에서 활성화)
