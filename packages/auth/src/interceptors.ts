import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "./store";
import { refreshAccessToken } from "./tokenRefresh";
import { handleSessionInvalid } from "./sessionInvalid";

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Endpoints that must never trigger a refresh-and-retry (would recurse or make no sense).
const SKIP_REFRESH_PATHS = [
  "/auth/refresh",
  "/auth/login",
  "/auth/signup",
  "/auth/logout",
  "/auth/logout-all",
  "/verify/send",
  "/verify/confirm",
];

function isSkipped(url?: string): boolean {
  return !!url && SKIP_REFRESH_PATHS.some((path) => url.includes(path));
}

export function attachAuthInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const config = error.config as RetryableConfig | undefined;
      const status = error.response?.status;

      if (status !== 401 || !config || isSkipped(config.url)) {
        return Promise.reject(error);
      }

      if (config._retry) {
        handleSessionInvalid();
        return Promise.reject(error);
      }

      config._retry = true;
      try {
        const { accessToken } = await refreshAccessToken();
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${accessToken}`;
        return instance(config);
      } catch (refreshError) {
        handleSessionInvalid();
        return Promise.reject(refreshError);
      }
    },
  );
}
