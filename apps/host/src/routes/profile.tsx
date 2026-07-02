import { useEffect } from "react";
import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { ProfileSection } from "@ecomm/ui";
import { useAuthStore } from "@ecomm/auth";

function ProfilePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  return <ProfileSection />;
}

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: ProfilePage,
});
