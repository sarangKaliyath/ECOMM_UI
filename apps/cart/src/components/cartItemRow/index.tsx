import type { CartItem } from "@ecomm/cart";
import {Trash2, Plus, Minus } from "lucide-react";
import { useCartStore, useCartSync } from "@ecomm/cart";
import { formatPrice } from "../../utils";

const CartItemRow = ({ item }: { item: CartItem }) => {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { scheduleSync, syncDelete } = useCartSync(item.id);

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-16 h-16 object-contain rounded-xl bg-gray-50 p-1 shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm leading-5 line-clamp-2">{item.name}</p>
        <p className="text-blue-600 font-bold text-sm mt-0.5">
          {formatPrice(item.price, item.currencyCode)}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center rounded-xl bg-gray-100 overflow-hidden">
          <button
            onClick={() => {
              if (item.quantity === 1) { removeItem(item.id); syncDelete(); }
              else { updateQuantity(item.id, item.quantity - 1); scheduleSync(); }
            }}
            className="px-2.5 py-1.5 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Minus size={14} />
          </button>
          <span className="px-3 text-sm font-semibold text-gray-800">{item.quantity}</span>
          <button
            onClick={() => { updateQuantity(item.id, item.quantity + 1); scheduleSync(); }}
            className="px-2.5 py-1.5 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>

        <p className="w-20 text-right text-sm font-bold text-gray-900">
          {formatPrice(item.price * item.quantity, item.currencyCode)}
        </p>

        <button
          onClick={() => { removeItem(item.id); syncDelete(); }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;