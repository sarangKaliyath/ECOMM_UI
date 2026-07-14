import { useEffect, useRef } from "react";
import { refreshAccessToken } from "./tokenRefresh";
import { useAuthStore } from "./store";

/**
 * Call once at the app root. Silently re-derives an access token from the
 * still-valid refreshToken cookie on page load. A cold load with no valid
 * cookie is a normal logged-out state, not evidence of token reuse, so
 * failure here never escalates to a session-invalid/logout-all flow.
 */
export function useBootstrapSession(): void {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    refreshAccessToken().catch(() => {
      useAuthStore.getState().clearAuth();
    });
  }, []);
}
