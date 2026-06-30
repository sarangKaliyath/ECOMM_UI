import { useMutation } from "@tanstack/react-query";
import { loginApi, signupApi, logoutApi, refreshTokenApi } from "./api";
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
  const setAuth = useAuthStore((s) => s.setAuth);
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
      await loginApi(email, password);
      const { accessToken, expiresIn } = await refreshTokenApi();
      setAuth(accessToken, expiresIn);
    },
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  return useMutation({
    mutationFn: async () => {
      await logoutApi();
      clearAuth();
    },
  });
};
