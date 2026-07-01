import { ShieldCheck } from "lucide-react";
import { OrderItem } from "../../common";
import { mockOrderItems, TAX_RATE, SHIPPING_FLAT_RATE } from "../../data/mockOrder";

const formatPrice = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

interface Props {
  onPlaceOrder: () => void;
}

const OrderSummary = ({ onPlaceOrder }: Props) => {
  const subtotal = mockOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = mockOrderItems.length ? SHIPPING_FLAT_RATE : 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4 sticky top-6">
      <h2 className="text-base font-bold text-gray-900">Order Summary</h2>

      <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
        {mockOrderItems.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span className="text-gray-700 font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span className="text-gray-700 font-medium">{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Tax</span>
          <span className="text-gray-700 font-medium">{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-2 mt-1">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Place Order
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <ShieldCheck size={13} />
        Secure checkout
      </div>
    </div>
  );
};

export default OrderSummary;
