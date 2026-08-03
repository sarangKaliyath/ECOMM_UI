import { useEffect, useRef } from "react";
import { refreshAccessToken } from "./tokenRefresh";
import { useAuthStore } from "./store";
import { handleSessionInvalid } from "./sessionInvalid";

export const useTokenRefresh = () => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = (expiresAt: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const delay = Math.max(expiresAt - Date.now() - 60_000, 0);
    timerRef.current = setTimeout(doRefresh, delay);
  };

  const doRefresh = async () => {
    try {
      const { expiresIn } = await refreshAccessToken();
      scheduleRefresh(Date.now() + expiresIn * 1000);
    } catch {
      // A previously-established session's refresh failed outright:
      // treat as reuse/revocation, not a benign cold start.
      handleSessionInvalid();
    }
  };

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state, prevState) => {
      if (state.expiresAt && state.expiresAt !== prevState.expiresAt) {
        scheduleRefresh(state.expiresAt);
      }
      if (!state.isAuthenticated && timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    });

    const { expiresAt } = useAuthStore.getState();
    if (expiresAt) scheduleRefresh(expiresAt);

    return () => {
      unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
};
