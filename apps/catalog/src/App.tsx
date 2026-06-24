import "./App.css";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ErrorBoundary } from "@ecomm/ui";
import { Products, Filters } from "./containers";

function App() {
  const [filtersOpen, setFiltersOpen] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches,
  );

  return (
    <ErrorBoundary name="Catalog">
      <div className="flex w-full h-screen overflow-hidden bg-gray-50">
        {/* Mobile backdrop */}
        {filtersOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setFiltersOpen(false)}
          />
        )}

        {/* Filter sidebar — drawer on mobile, static on md+ */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-gray-200 shadow-sm transition-transform duration-300 md:relative md:inset-auto md:z-auto md:translate-x-0 ${
            filtersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Filters onClose={() => setFiltersOpen(false)} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Mobile filter toggle bar */}
          {!filtersOpen && (
            <div className="flex items-center px-4 py-2.5 bg-white border-b border-gray-200 md:hidden">
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>
            </div>
          )}
          <div className="flex-1 min-h-0">
            <Products />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
