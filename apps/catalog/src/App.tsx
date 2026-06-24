import "./App.css";
import { ErrorBoundary } from "@ecomm/ui";
import { Products, Filters } from "./containers";

function App() {
  return (
    <ErrorBoundary name="Catalog">
      <div className="flex w-full h-screen overflow-hidden bg-blue-100">
        <div className="w-1/6 border-r-2 border-gray-300">
          <Filters />
        </div>
        <div className="w-5/6">
          <Products />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
