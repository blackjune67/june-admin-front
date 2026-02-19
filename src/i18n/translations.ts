export type Locale = "en" | "ko";

export const DEFAULT_LOCALE: Locale = "en";

const en = {
  "common.language": "Language",
  "common.backToDashboard": "Back to dashboard",
  "common.or": "Or",
  "common.name": "Name",
  "common.email": "Email",
  "common.password": "Password",
  "common.searchPlaceholder": "Search or type command...",
  "common.keepLoggedIn": "Keep me logged in",
  "common.forgotPassword": "Forgot password?",
  "common.signIn": "Sign In",
  "common.signUp": "Sign Up",
  "common.signingIn": "Signing in...",
  "common.signingUp": "Signing up...",
  "common.oauthPreparing": "This feature is coming soon.",
  "common.logoAlt": "Logo",

  "auth.signIn.title": "Sign In",
  "auth.signIn.subtitle": "Enter your email and password to sign in!",
  "auth.signIn.withGoogle": "Sign in with Google",
  "auth.signIn.withX": "Sign in with X",
  "auth.signIn.noAccount": "Don't have an account?",
  "auth.signIn.emailPlaceholder": "admin@example.com",
  "auth.signIn.passwordPlaceholder": "Enter your password",
  "auth.signIn.requestError": "Something went wrong while signing in.",
  "auth.signIn.emailRequired": "Email is required.",
  "auth.signIn.emailInvalid": "Please enter a valid email address.",
  "auth.signIn.passwordRequired": "Password is required.",

  "auth.signUp.title": "Sign Up",
  "auth.signUp.subtitle": "Enter your information to create an account.",
  "auth.signUp.withGoogle": "Sign up with Google",
  "auth.signUp.withX": "Sign up with X",
  "auth.signUp.namePlaceholder": "Enter your name",
  "auth.signUp.emailPlaceholder": "Enter your email",
  "auth.signUp.passwordPlaceholder": "Enter your password",
  "auth.signUp.alreadyHaveAccount": "Already have an account?",
  "auth.signUp.termsText":
    "By creating an account means you agree to the Terms and Conditions, and our Privacy Policy",
  "auth.signUp.requestError": "Something went wrong while signing up.",
  "auth.signUp.autoLoginFailed":
    "Your account was created, but automatic sign-in failed.",
  "auth.signUp.nameRequired": "Name is required.",
  "auth.signUp.emailRequired": "Email is required.",
  "auth.signUp.emailInvalid": "Please enter a valid email address.",
  "auth.signUp.passwordRequired": "Password is required.",
  "auth.signUp.passwordMin": "Password must be at least 8 characters.",
  "auth.signUp.termsRequired": "Please agree to the terms.",

  "auth.layout.tagline": "Free and Open-Source Tailwind CSS Admin Dashboard Template",

  "auth.celebration.badge": "Account Created",
  "auth.celebration.welcome": "Welcome, {name}",
  "auth.celebration.message": "Your account is ready. Redirecting to dashboard...",

  "auth.errors.invalidCredentials": "Invalid email or password.",
  "auth.errors.validation": "Please check your input values.",
  "auth.errors.duplicate": "This email is already in use.",
  "auth.errors.unauthorized": "Your session has expired. Please sign in again.",

  "sidebar.section.menu": "Menu",
  "sidebar.section.others": "Others",
  "sidebar.dashboard": "Dashboard",
  "sidebar.ecommerce": "Ecommerce",
  "sidebar.calendar": "Calendar",
  "sidebar.userProfile": "User Profile",
  "sidebar.forms": "Forms",
  "sidebar.formElements": "Form Elements",
  "sidebar.tables": "Tables",
  "sidebar.basicTables": "Basic Tables",
  "sidebar.pages": "Pages",
  "sidebar.blankPage": "Blank Page",
  "sidebar.error404": "404 Error",
  "sidebar.charts": "Charts",
  "sidebar.lineChart": "Line Chart",
  "sidebar.barChart": "Bar Chart",
  "sidebar.uiElements": "UI Elements",
  "sidebar.alerts": "Alerts",
  "sidebar.avatar": "Avatar",
  "sidebar.badge": "Badge",
  "sidebar.buttons": "Buttons",
  "sidebar.images": "Images",
  "sidebar.videos": "Videos",
  "sidebar.authentication": "Authentication",
  "sidebar.signIn": "Sign In",
  "sidebar.signUp": "Sign Up",
  "sidebar.badgeNew": "New",
  "sidebar.badgePro": "Pro",
  "sidebar.widget.title": "#1 Tailwind CSS Dashboard",
  "sidebar.widget.description":
    "Leading Tailwind CSS Admin Template with 400+ UI components and pages.",
  "sidebar.widget.cta": "Purchase Plan",
  "sidebar.automation": "Automation",
  "sidebar.usageComparison": "Usage Comparison",
  "sidebar.section.system": "System",
  "sidebar.systemMenu": "System",
  "sidebar.rolePermissions": "Role-Permission Management",
  "sidebar.userRoles": "User-Role Management",
} as const;

const ko: Record<keyof typeof en, string> = {
  "common.language": "언어",
  "common.backToDashboard": "대시보드로 이동",
  "common.or": "또는",
  "common.name": "이름",
  "common.email": "이메일",
  "common.password": "비밀번호",
  "common.searchPlaceholder": "검색하거나 명령어를 입력하세요...",
  "common.keepLoggedIn": "로그인 상태 유지",
  "common.forgotPassword": "비밀번호를 잊으셨나요?",
  "common.signIn": "로그인",
  "common.signUp": "회원가입",
  "common.signingIn": "로그인 중...",
  "common.signingUp": "회원가입 중...",
  "common.oauthPreparing": "준비중입니다",
  "common.logoAlt": "로고",

  "auth.signIn.title": "로그인",
  "auth.signIn.subtitle": "이메일과 비밀번호를 입력해 로그인하세요.",
  "auth.signIn.withGoogle": "Google로 로그인",
  "auth.signIn.withX": "X로 로그인",
  "auth.signIn.noAccount": "계정이 없으신가요?",
  "auth.signIn.emailPlaceholder": "admin@example.com",
  "auth.signIn.passwordPlaceholder": "비밀번호를 입력하세요",
  "auth.signIn.requestError": "로그인 중 오류가 발생했습니다.",
  "auth.signIn.emailRequired": "이메일은 필수입니다.",
  "auth.signIn.emailInvalid": "올바른 이메일 형식을 입력해주세요.",
  "auth.signIn.passwordRequired": "비밀번호는 필수입니다.",

  "auth.signUp.title": "회원가입",
  "auth.signUp.subtitle": "계정 생성을 위해 정보를 입력해주세요.",
  "auth.signUp.withGoogle": "Google로 회원가입",
  "auth.signUp.withX": "X로 회원가입",
  "auth.signUp.namePlaceholder": "이름을 입력하세요",
  "auth.signUp.emailPlaceholder": "이메일을 입력하세요",
  "auth.signUp.passwordPlaceholder": "비밀번호를 입력하세요",
  "auth.signUp.alreadyHaveAccount": "이미 계정이 있으신가요?",
  "auth.signUp.termsText": "회원가입 시 이용약관 및 개인정보 처리방침에 동의한 것으로 간주됩니다.",
  "auth.signUp.requestError": "회원가입 요청 중 오류가 발생했습니다.",
  "auth.signUp.autoLoginFailed": "회원가입은 완료됐지만 자동 로그인에 실패했습니다.",
  "auth.signUp.nameRequired": "이름은 필수입니다.",
  "auth.signUp.emailRequired": "이메일은 필수입니다.",
  "auth.signUp.emailInvalid": "올바른 이메일 형식을 입력해주세요.",
  "auth.signUp.passwordRequired": "비밀번호는 필수입니다.",
  "auth.signUp.passwordMin": "비밀번호는 최소 8자 이상이어야 합니다.",
  "auth.signUp.termsRequired": "약관에 동의해주세요.",

  "auth.layout.tagline": "무료 오픈소스 Tailwind CSS 관리자 대시보드 템플릿",

  "auth.celebration.badge": "계정 생성 완료",
  "auth.celebration.welcome": "환영합니다, {name}님",
  "auth.celebration.message": "계정 생성이 완료되었습니다. 곧 대시보드로 이동합니다.",

  "auth.errors.invalidCredentials": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "auth.errors.validation": "입력값을 확인해주세요.",
  "auth.errors.duplicate": "이미 사용 중인 이메일입니다.",
  "auth.errors.unauthorized": "세션이 만료되었습니다. 다시 로그인해주세요.",

  "sidebar.section.menu": "메뉴",
  "sidebar.section.others": "기타",
  "sidebar.dashboard": "대시보드",
  "sidebar.ecommerce": "이커머스",
  "sidebar.calendar": "캘린더",
  "sidebar.userProfile": "사용자 프로필",
  "sidebar.forms": "폼",
  "sidebar.formElements": "폼 요소",
  "sidebar.tables": "테이블",
  "sidebar.basicTables": "기본 테이블",
  "sidebar.pages": "페이지",
  "sidebar.blankPage": "빈 페이지",
  "sidebar.error404": "404 오류",
  "sidebar.charts": "차트",
  "sidebar.lineChart": "라인 차트",
  "sidebar.barChart": "바 차트",
  "sidebar.uiElements": "UI 요소",
  "sidebar.alerts": "알림",
  "sidebar.avatar": "아바타",
  "sidebar.badge": "배지",
  "sidebar.buttons": "버튼",
  "sidebar.images": "이미지",
  "sidebar.videos": "비디오",
  "sidebar.authentication": "인증",
  "sidebar.signIn": "로그인",
  "sidebar.signUp": "회원가입",
  "sidebar.badgeNew": "신규",
  "sidebar.badgePro": "프로",
  "sidebar.widget.title": "No.1 Tailwind CSS 대시보드",
  "sidebar.widget.description":
    "400개 이상의 UI 컴포넌트와 페이지를 제공하는 대표 Tailwind CSS 관리자 템플릿입니다.",
  "sidebar.widget.cta": "플랜 구매",
  "sidebar.automation": "자동화",
  "sidebar.usageComparison": "재고 사용량 비교",
  "sidebar.section.system": "시스템",
  "sidebar.systemMenu": "시스템메뉴",
  "sidebar.rolePermissions": "역할-권한 관리",
  "sidebar.userRoles": "사용자-역할 관리",
};

export const translations = {
  en,
  ko,
};

export type TranslationKey = keyof typeof en;

type TranslateVariables = Record<string, string | number>;

export const translate = (
  locale: Locale,
  key: TranslationKey,
  variables?: TranslateVariables,
): string => {
  const template = translations[locale][key] ?? translations.en[key] ?? key;

  if (!variables) {
    return template;
  }

  return Object.entries(variables).reduce(
    (acc, [name, value]) => acc.split(`{${name}}`).join(String(value)),
    template,
  );
};

export const isLocale = (value: string): value is Locale =>
  value === "en" || value === "ko";
