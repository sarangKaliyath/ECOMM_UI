import "./App.css";

import React, { Suspense } from "react";
import { ErrorBoundary } from "@ecomm/ui";
import { Navbar } from "./components";

const CatalogApp = React.lazy(() => import("catalog/CatalogApp"));

// const CheckoutApp = React.lazy(() => import("checkout/CheckoutApp"));

// const CartApp = React.lazy(() => import("cart/CartApp"));

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-col flex-1 overflow-auto">
        <ErrorBoundary name="Catalog">
          <Suspense fallback={<div>Loading Catalog...</div>}>
            <CatalogApp />
          </Suspense>
        </ErrorBoundary>
        {/* <ErrorBoundary name="Checkout">
          <Suspense fallback={<div>Loading Checkout...</div>}>
            <CheckoutApp />
          </Suspense>
        </ErrorBoundary> */}
        {/* <ErrorBoundary name="Cart">
          <Suspense fallback={<div>Loading Cart...</div>}>
            <CartApp />
          </Suspense>
        </ErrorBoundary> */}
      </div>
    </div>
  );
}

export default App;
