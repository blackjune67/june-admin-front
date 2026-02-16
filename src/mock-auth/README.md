# Mock Auth Data

서버가 꺼져 있어도 로그인/회원가입을 테스트할 수 있도록 분리한 독립 mock auth 영역입니다.

## 위치

- 데이터 시드: `src/mock-auth/data/testUsers.ts`
- 동작 설정: `src/mock-auth/config.ts`
- 로직: `src/mock-auth/service.ts`

## 기본 테스트 계정

- `admin@example.com / 12345678`
- `user@example.com / 12345678`

## 동작 방식

- 기본값으로는 실제 서버 API를 우선 호출합니다.
- 서버가 꺼져 네트워크 에러(TypeError)가 나면 mock auth로 자동 fallback 됩니다.
- `localStorage` 키 `june-admin.mock-auth.users`에 사용자 데이터가 저장됩니다.

## 비활성화/활성화

`.env`에 아래 값을 추가해서 제어할 수 있습니다.

- 완전 mock 모드 강제
  - `VITE_USE_MOCK_AUTH=true`
- 네트워크 에러 시 fallback 비활성화
  - `VITE_MOCK_AUTH_FALLBACK=false`

## 데이터 초기화/삭제

브라우저 콘솔에서 실행:

```js
localStorage.removeItem("june-admin.mock-auth.users");
```

다음 로그인/회원가입 시 `testUsers.ts` 기준으로 다시 초기화됩니다.
