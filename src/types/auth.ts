export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface SignUpUser {
  id: number;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  errorCode: string;
  message: string;
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
