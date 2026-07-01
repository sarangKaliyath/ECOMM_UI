import { formatPrice } from "../../utils";

type Props = {
  totalItems: number;
  totalPrice: number;
  onCheckout: () => void;
};

const CartCheckout = ({ totalItems, totalPrice, onCheckout }: Props) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm">
          Subtotal ({totalItems} items)
        </span>
        <span className="font-bold text-gray-900 text-lg">
          {formatPrice(totalPrice)}
        </span>
      </div>
      <button
        onClick={onCheckout}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all cursor-pointer shadow-md hover:shadow-lg"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartCheckout;
