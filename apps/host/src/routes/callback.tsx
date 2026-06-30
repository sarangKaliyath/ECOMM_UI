import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { refreshTokenApi, useAuthStore } from "@ecomm/auth";
import { useEffect } from "react";

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    refreshTokenApi()
      .then(({ accessToken, expiresIn }) => {
        setAuth(accessToken, expiresIn);
        navigate({ to: "/" });
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
