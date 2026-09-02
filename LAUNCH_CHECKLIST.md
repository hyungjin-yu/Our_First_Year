# 스토어 출시 체크리스트

Play Store / App Store 정식 출시까지 남은 작업 정리. 항목 처리될 때마다 업데이트할 것.

마지막 업데이트: 2026-09-02

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

- [x] **Google Play Console 개발자 등록** ($25, 1회, 본인인증 포함 완료) → https://play.google.com/console/signup
- [ ] `npx cap sync android` → Android Studio에서 서명된 AAB 빌드
- [ ] Play Console에 앱 생성 → Data Safety 항목 작성 (개인정보처리방침 URL 위 링크 사용) → 첫 빌드 업로드 (내부 테스트 트랙 추천)
- [ ] (선택) 중복 RLS 정책 정리 — 예전에 대시보드에서 직접 만든 정책과 오늘 마이그레이션이 겹쳐있음. 기능상 문제는 없으나 정리하면 깔끔함.

## Phase B — 프리미엄 구독 결제

- [ ] RevenueCat 계정 생성 + 프로젝트 생성
- [ ] Google Play Console에 구독 상품 등록 (예: `premium_monthly`)
- [ ] RevenueCat에 Android API 키 발급 → `@revenuecat/purchases-capacitor` 연동
- [ ] `premium-modal.tsx` 구매 플로우 연결, `write/page.tsx` 10장 제한 게이팅에 entitlement 반영

## iOS (보류 — Mac/Xcode 필요)

- [ ] Apple 개발자 프로그램 등록 (연 $99)
- [ ] iOS 딥링크/서명 설정은 코드상 준비되어 있음 (`Info.plist`, `auth-provider.tsx`) — 실제 빌드는 Mac에서
- [ ] App Store Connect에 구독 상품 등록 (Phase B와 함께)

## 나중에 살릴 수도 있는 것

- [ ] 카카오/구글 소셜 로그인 실제 연동 (각 콘솔에서 앱 생성 → Supabase Sign In/Providers에서 활성화)
