import "./App.css";

import React, { Suspense } from "react";
import { ErrorBoundary } from "@ecomm/ui";

const CatalogApp = React.lazy(() => import("catalog/CatalogApp"));

// const CheckoutApp = React.lazy(() => import("checkout/CheckoutApp"));

// const CartApp = React.lazy(() => import("cart/CartApp"));

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-black px-6 py-4 text-white">
        <h1 className="text-3xl font-bold">Host Application</h1>
      </div>

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
