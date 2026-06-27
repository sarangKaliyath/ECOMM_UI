import type { CartItem } from "@ecomm/cart";
import { ShoppingCart } from "lucide-react";

type Props = {
  items: CartItem[];
  totalItems: number;
  clearCart: () => void;
};

const CartHeader = ({ items, totalItems, clearCart }: Props) => {
  return (
    <div className={`flex items-center mb-6 flex-shrink-0 ${items.length === 0 ? "justify-center" : "justify-between"}`}>
      <div className="flex items-center gap-3">
        <ShoppingCart size={24} className="text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        {totalItems > 0 && (
          <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-2.5 py-0.5 rounded-full">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        )}
      </div>
      {items.length > 0 && (
        <button
          onClick={clearCart}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default CartHeader;
