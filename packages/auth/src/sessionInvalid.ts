import { logoutAllApi } from "./api";
import { useAuthStore } from "./store";

let redirecting = false;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clears local auth state and forces a full page reload to /login.
 * Idempotent — safe to call multiple times (e.g. concurrent 401s).
 */
export function redirectToLogin(): void {
  if (redirecting) return;
  redirecting = true;
  useAuthStore.getState().clearAuth();
  window.location.href = "/login";
}

/**
 * Session is confirmed invalid (refresh failed / reuse detected).
 * Best-effort revokes the whole refresh-token family server-side,
 * then hard-redirects regardless of whether that call succeeds.
 */
export async function handleSessionInvalid(): Promise<void> {
  if (redirecting) return;
  try {
    await Promise.race([logoutAllApi(), delay(1500)]);
  } catch {
    // ignore — logging out regardless of network/server errors
  }
  redirectToLogin();
}
