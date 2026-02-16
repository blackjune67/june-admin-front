import { useMutation } from "@tanstack/react-query";
import { signup } from "../../api/auth";
import type { SignUpRequest, SignUpUser } from "../../types/auth";

export const useSignUpMutation = () =>
  useMutation<SignUpUser, Error, SignUpRequest>({
    mutationFn: signup,
  });
