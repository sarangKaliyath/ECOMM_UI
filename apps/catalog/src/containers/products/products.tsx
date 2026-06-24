import { useState } from "react";
import { Card, CardSkeleton } from "../../common";
import { useProducts } from "../../hooks";
import { ArrowUpDown, PackageSearch } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A–Z", value: "name_asc" },
];

const Products = () => {
  const { data, isPending, isError } = useProducts();
  const [sort, setSort] = useState("newest");

  const sorted = [...(data ?? [])].sort((a, b) => {
    if (sort === "price_asc") return Number(a.price) - Number(b.price);
    if (sort === "price_desc") return Number(b.price) - Number(a.price);
    if (sort === "name_asc") return a.name.localeCompare(b.name);
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
              <span className="font-semibold text-gray-800">{sorted.length}</span> products
            </>
          )}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowUpDown size={14} className="text-blue-600" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent border-none text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
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
              ? Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)
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
