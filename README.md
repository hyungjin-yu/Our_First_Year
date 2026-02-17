# Our First Year (우리의 1주년)

**"우리 함께한 지 벌써 1년, 그 소중한 순간들을 담았습니다."**

사랑하는 사람과의 1주년을 기념하기 위해 제작된 프라이빗 모바일 애플리케이션입니다.  
웹 기술(Next.js)을 기반으로 Capacitor를 사용하여 네이티브 앱(Android/iOS)으로 패키징되었습니다.

## ✨ 주요 기능 (Features)

*   **D-Day 카운터**: 우리가 만난 지 며칠이 지났는지, 1주년까지 얼마나 남았는지 보여주는 감성적인 메인 화면.
*   **추억 타임라인**: 함께 찍은 사진과 소중한 기억들을 스크롤과 함께 감상할 수 있는 타임라인.
*   **마음의 편지**: 타자기 효과로 한 글자씩 진심을 전하는 편지 섹션.
*   **소중한 기록 (Write)**: 사진과 글을 직접 업로드하여 추억을 영원히 저장 (Supabase 연동).
*   **사용자 인증**: 보안을 위한 로그인/회원가입 및 소셜 로그인(Kakao, Google) 지원.
*   **반응형 디자인**: 모바일 기기에 최적화된 UI/UX (Galaxy Fold 등 다양한 화면비 대응).

## 🛠 기술 스택 (Tech Stack)

*   **Frontend**: Next.js 14 (App Router), React, TypeScript
*   **Styling**: Tailwind CSS, Framer Motion (Animations)
*   **Mobile**: Capacitor (iOS & Android Packaging)
*   **Backend & DB**: Supabase (PostgreSQL, Auth, Storage)
*   **Deployment**: Static Export (for Mobile), Vercel (for Web)

## 🚀 시작하기 (Getting Started)

### 사전 요구사항
- Node.js 18+
- npm 또는 yarn
- Xcode (iOS 빌드 시)
- Android Studio (Android 빌드 시)

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/hyungjin-yu/Our_First_Year.git
   cd Our_First_Year
   ```

2. **패키지 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   `.env.local` 파일을 생성하고 Supabase 관련 키를 입력하세요.
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **개발 서버 실행 (웹)**
   ```bash
   npm run dev
   ```

5. **모바일 빌드 및 실행**
   ```bash
   # Next.js 정적 빌드
   npm run build

   # Capacitor 동기화
   npx cap sync

   # iOS 실행
   npx cap open ios

   # Android 실행
   npx cap open android
   ```

## 📂 프로젝트 구조

```
├── src/
│   ├── app/           # Next.js App Router 페이지
│   ├── components/    # 재사용 가능한 UI 컴포넌트
│   ├── actions/       # (Legacy) 서버 액션 - 현재 클라이언트 로직으로 대체됨
│   ├── lib/           # 유틸리티 함수
│   └── utils/         # Supabase 클라이언트 설정
├── supabase/          # DB 스키마 및 마이그레이션 파일
├── android/           # Android 네이티브 프로젝트
├── ios/               # iOS 네이티브 프로젝트
└── public/            # 정적 리소스 (이미지, 아이콘 등)
```

## 📝 라이선스

이 프로젝트는 개인적인 기념일을 위해 제작되었으며, MIT 라이선스를 따릅니다.
