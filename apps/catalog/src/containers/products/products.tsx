import { useState, useRef, useEffect } from "react";
import { Card, CardSkeleton } from "../../common";
import { useProducts } from "../../hooks";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
} from "lucide-react";
import dayjs from "dayjs";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A–Z", value: "name_asc" },
];

const Products = () => {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const { data, isPending, isError } = useProducts({ page, size: PAGE_SIZE});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sorted = [...(data?.content ?? [])].sort((a, b) => {
    if (sort === "price_asc")
      return Number(a.defaultPrice) - Number(b.defaultPrice);
    if (sort === "price_desc")
      return Number(b.defaultPrice) - Number(a.defaultPrice);
    if (sort === "name_asc") return a.name.localeCompare(b.name);
    if (sort === "newest") {
      return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
    }
    return 0;
  });

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(0);
    setSortOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
        <p className="text-sm text-gray-500">
          {isPending ? (
            <span className="inline-block h-4 w-28 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {data?.totalElements ?? 0}
              </span>{" "}
              products
            </>
          )}
        </p>

        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all text-sm font-medium text-gray-700 cursor-pointer"
          >
            <ArrowUpDown size={14} className="text-blue-600" />
            <span>{SORT_OPTIONS.find((o) => o.value === sort)?.label}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
            />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => handleSortChange(o.value)}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                    sort === o.value
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {isError ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <PackageSearch size={48} strokeWidth={1.2} />
            <p className="text-sm font-medium">Failed to load products</p>
            <p className="text-xs">Please try refreshing the page</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {isPending
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))
              : sorted.map((item) => (
                  <Card
                    key={item.id}
                    name={item.name}
                    primaryImageUrl={item.primaryImageUrl}
                    defaultPrice={item.defaultPrice}
                    createdAt={item.createdAt}
                    currencyCode={item.currencyCode}
                    brand={item.brand}
                    averageRating={item.averageRating}
                    reviewCount={item.reviewCount}
                    inventoryStatus={item.inventoryStatus}
                    category={item.category}
                    onSale={item.onSale}
                    discountRate={item.discountRate}
                  />
                ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isError && (
        <div className="px-6 py-3.5 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={isPending || data?.first}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all text-sm font-medium text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={14} />
            Prev
          </button>

          <span className="text-sm text-gray-500">
            {isPending ? (
              <span className="inline-block h-4 w-20 bg-gray-200 rounded animate-pulse" />
            ) : (
              <>
                Page{" "}
                <span className="font-semibold text-gray-800">
                  {(data?.number ?? 0) + 1}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                  {data?.totalPages ?? 1}
                </span>
              </>
            )}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={isPending || data?.last}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all text-sm font-medium text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
