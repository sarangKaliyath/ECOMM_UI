import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CatalogApp from "./bootstrap.tsx";
import { ErrorBoundary } from "@ecomm/ui";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary name="Catalog">
      <CatalogApp />
    </ErrorBoundary>
  </StrictMode>,
);
