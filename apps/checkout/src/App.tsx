import './App.css'
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary name="Checkout">
      <div className="min-h-screen bg-blue-100 p-10">
        <h1 className="text-5xl font-bold text-blue-900">
          Checkout Microfrontend
        </h1>

        <p className="mt-4 text-xl">
          Running independently on port 3002
        </p>
      </div>
    </ErrorBoundary>
  );
}

export default App;
