import { ApiError } from "../api/http";
import type {
  AuthTokens,
  LoginRequest,
  RefreshRequest,
  SignUpRequest,
  SignUpUser,
} from "../types/auth";
import { mockSeedUsers, type MockSeedUser } from "./data/testUsers";
import { MOCK_AUTH_STORAGE_KEY } from "./config";

type MockUser = MockSeedUser;

const isBrowser = typeof window !== "undefined";

let inMemoryUsers: MockUser[] = [...mockSeedUsers];

const randomTokenChunk = () => `${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}`;

const createMockTokens = (): AuthTokens => ({
  accessToken: `mock-access.${randomTokenChunk()}`,
  refreshToken: `mock-refresh.${randomTokenChunk()}`,
  tokenType: "Bearer",
});

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const cloneUsers = (users: MockUser[]) => users.map((user) => ({ ...user }));

const parseUsers = (raw: string | null): MockUser[] | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as MockUser[];

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed.filter(
      (user) =>
        typeof user.id === "number" &&
        typeof user.name === "string" &&
        typeof user.email === "string" &&
        typeof user.password === "string" &&
        typeof user.role === "string" &&
        typeof user.isActive === "boolean",
    );
  } catch {
    return null;
  }
};

const saveUsers = (users: MockUser[]) => {
  const nextUsers = cloneUsers(users);

  inMemoryUsers = nextUsers;

  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(nextUsers));
};

const getUsers = (): MockUser[] => {
  if (!isBrowser) {
    return cloneUsers(inMemoryUsers);
  }

  const parsed = parseUsers(window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY));
  if (!parsed || parsed.length === 0) {
    saveUsers(mockSeedUsers);
    return cloneUsers(mockSeedUsers);
  }

  return cloneUsers(parsed);
};

const toSignUpUser = (user: MockUser): SignUpUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  isActive: user.isActive,
});

const validateSignUpPayload = (payload: SignUpRequest) => {
  if (!payload.name.trim()) {
    throw new ApiError("name: 이름은 필수입니다.", 400, "VALIDATION_ERROR");
  }

  if (!payload.email.trim()) {
    throw new ApiError("email: 이메일은 필수입니다.", 400, "VALIDATION_ERROR");
  }

  if (!payload.password.trim()) {
    throw new ApiError("password: 비밀번호는 필수입니다.", 400, "VALIDATION_ERROR");
  }

  if (payload.password.length < 8) {
    throw new ApiError("password: 비밀번호는 최소 8자 이상이어야 합니다.", 400, "VALIDATION_ERROR");
  }
};

export const loginWithMockAuth = async (
  payload: LoginRequest,
): Promise<AuthTokens> => {
  const users = getUsers();
  const email = normalizeEmail(payload.email);
  const password = payload.password;

  if (!email || !password) {
    throw new ApiError(
      "email 또는 password가 비어 있습니다.",
      400,
      "VALIDATION_ERROR",
    );
  }

  const user = users.find((candidate) => normalizeEmail(candidate.email) === email);

  if (!user || user.password !== password) {
    throw new ApiError(
      "이메일 또는 비밀번호가 올바르지 않습니다.",
      401,
      "UNAUTHORIZED",
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      "비활성화된 계정입니다.",
      400,
      "VALIDATION_ERROR",
    );
  }

  return createMockTokens();
};

export const signUpWithMockAuth = async (
  payload: SignUpRequest,
): Promise<SignUpUser> => {
  validateSignUpPayload(payload);

  const users = getUsers();
  const normalizedEmail = normalizeEmail(payload.email);

  const exists = users.some(
    (candidate) => normalizeEmail(candidate.email) === normalizedEmail,
  );

  if (exists) {
    throw new ApiError("이미 사용 중인 이메일입니다.", 409, "DUPLICATE");
  }

  const nextId = users.reduce((max, current) => Math.max(max, current.id), 0) + 1;

  const nextUser: MockUser = {
    id: nextId,
    name: payload.name.trim(),
    email: normalizedEmail,
    password: payload.password,
    role: "USER",
    isActive: true,
  };

  const nextUsers = [...users, nextUser];
  saveUsers(nextUsers);

  return toSignUpUser(nextUser);
};

export const refreshWithMockAuth = async (
  payload: RefreshRequest,
): Promise<AuthTokens> => {
  if (!payload.refreshToken.trim()) {
    throw new ApiError("refreshToken이 비어 있습니다.", 401, "UNAUTHORIZED");
  }

  return createMockTokens();
};

export const resetMockAuthData = () => {
  saveUsers(mockSeedUsers);
};

export const clearMockAuthData = () => {
  inMemoryUsers = [];

  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
};
