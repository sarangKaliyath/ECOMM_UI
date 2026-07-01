import React, { Suspense } from "react";
import { createRoute, redirect } from "@tanstack/react-router";
import { ErrorBoundary } from "@ecomm/ui";
import { useAuthStore, waitForAuthReady } from "@ecomm/auth";
import { rootRoute } from "./__root";

const CheckoutApp = React.lazy(() => import("checkout/CheckoutApp"));

export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  beforeLoad: async () => {
    await waitForAuthReady();
    if (!useAuthStore.getState().isAuthenticated) throw redirect({ to: "/login" });
  },
  component: () => (
    <ErrorBoundary name="Checkout">
      <Suspense fallback={<div>Loading Checkout...</div>}>
        <CheckoutApp />
      </Suspense>
    </ErrorBoundary>
  ),
});
