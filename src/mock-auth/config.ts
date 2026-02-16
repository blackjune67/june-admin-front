export const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === "true";

export const FALLBACK_TO_MOCK_ON_NETWORK_ERROR =
  import.meta.env.VITE_MOCK_AUTH_FALLBACK !== "false";

export const MOCK_AUTH_STORAGE_KEY = "june-admin.mock-auth.users";
