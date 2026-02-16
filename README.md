# June Admin Front

React + TypeScript 기반의 관리자 대시보드 프론트엔드 프로젝트입니다.

## Tech Stack

| 분류 | 기술 |
|------|------|
| Framework | React 19, TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| State Management | Zustand, Immer |
| Server State | TanStack React Query |
| Routing | React Router v7 |
| Charts | ApexCharts |
| Calendar | FullCalendar |
| Linting / Formatting | ESLint, Prettier |

## Getting Started

### Prerequisites

- Node.js 18.x 이상 (20.x 이상 권장)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # API 통신 모듈 (axios, auth)
├── components/       # 재사용 가능한 UI 컴포넌트
│   ├── auth/         # 인증 관련 (로그인, 회원가입 폼)
│   ├── charts/       # 차트 컴포넌트 (Bar, Line)
│   ├── common/       # 공통 컴포넌트 (Breadcrumb, Theme Toggle 등)
│   ├── ecommerce/    # 대시보드 위젯 (매출, 통계, 주문)
│   ├── form/         # 폼 요소 (Input, Select, DatePicker 등)
│   ├── header/       # 헤더 (알림, 사용자 드롭다운)
│   ├── tables/       # 테이블 컴포넌트
│   ├── ui/           # 기본 UI (Alert, Badge, Button, Modal 등)
│   └── UserProfile/  # 사용자 프로필 카드
├── context/          # React Context (Locale, Sidebar, Theme)
├── features/         # 기능별 hooks (auth mutations)
├── hooks/            # 공통 커스텀 hooks
├── i18n/             # 다국어 번역 파일
├── icons/            # SVG 아이콘
├── layout/           # 레이아웃 (AppHeader, AppSidebar, AppLayout)
├── lib/              # 유틸리티 (queryClient)
├── pages/            # 페이지 컴포넌트
│   ├── AuthPages/    # 로그인, 회원가입
│   ├── Charts/       # 차트 페이지
│   ├── Dashboard/    # 대시보드 홈
│   ├── Forms/        # 폼 요소 페이지
│   ├── Tables/       # 테이블 페이지
│   └── UiElements/   # UI 요소 페이지
├── stores/           # Zustand 스토어 (auth)
└── types/            # TypeScript 타입 정의
```

## Features

- 대시보드 (매출 통계, 차트, 최근 주문)
- 인증 (로그인 / 회원가입)
- 다국어 지원 (i18n)
- 다크모드
- 캘린더 (드래그 앤 드롭)
- 차트 (Bar, Line)
- 폼 요소 (Input, Select, DatePicker, DropZone 등)
- 테이블
- UI 컴포넌트 (Alert, Avatar, Badge, Button, Modal 등)

## Scripts

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | TypeScript 체크 + 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint 검사 |
| `npm run format` | Prettier 포맷팅 |
| `npm run format:check` | 포맷팅 상태 확인 |

## License

MIT
