import { ErrorBoundary } from "@ecomm/ui";
import { SlidersHorizontal } from "lucide-react";
import FiltersInner from "./filters";

const FiltersFallback = () => (
  <div className="h-full flex flex-col bg-white overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
      <SlidersHorizontal size={16} className="text-gray-300" />
      <span className="text-sm font-bold text-gray-300">Filters</span>
    </div>

    <div className="px-5 flex-1 animate-pulse">
      {[5, 4, 3, 5, 2].map((lines, si) => (
        <div key={si} className="border-b border-gray-100 py-4 space-y-3">
          <div className="h-3 w-24 bg-gray-200 rounded-full" />
          <div className="space-y-2 mt-3">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className="h-2.5 bg-gray-100 rounded-full"
                style={{ width: `${65 + ((i * 17 + si * 11) % 30)}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="px-5 py-4 border-t border-gray-100 animate-pulse">
      <div className="h-10 w-full bg-gray-100 rounded-xl" />
    </div>
  </div>
);

const Filters = (props: React.ComponentProps<typeof FiltersInner>) => (
  <ErrorBoundary name="Filters" fallback={<FiltersFallback />}>
    <FiltersInner {...props} />
  </ErrorBoundary>
);

export default Filters;
