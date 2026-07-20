import { useGetCartItems } from "@ecomm/cart";
import type { CartResponseDto } from "@ecomm/cart";
import { OrderItem } from "../../common";
import type { OrderItem as OrderItemType } from "../../types/order";
import { TAX_RATE, SHIPPING_FLAT_RATE } from "../../constants";

const formatPrice = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

const OrderSummary = () => {
  const { data, isLoading, isError, refetch } = useGetCartItems();
  const cart = data as CartResponseDto | undefined;

  const items: OrderItemType[] =
    cart?.cartItems?.map((item) => ({
      id: item.productId,
      name: item.productName,
      price: item.priceSnapshot,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
    })) ?? [];

  const isEmpty = !isLoading && !isError && items.length === 0;
  const subtotal = cart?.totalPrice ?? 0;
  const tax = subtotal * TAX_RATE;
  const shipping = items.length ? SHIPPING_FLAT_RATE : 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4 sticky top-6">
      <h2 className="text-base font-bold text-gray-900">Order Summary</h2>

      {isLoading ? (
        <div className="text-sm text-gray-400 py-6 text-center">Loading order summary…</div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-red-600">Unable to load your cart.</p>
          <button onClick={() => refetch()} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Try again
          </button>
        </div>
      ) : isEmpty ? (
        <div className="text-sm text-gray-500 py-6 text-center">Your cart is empty</div>
      ) : (
        <>
          <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
            {items.map((item) => (
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
        </>
      )}
    </div>
  );
};

export default OrderSummary;
