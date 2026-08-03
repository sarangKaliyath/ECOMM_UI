import { useEffect } from "react";
import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "../__root";
import { OrderHistorySection } from "@ecomm/ui";
import { useAuthStore, waitForAuthReady } from "@ecomm/auth";

function OrderHistoryPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  return <OrderHistorySection />;
}

export const orderHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  beforeLoad: async () => {
    await waitForAuthReady();
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: OrderHistoryPage,
});
