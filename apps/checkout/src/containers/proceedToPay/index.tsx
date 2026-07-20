import { useState } from "react";
import { CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useGetCartItems } from "@ecomm/cart";
import type { CartResponseDto } from "@ecomm/cart";
import { useCreateOrder } from "@ecomm/orders";
import { getAuthErrorMessage, getErrorStatus } from "@ecomm/auth";
import { toast } from "@ecomm/ui";

interface Props {
  shippingAddressId: number | null;
  isAuthenticated: boolean;
  onRequireLogin: () => void;
}

const ProceedToPay = ({ shippingAddressId, isAuthenticated, onRequireLogin }: Props) => {
  const { data, isLoading: isCartLoading, refetch: refetchCart } = useGetCartItems();
  const cart = data as CartResponseDto | undefined;
  const isCartEmpty = !isCartLoading && (cart?.cartItems?.length ?? 0) === 0;

  const createOrder = useCreateOrder();
  const [placedWithoutPayment, setPlacedWithoutPayment] = useState<{ orderNumber: string } | null>(null);

  const cartEmptyOnServer = getErrorStatus(createOrder.error) === 400;
  const showCartEmptyMessage = isCartEmpty || cartEmptyOnServer;

  const handleProceed = () => {
    if (!isAuthenticated) {
      onRequireLogin();
      return;
    }
    if (!shippingAddressId) {
      toast.error("Please select a shipping address.");
      return;
    }

    createOrder.mutate(shippingAddressId, {
      onSuccess: (order) => {
        if (order.paymentUrl) {
          window.location.href = order.paymentUrl;
        } else {
          setPlacedWithoutPayment({ orderNumber: order.orderNumber });
        }
      },
      onError: (err) => {
        if (getErrorStatus(err) === 400) {
          refetchCart();
        } else {
          toast.error(getAuthErrorMessage(err, "Unable to place your order. Please try again."));
        }
      },
    });
  };

  const disabled =
    !shippingAddressId ||
    showCartEmptyMessage ||
    createOrder.isPending ||
    placedWithoutPayment !== null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CreditCard size={18} className="text-blue-600" />
        <h2 className="text-base font-bold text-gray-900">Payment</h2>
      </div>

      {placedWithoutPayment ? (
        <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <CheckCircle2 size={16} />
            <span className="text-sm font-semibold">Order {placedWithoutPayment.orderNumber} placed</span>
          </div>
          <p className="text-sm text-amber-700">
            Order placed, but payment couldn't be started — retry payment from your orders page.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            You'll be redirected to our secure payment provider to complete your purchase.
          </p>

          {showCartEmptyMessage && (
            <p className="text-sm text-red-600">
              Cannot create order: cart is empty. Add items to your cart before proceeding.
            </p>
          )}

          <button
            onClick={handleProceed}
            disabled={disabled}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {createOrder.isPending ? "Placing order…" : "Proceed to Pay"}
          </button>
        </>
      )}

      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <ShieldCheck size={13} />
        Secure checkout
      </div>
    </div>
  );
};

export default ProceedToPay;
