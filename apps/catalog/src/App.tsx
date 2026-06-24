import "./App.css";
import { ErrorBoundary } from "@ecomm/ui";
import { Products, Filters } from "./containers";

function App() {
  return (
    <ErrorBoundary name="Catalog">
      <div className="flex w-full h-screen overflow-hidden bg-gray-50">
        <div className="w-64 shrink-0 border-r border-gray-200 shadow-sm">
          <Filters />
        </div>
        <div className="flex-1 min-w-0">
          <Products />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
