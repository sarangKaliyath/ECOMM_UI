import type { CardType } from "../../types";
import productAlt from "../../assets/images/productAlt.jpg";
import { ShoppingCart, Star } from "lucide-react";
import { isNewProduct } from "../../utils";
import { useCartStore } from "@ecomm/cart";

const formatPrice = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

const Card = ({
  id,
  name,
  defaultPrice,
  primaryImageUrl,
  createdAt,
  currencyCode,
  brand,
  averageRating,
  reviewCount,
  inventoryStatus,
  category,
  onSale,
  discountRate,
}: CardType) => {
  const cartItem = useCartStore((s) => s.items.find((i) => i.id === id));
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const quantity = cartItem?.quantity ?? 0;

  const image =
    primaryImageUrl?.includes("example") || !primaryImageUrl ? productAlt : primaryImageUrl;

  const isNew = isNewProduct(createdAt);
  const inStock = !inventoryStatus || inventoryStatus === "IN_STOCK";

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative bg-gray-50 h-44 p-3 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>

        <span
          className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
            inStock
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        {/* Brand + Category */}
        <div className="flex items-center justify-between gap-1">
          {brand && (
            <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase truncate">
              {brand}
            </span>
          )}
          {category && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              {category.name}
            </span>
          )}
        </div>

        {/* Name */}
        <h3
          title={name}
          className="text-gray-800 font-bold text-sm leading-5 line-clamp-2 min-h-[40px]"
        >
          {name}
        </h3>

        {/* Rating */}
        {averageRating !== undefined && (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={
                    i < Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {averageRating.toFixed(1)}
            </span>
            {reviewCount !== undefined && (
              <span className="text-xs text-gray-400">
                ({reviewCount.toLocaleString()})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-base font-bold text-gray-900">{formatPrice(defaultPrice, currencyCode)}</span>
          {onSale && discountRate && (
            <>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(defaultPrice / (1 - discountRate / 100), currencyCode)}
              </span>
              <span className="text-xs font-semibold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                -{discountRate}%
              </span>
            </>
          )}
        </div>

        {/* Cart */}
        {quantity === 0 ? (
          <button
            onClick={() => addItem({ id, name, price: defaultPrice, imageUrl: image, currencyCode })}
            className="flex items-center justify-center gap-2 w-full py-2 mt-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all cursor-pointer shadow-md hover:shadow-lg"
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between w-full mt-auto rounded-xl bg-blue-600 text-white shadow-md overflow-hidden">
            <button
              onClick={() => updateQuantity(id, quantity - 1)}
              className="px-4 py-2 text-lg font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              −
            </button>
            <span className="text-sm font-semibold">{quantity}</span>
            <button
              onClick={() => updateQuantity(id, quantity + 1)}
              className="px-4 py-2 text-lg font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
