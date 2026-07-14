import { refreshTokenApi, type RefreshResponse } from "./api";
import { useAuthStore } from "./store";

let inflight: Promise<RefreshResponse> | null = null;

export function refreshAccessToken(): Promise<RefreshResponse> {
  if (inflight) return inflight;

  inflight = refreshTokenApi()
    .then((res) => {
      useAuthStore.getState().setAuth(res.accessToken, res.expiresIn);
      return res;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
