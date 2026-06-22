import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary name="Catalog">
      <div className="flex w-full h-screen overflow-hidden bg-blue-100">
        {/* <h1 className="text-5xl font-bold text-blue-900">
          Catalog Microfrontend
        </h1>

        <p className="mt-4 text-xl">Running independently on port 3001</p> */}

        <div className="w-1/6 border-r-2 border-gray-300">
          <h1>Filters</h1>
        </div>
        <div className="w-5/6">
          <h1>Products</h1>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
