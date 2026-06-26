import { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  X,
} from "lucide-react";
import { useCategory } from "../../hooks";
import type { ProductListParams } from "../../types";

type FilterParams = Omit<ProductListParams, "page" | "size">;

const RATINGS = [4, 3, 2, 1];

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2 cursor-pointer"
      >
        {title}
        {open ? (
          <ChevronUp size={15} className="text-gray-400" />
        ) : (
          <ChevronDown size={15} className="text-gray-400" />
        )}
      </button>
      {open && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
};

const Filters = ({
  onClose,
  onApply,
}: {
  onClose?: () => void;
  onApply: (filters: FilterParams) => void;
}) => {
  const { data } = useCategory();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);

  const reset = () => {
    setSelectedCategoryId(null);
    setPriceRange(5000);
    setSelectedRating(null);
    setInStock(false);
    setOnSale(false);
    onApply({});
  };

  const handleApply = () => {
    onApply({
      category_id: selectedCategoryId ?? undefined,
      min_price: 100,
      max_price: priceRange < 5000 ? priceRange : undefined,
      rating: selectedRating ?? undefined,
      in_stock: inStock || undefined,
      on_sale: onSale || undefined,
    });
  };

  const hasFilters =
    selectedCategoryId !== null ||
    priceRange < 5000 ||
    selectedRating !== null ||
    inStock ||
    onSale;

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-blue-600" />
          <span className="font-bold text-gray-800 text-sm">Filters</span>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="px-5 flex-1">
        {/* Categories */}
        <Section title="Category">
          {(data ?? []).map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategoryId === Number(cat.id)}
                onChange={() =>
                  setSelectedCategoryId(
                    selectedCategoryId === Number(cat.id)
                      ? null
                      : Number(cat.id),
                  )
                }
                className="w-3.5 h-3.5 rounded accent-blue-600 cursor-pointer"
              />
              <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </Section>

        {/* Price Range */}
        <Section title="Price Range">
          <div className="space-y-3">
            <input
              type="range"
              min={100}
              max={5000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>₹100</span>
              <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Up to ₹{priceRange.toLocaleString()}
              </span>
              <span>₹5,000</span>
            </div>
          </div>
        </Section>

        {/* Rating */}
        <Section title="Minimum Rating">
          {RATINGS.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRating(selectedRating === r ? null : r)}
              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                selectedRating === r
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < r ? "text-yellow-400" : "text-gray-200"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span>& above</span>
            </button>
          ))}
        </Section>

        {/* Availability */}
        <Section title="Availability">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-blue-600 cursor-pointer"
            />
            <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
              In Stock
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) => setOnSale(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-blue-600 cursor-pointer"
            />
            <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
              On Sale
            </span>
          </label>
        </Section>
      </div>

      {/* Apply Button */}
      <div className="px-5 py-4 sticky bottom-0 bg-white border-t border-gray-100">
        <button
          onClick={handleApply}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
