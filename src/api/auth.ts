import type {
  AuthTokens,
  LoginRequest,
  RefreshRequest,
  SignUpRequest,
  SignUpUser,
} from "../types/auth";
import { publicRequest } from "./http";
import {
  FALLBACK_TO_MOCK_ON_NETWORK_ERROR,
  USE_MOCK_AUTH,
} from "../mock-auth/config";
import {
  loginWithMockAuth,
  refreshWithMockAuth,
  signUpWithMockAuth,
} from "../mock-auth/service";

const shouldFallbackToMockAuth = (error: unknown) =>
  FALLBACK_TO_MOCK_ON_NETWORK_ERROR && error instanceof TypeError;

const resolveAuthRequest = async <T>(
  serverRequest: () => Promise<T>,
  mockRequest: () => Promise<T>,
) => {
  if (USE_MOCK_AUTH) {
    return mockRequest();
  }

  try {
    return await serverRequest();
  } catch (error) {
    if (shouldFallbackToMockAuth(error)) {
      return mockRequest();
    }
    throw error;
  }
};

export const login = (payload: LoginRequest) =>
  resolveAuthRequest(
    () =>
      publicRequest<AuthTokens>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    () => loginWithMockAuth(payload),
  );

export const refresh = (payload: RefreshRequest) =>
  resolveAuthRequest(
    () =>
      publicRequest<AuthTokens>("/api/v1/auth/refresh", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    () => refreshWithMockAuth(payload),
  );

export const signup = (payload: SignUpRequest) =>
  resolveAuthRequest(
    () =>
      publicRequest<SignUpUser>("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    () => signUpWithMockAuth(payload),
  );
