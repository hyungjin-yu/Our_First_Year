# Our First Year (우리의 1주년)

**"우리 함께한 지 벌써 1년, 그 소중한 순간들을 담았습니다."**

사랑하는 사람과의 1주년을 기념하기 위해 제작된 프라이빗 모바일 애플리케이션입니다.  
웹 기술(Next.js)을 기반으로 Capacitor를 사용하여 네이티브 앱(Android/iOS)으로 패키징되었습니다.

## ✨ 주요 기능 (Features)

*   **💞 커플 실시간 연동 (Couple Sync)**: 초대 코드 기반으로 두 사람의 계정을 연결하여 추억과 편지를 실시간으로 공유합니다.
*   **📸 통합 갤러리 (Shared Gallery)**: 각자 올린 사진과 비밀 일기가 하나의 타임라인에 시간순으로 정렬되어 보여집니다.
*   **💌 사랑의 편지함 (Mailbox)**: 서로에게 마음을 담아 쓴 편지들을 별도로 보관하고 감상할 수 있습니다.
*   **🎨 커스텀 다이나믹 테마**: Modern Heirloom 디자인 시스템 기반으로 커플만의 특별한 배경색과 포인트 컬러(RGB)를 직접 설정할 수 있습니다.
*   **💎 프리미엄 대시보드**: 저장 공간(추억/편지 개수 제한) 관리 및 프리미엄 업셀링 모델이 탑재되어 있습니다.
*   **D-Day 카운터**: 우리가 만난 지 며칠이 지났는지, 1주년까지 얼마나 남았는지 보여주는 감성적인 메인 화면.
*   **클라우드 동기화**: Supabase를 통한 완벽한 데이터베이스(PostgreSQL) 실시간 동기화 및 이미지 클라우드 저장.

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
