import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";
import { useAuthStore, type AuthStore } from "../../stores/authStore";
import type { AuthTokens, LoginRequest } from "../../types/auth";

export interface LoginMutationVariables extends LoginRequest {
  rememberMe: boolean;
}

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state: AuthStore) => state.setAuth);

  return useMutation<AuthTokens, Error, LoginMutationVariables>({
    mutationFn: ({ email, password }) => login({ email, password }),
    onSuccess: (tokens, variables) => {
      setAuth(tokens, variables.rememberMe);
    },
  });
};
