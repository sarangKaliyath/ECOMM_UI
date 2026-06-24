import type { CardType } from "../../types";
import productAlt from "../../assets/images/productAlt.jpg";
import { ShoppingCart } from "lucide-react";
import { isNewProduct } from "../../utils";

const Card = ({ name, price, imageUrl, createdAt }: CardType) => {
  const image =
    imageUrl?.includes("example") || !imageUrl ? productAlt : imageUrl;

  const isNew = isNewProduct(createdAt);

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full min-w-[220px]">
      <div className="relative bg-gray-50 h-64 p-6 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />

        {isNew && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            New
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3
          title={name}
          className="text-gray-800 font-bold text-2xl leading-6 line-clamp-2 min-h-[48px]"
        >
          {name}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">₹{price}</span>

          <span className="text-sm text-gray-400 line-through">
            ₹{Math.round(Number(price) * 1.2)}
          </span>
        </div>

        <div className="mt-1 text-sm text-green-600 font-medium">Save 20%</div>

        <button
          className="
            flex
            items-center
            justify-center
            gap-2
            w-full
            py-3
            mt-5
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-semibold
            transition-all
            cursor-pointer
            shadow-md
            hover:shadow-lg
          "
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card;
