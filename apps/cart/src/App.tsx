import "./App.css";
import { ErrorBoundary } from "@ecomm/ui";
import CartWallet from "./containers";

function App() {
  return (
    <ErrorBoundary name="Cart">
      <CartWallet/>
    </ErrorBoundary>
  );
}

export default App;
