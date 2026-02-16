import { getAuthState } from "../stores/authStore";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiResponse,
  AuthTokens,
  RefreshRequest,
} from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  errorCode?: string;
  timestamp?: string;

  constructor(message: string, status: number, errorCode?: string, timestamp?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
    this.timestamp = timestamp;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isSuccessResponse = <T>(payload: unknown): payload is ApiSuccessResponse<T> =>
  isRecord(payload) && payload.success === true && "data" in payload;

const isErrorResponse = (payload: unknown): payload is ApiErrorResponse =>
  isRecord(payload) && payload.success === false;

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

const toApiError = (status: number, payload: unknown): ApiError => {
  if (isErrorResponse(payload)) {
    return new ApiError(payload.message, status, payload.errorCode, payload.timestamp);
  }

  if (isRecord(payload) && typeof payload.message === "string") {
    return new ApiError(payload.message, status);
  }

  return new ApiError("요청 처리 중 오류가 발생했습니다.", status);
};

const request = async <T>(
  path: string,
  init: RequestInit,
  options?: {
    accessToken?: string;
  },
): Promise<T> => {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (options?.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const payload = (await parseResponseBody(response)) as ApiResponse<T> | null;

  if (!response.ok) {
    throw toApiError(response.status, payload);
  }

  if (!payload) {
    throw new ApiError("응답 데이터가 비어있습니다.", response.status);
  }

  if (isErrorResponse(payload)) {
    throw toApiError(response.status, payload);
  }

  if (!isSuccessResponse<T>(payload)) {
    throw new ApiError("응답 형식이 올바르지 않습니다.", response.status);
  }

  return payload.data;
};

const refreshAccessToken = async (): Promise<string> => {
  const { refreshToken, rememberMe, setAuth, clearAuth } = getAuthState();

  if (!refreshToken) {
    throw new ApiError("세션이 만료되었습니다. 다시 로그인해주세요.", 401, "UNAUTHORIZED");
  }

  try {
    const tokens = await request<AuthTokens>(
      "/api/v1/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken } satisfies RefreshRequest),
      },
      undefined,
    );

    setAuth(tokens, rememberMe);
    return tokens.accessToken;
  } catch (error) {
    clearAuth();
    throw error;
  }
};

export const publicRequest = async <T>(path: string, init: RequestInit): Promise<T> =>
  request<T>(path, init);

export const authRequest = async <T>(path: string, init: RequestInit): Promise<T> => {
  const { accessToken } = getAuthState();

  try {
    return await request<T>(path, init, { accessToken: accessToken ?? undefined });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }

    const nextAccessToken = await refreshAccessToken();
    return request<T>(path, init, { accessToken: nextAccessToken });
  }
};
