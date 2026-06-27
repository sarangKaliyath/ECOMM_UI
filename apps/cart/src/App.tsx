import "./App.css";
import { ErrorBoundary } from "@ecomm/ui";
import CartWallet from "./containers";
import { Suspense } from "react";

function App() {
  return (
    <ErrorBoundary name="Cart">
      <Suspense fallback={<h1>Cart Loading</h1>}>
        <CartWallet/>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
