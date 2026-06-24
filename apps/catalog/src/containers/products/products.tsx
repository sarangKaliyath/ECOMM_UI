import { useState, useRef, useEffect } from "react";
import { Card, CardSkeleton } from "../../common";
import { useProducts } from "../../hooks";
import { ArrowUpDown, ChevronDown, PackageSearch } from "lucide-react";
import dayjs from "dayjs";

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A–Z", value: "name_asc" },
];

const Products = () => {
  const { data, isPending, isError } = useProducts();
  const [sort, setSort] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sorted = [...(data ?? [])].sort((a, b) => {
    if (sort === "price_asc") return Number(a.price) - Number(b.price);
    if (sort === "price_desc") return Number(b.price) - Number(a.price);
    if (sort === "name_asc") return a.name.localeCompare(b.name);
    if (sort === "newest") {
      return dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf();
    }
    return 0;
  });

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
                {sorted.length}
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
                  onClick={() => {
                    setSort(o.value);
                    setSortOpen(false);
                  }}
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
              ? Array.from({ length: 10 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))
              : sorted.map((item) => (
                  <Card
                    key={item.id}
                    name={item?.name}
                    imageUrl={item?.imageUrl}
                    price={item?.price}
                    createdAt={item?.created_at}
                  />
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
