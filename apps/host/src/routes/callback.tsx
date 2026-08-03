import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { refreshTokenApi, useAuthStore } from "@ecomm/auth";
import { useEffect } from "react";
import { usePostAuth } from "../hooks";

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const postAuth = usePostAuth();

  useEffect(() => {
    refreshTokenApi()
      .then(async ({ accessToken, expiresIn }) => {
        setAuth(accessToken, expiresIn);
        await postAuth();
      })
      .catch(() => {
        clearAuth();
        navigate({ to: "/login" });
      });
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-gray-500 text-sm">
      Signing you in…
    </div>
  );
}

export const oauthCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/oauth/callback",
  component: OAuthCallbackPage,
});
