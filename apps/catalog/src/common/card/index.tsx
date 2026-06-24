import { useState } from "react";
import type { CardType } from "../../types";
import productAlt from "../../assets/images/productAlt.jpg";
import { ShoppingCart } from "lucide-react";
import { isNewProduct } from "../../utils";

const Card = ({ name, price, imageUrl, createdAt }: CardType) => {
  const [quantity, setQuantity] = useState(0);

  const image =
    imageUrl?.includes("example") || !imageUrl ? productAlt : imageUrl;

  const isNew = isNewProduct(createdAt);

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative bg-gray-50 h-40 p-3 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />

        {isNew && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            New
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3">
        <h3
          title={name}
          className="text-gray-800 font-bold text-sm leading-5 line-clamp-2 min-h-[40px]"
        >
          {name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">₹{price}</span>

          <span className="text-xs text-gray-400 line-through">
            ₹{Math.round(Number(price) * 1.2)}
          </span>
        </div>

        <div className="mt-0.5 text-xs text-green-600 font-medium">Save 20%</div>

        {quantity === 0 ? (
          <button
            onClick={() => setQuantity(1)}
            className="flex items-center justify-center gap-2 w-full py-2 mt-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all cursor-pointer shadow-md hover:shadow-lg"
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between w-full mt-3 rounded-xl bg-blue-600 text-white shadow-md overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(0, q - 1))}
              className="px-4 py-2 text-lg font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              −
            </button>
            <span className="text-sm font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
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
