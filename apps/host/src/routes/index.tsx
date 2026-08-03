import React, { Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "@ecomm/ui";
import { rootRoute } from "./__root";

const CatalogApp = React.lazy(() => import("catalog/CatalogApp"));

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <ErrorBoundary name="Catalog">
      <Suspense fallback={<div>Loading Catalog...</div>}>
        <CatalogApp />
      </Suspense>
    </ErrorBoundary>
  ),
});
