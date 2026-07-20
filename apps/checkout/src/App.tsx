import './App.css'
import { useState } from "react";
import { ErrorBoundary, LoginPromptModal, Toaster } from "@ecomm/ui";
import { useAuthStore } from "@ecomm/auth";
import { ShippingAddress, ProceedToPay, OrderSummary } from "./containers";

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <ErrorBoundary name="Checkout">
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <ShippingAddress selectedId={selectedAddressId} onSelect={setSelectedAddressId} />
              <ProceedToPay
                shippingAddressId={selectedAddressId}
                isAuthenticated={isAuthenticated}
                onRequireLogin={handleLogin}
              />
            </div>

            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        </div>

        <LoginPromptModal
          open={!isAuthenticated}
          onLogin={handleLogin}
          message="You need to be logged in to continue with checkout."
        />
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export default App;
