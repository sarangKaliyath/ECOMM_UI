import { useState, useRef, useEffect } from "react";
import type { CartItem } from "@ecomm/cart";
import { Trash2, ChevronDown } from "lucide-react";
import { useCartStore, useCartSync } from "@ecomm/cart";
import { formatPrice } from "../../utils";

const CartItemRow = ({ item }: { item: CartItem }) => {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { scheduleQuantityUpdate, syncDelete } = useCartSync(item.id);

  const [qtyOpen, setQtyOpen] = useState(false);
  const qtyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (qtyRef.current && !qtyRef.current.contains(e.target as Node)) {
        setQtyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-20 h-20 sm:w-16 sm:h-16 object-contain rounded-xl bg-gray-50 p-1 shrink-0 self-start sm:self-center"
      />

      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm leading-5 line-clamp-2">{item.name}</p>
          <p className="text-blue-600 font-bold text-sm mt-0.5">
            {formatPrice(item.price, item.currencyCode)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
          {/* Qty dropdown */}
          <div className="relative" ref={qtyRef}>
            <button
              onClick={() => setQtyOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span>Qty: {item.quantity}</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${qtyOpen ? "rotate-180" : ""}`}
              />
            </button>

            {qtyOpen && (
              <div className="absolute top-full mt-2 left-0 min-w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="max-h-[30vh] overflow-y-auto">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        updateQuantity(item.id, q);
                        scheduleQuantityUpdate();
                        setQtyOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        q === item.quantity
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{q}</span>
                      {q === item.quantity && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="flex-1 sm:flex-none sm:w-20 text-right text-sm font-bold text-gray-900">
            {formatPrice(item.price * item.quantity, item.currencyCode)}
          </p>

          <button
            onClick={() => { removeItem(item.id); syncDelete(item); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
