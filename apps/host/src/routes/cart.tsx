import React, { Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "@ecomm/ui";
import { rootRoute } from "./__root";

const CartApp = React.lazy(() => import("cart/CartApp"));

export const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: () => (
    <ErrorBoundary name="Cart">
      <Suspense fallback={<div>Loading Cart...</div>}>
        <CartApp />
      </Suspense>
    </ErrorBoundary>
  ),
});
