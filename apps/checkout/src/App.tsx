import './App.css'
import { ErrorBoundary, LoginPromptModal } from "@ecomm/ui";
import { useAuthStore } from "@ecomm/auth";
import { ShippingAddress, ProceedToPay, OrderSummary } from "./containers";

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleProceedToPay = () => {
    if (!isAuthenticated) {
      handleLogin();
    }
  };

  return (
    <ErrorBoundary name="Checkout">
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <ShippingAddress />
              <ProceedToPay onProceed={handleProceedToPay} />
            </div>

            <div className="lg:col-span-1">
              <OrderSummary onPlaceOrder={handleProceedToPay} />
            </div>
          </div>
        </div>

        <LoginPromptModal
          open={!isAuthenticated}
          onLogin={handleLogin}
          message="You need to be logged in to continue with checkout."
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
