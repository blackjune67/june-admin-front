import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { AuthTokens } from "../types/auth";

const AUTH_STORAGE_KEY = "june-admin.auth";

type StoredAuthState = {
  tokens: AuthTokens;
  rememberMe: boolean;
};

export interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string;
  rememberMe: boolean;
  isAuthenticated: boolean;
  setAuth: (tokens: AuthTokens, rememberMe: boolean) => void;
  updateAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

const isBrowser = typeof window !== "undefined";

const safeParseStoredAuth = (value: string | null): StoredAuthState | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as StoredAuthState;
    if (
      parsed.tokens?.accessToken &&
      parsed.tokens?.refreshToken &&
      parsed.tokens?.tokenType
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

const readInitialState = (): {
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string;
  rememberMe: boolean;
} => {
  if (!isBrowser) {
    return {
      accessToken: null,
      refreshToken: null,
      tokenType: "Bearer",
      rememberMe: false,
    };
  }

  const localStored = safeParseStoredAuth(
    window.localStorage.getItem(AUTH_STORAGE_KEY),
  );
  if (localStored) {
    return {
      accessToken: localStored.tokens.accessToken,
      refreshToken: localStored.tokens.refreshToken,
      tokenType: localStored.tokens.tokenType,
      rememberMe: localStored.rememberMe,
    };
  }

  const sessionStored = safeParseStoredAuth(
    window.sessionStorage.getItem(AUTH_STORAGE_KEY),
  );
  if (sessionStored) {
    return {
      accessToken: sessionStored.tokens.accessToken,
      refreshToken: sessionStored.tokens.refreshToken,
      tokenType: sessionStored.tokens.tokenType,
      rememberMe: sessionStored.rememberMe,
    };
  }

  return {
    accessToken: null,
    refreshToken: null,
    tokenType: "Bearer",
    rememberMe: false,
  };
};

const persistAuth = (tokens: AuthTokens, rememberMe: boolean) => {
  if (!isBrowser) {
    return;
  }

  const payload: StoredAuthState = {
    tokens,
    rememberMe,
  };

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);

  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
};

const clearPersistedAuth = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
};

const initialState = readInitialState();

export const useAuthStore = create<AuthStore>()(
  immer((set, get) => ({
    accessToken: initialState.accessToken,
    refreshToken: initialState.refreshToken,
    tokenType: initialState.tokenType,
    rememberMe: initialState.rememberMe,
    isAuthenticated: Boolean(initialState.accessToken),
    setAuth: (tokens, rememberMe) => {
      persistAuth(tokens, rememberMe);
      set((state) => {
        state.accessToken = tokens.accessToken;
        state.refreshToken = tokens.refreshToken;
        state.tokenType = tokens.tokenType;
        state.rememberMe = rememberMe;
        state.isAuthenticated = true;
      });
    },
    updateAccessToken: (accessToken) => {
      const { refreshToken, tokenType, rememberMe } = get();
      if (!refreshToken) {
        return;
      }

      persistAuth(
        {
          accessToken,
          refreshToken,
          tokenType,
        },
        rememberMe,
      );

      set((state) => {
        state.accessToken = accessToken;
        state.isAuthenticated = true;
      });
    },
    clearAuth: () => {
      clearPersistedAuth();
      set((state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.tokenType = "Bearer";
        state.rememberMe = false;
        state.isAuthenticated = false;
      });
    },
  })),
);

export const getAuthState = () => useAuthStore.getState();
