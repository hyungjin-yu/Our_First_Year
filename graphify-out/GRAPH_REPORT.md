# Graph Report - Our_First_Year  (2026-08-23)

## Corpus Check
- Corpus is ~34,020 words - fits in a single context window. You may not need a graph.

## Summary
- 291 nodes · 424 edges · 40 communities (22 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- 갤러리/편지 페이지
- 출시 준비 & 결제
- TypeScript 빌드 설정
- 프론트엔드 의존성
- Lint/스타일 설정
- iOS AppDelegate 라이프사이클
- 앱 레이아웃 & 폰트
- 타임라인 & 메모리
- Android 계측 테스트
- iOS 출시 준비 (보류)
- 인증 미들웨어
- Gradle 래퍼 스크립트
- Google Play 등록
- 프리미엄 구독 모달
- Android MainActivity
- 사이트맵 매니페스트
- 개인정보처리방침 페이지
- 이용약관 페이지
- 히어로 섹션
- 편지 컴포넌트
- Capacitor 설정
- ESLint 설정 파일
- Swift 패키지 정의
- 계정 삭제 기능
- 소셜 로그인 (보류)
- Next.js 설정
- PostCSS 설정
- Tailwind 설정
- Android 빌드 보안
- Phase A 보안/정책
- Android 릴리스 키스토어

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 30 edges
2. `useAuth()` - 23 edges
3. `compilerOptions` - 16 edges
4. `Our First Year (우리의 1주년)` - 16 edges
5. `BottomNav()` - 11 edges
6. `TopAppBar()` - 11 edges
7. `AppDelegate` - 10 edges
8. `include` - 7 edges
9. `LoadingScreen()` - 6 edges
10. `uploadToSupabase()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Supabase` --conceptually_related_to--> `Storage 비공개 전환 (Signed URL)`  [INFERRED]
  README.md → LAUNCH_CHECKLIST.md
- `Supabase` --conceptually_related_to--> `Supabase Auth Redirect URL 등록`  [INFERRED]
  README.md → LAUNCH_CHECKLIST.md
- `Supabase` --conceptually_related_to--> `RLS 정책 정리 (letters/memories/profiles)`  [INFERRED]
  README.md → LAUNCH_CHECKLIST.md
- `프리미엄 대시보드` --conceptually_related_to--> `Phase B: 프리미엄 구독 결제`  [INFERRED]
  README.md → LAUNCH_CHECKLIST.md
- `사랑의 편지함 (Mailbox)` --conceptually_related_to--> `write/page.tsx`  [INFERRED]
  README.md → LAUNCH_CHECKLIST.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase A 보안/정책 완료 항목** — launch_checklist_phase_a, launch_checklist_storage_private_conversion, launch_checklist_rls_policy_cleanup, launch_checklist_account_deletion, launch_checklist_privacy_terms_pages, launch_checklist_android_build_security, launch_checklist_release_keystore, launch_checklist_supabase_auth_redirect_url, launch_checklist_social_login_hidden [EXTRACTED 1.00]
- **Phase B 프리미엄 구독 결제 연동** — launch_checklist_phase_b, launch_checklist_revenuecat_account, launch_checklist_play_subscription_product, launch_checklist_revenuecat_purchases_capacitor, launch_checklist_premium_modal_tsx, launch_checklist_write_page_tsx [EXTRACTED 1.00]
- **iOS 출시 준비 작업** — launch_checklist_ios_section, launch_checklist_apple_developer_program, launch_checklist_ios_deeplink_signing, launch_checklist_appstore_connect_subscription [EXTRACTED 1.00]

## Communities (40 total, 18 thin omitted)

### Community 0 - "갤러리/편지 페이지"
Cohesion: 0.15
Nodes (26): GalleryPage(), LetterArchivePage(), LetterDetailContent(), LoginPage(), MemoryDetailContent(), Home(), ProfilePage(), generateRandomCode() (+18 more)

### Community 1 - "출시 준비 & 결제"
Cohesion: 0.07
Nodes (32): CapApp-SPM, App Store Connect 구독 상품 등록, delete_own_account_data RPC, 중복 RLS 정책 정리, 20260821120000_launch_readiness.sql, link_couple RPC, Phase B: 프리미엄 구독 결제, Google Play 구독 상품 (premium_monthly) (+24 more)

### Community 2 - "TypeScript 빌드 설정"
Cohesion: 0.07
Nodes (29): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+21 more)

### Community 3 - "프론트엔드 의존성"
Cohesion: 0.07
Nodes (27): @capacitor/android, @capacitor/cli, @capacitor/core, @capacitor/ios, clsx, framer-motion, lucide-react, next (+19 more)

### Community 4 - "Lint/스타일 설정"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 5 - "iOS AppDelegate 라이프사이클"
Cohesion: 0.13
Nodes (13): Any, Bool, Capacitor, AppDelegate, NSUserActivity, UIApplication, UIApplicationDelegate, UIKit (+5 more)

### Community 6 - "앱 레이아웃 & 폰트"
Cohesion: 0.12
Nodes (13): @capacitor/app, @capacitor/app, metadata, notoSerif, plusJakartaSans, viewport, AuthProvider(), ProfileManager() (+5 more)

### Community 7 - "타임라인 & 메모리"
Cohesion: 0.21
Nodes (8): TimelineItem(), TimelineProps, MEMORIES_FILE_PATH, Memory, cn(), formatFullDate(), formatLetterDate(), formatShortDate()

### Community 8 - "Android 계측 테스트"
Cohesion: 0.33
Nodes (5): ExampleInstrumentedTest, ExampleUnitTest, androidx.test.ext.junit.runners.AndroidJUnit4, org.junit.runner.RunWith, org.junit.Test

### Community 9 - "iOS 출시 준비 (보류)"
Cohesion: 0.40
Nodes (5): Apple 개발자 프로그램 등록, auth-provider.tsx, Info.plist, iOS 딥링크/서명 설정, iOS 출시 준비 (보류)

### Community 10 - "인증 미들웨어"
Cohesion: 0.60
Nodes (3): config, middleware(), updateSession()

### Community 11 - "Gradle 래퍼 스크립트"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 12 - "Google Play 등록"
Cohesion: 0.50
Nodes (4): npx cap sync android, Google Play Console 개발자 등록, Play Console Data Safety 항목 작성, 개인정보처리방침/이용약관 페이지

## Knowledge Gaps
- **108 isolated node(s):** `config`, `eslintConfig`, `UIKit`, `Capacitor`, `PackageDescription` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `프론트엔드 의존성` to `Lint/스타일 설정`, `앱 레이아웃 & 폰트`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `@capacitor/app` connect `앱 레이아웃 & 폰트` to `프론트엔드 의존성`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `AuthProvider()` connect `앱 레이아웃 & 폰트` to `갤러리/편지 페이지`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `config`, `eslintConfig`, `UIKit` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `출시 준비 & 결제` be split into smaller, more focused modules?**
  _Cohesion score 0.06653225806451613 - nodes in this community are weakly interconnected._
- **Should `TypeScript 빌드 설정` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `프론트엔드 의존성` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._