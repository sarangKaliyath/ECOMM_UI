import { useEffect, useRef } from "react";
import { refreshTokenApi } from "./api";
import { useAuthStore } from "./store";

export const useTokenRefresh = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = (expiresIn: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const delay = Math.max((expiresIn - 60) * 1000, 0);
    timerRef.current = setTimeout(doRefresh, delay);
  };

  const doRefresh = async () => {
    try {
      const { accessToken, expiresIn } = await refreshTokenApi();
      setAuth(accessToken, expiresIn);
      scheduleRefresh(expiresIn);
    } catch {
      clearAuth();
    }
  };

  useEffect(() => {
    doRefresh();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
};
