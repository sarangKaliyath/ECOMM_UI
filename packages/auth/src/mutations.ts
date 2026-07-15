import { useMutation } from "@tanstack/react-query";
import {
  loginApi,
  signupApi,
  logoutApi,
  logoutAllApi,
  refreshTokenApi,
  sendVerificationApi,
  confirmVerificationApi,
  type VerificationType,
} from "./api";
import { useAuthStore } from "./store";

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      await loginApi(email, password);
      const { accessToken, expiresIn } = await refreshTokenApi();
      setAuth(accessToken, expiresIn);
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      await signupApi(name, email, password);
      await sendVerificationApi(email, "EMAIL_VERIFICATION");
    },
  });
};

export const useSendVerification = () =>
  useMutation({
    mutationFn: ({
      email,
      verificationType,
    }: {
      email: string;
      verificationType: VerificationType;
    }) => sendVerificationApi(email, verificationType),
  });

export const useConfirmVerification = () =>
  useMutation({
    mutationFn: ({
      email,
      code,
      verificationType,
    }: {
      email: string;
      code: string;
      verificationType: VerificationType;
    }) => confirmVerificationApi(email, code, verificationType),
  });

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  return useMutation({
    mutationFn: async () => {
      try {
        await logoutApi();
      } finally {
        clearAuth();
      }
    },
  });
};

export const useLogoutAll = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  return useMutation({
    mutationFn: async () => {
      try {
        await logoutAllApi();
      } finally {
        clearAuth();
      }
    },
  });
};
