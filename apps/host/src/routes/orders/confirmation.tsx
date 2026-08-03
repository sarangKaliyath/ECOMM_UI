import { useEffect } from "react";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, XCircle, PackageSearch } from "lucide-react";
import { useOrderDetail } from "@ecomm/orders";
import { rootRoute } from "../__root";

interface OrderConfirmationSearch {
  orderNumber?: string;
  status?: string;
}

const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount);

function OrderConfirmationPage() {
  const navigate = useNavigate();
  const search = orderConfirmationRoute.useSearch();
  const { orderNumber } = search;
  const isPaid = search.status === "paid";

  const { data: order, isLoading } = useOrderDetail(orderNumber);

  useEffect(() => {
    if (!orderNumber || isLoading) return;
    const redirectTimer = setTimeout(() => {
      navigate({ to: "/orders" });
    }, 2000);
    return () => clearTimeout(redirectTimer);
  }, [orderNumber, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden px-8 py-8 flex flex-col items-center text-center gap-4">
        {!orderNumber ? (
          <>
            <XCircle size={40} className="text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">Order reference missing</h2>
            <p className="text-sm text-gray-500">
              We couldn't find an order reference in the payment redirect. If you completed a payment, check your
              orders page for the latest status.
            </p>
          </>
        ) : isLoading ? (
          <>
            <PackageSearch size={40} className="text-gray-300 animate-pulse" />
            <p className="text-sm text-gray-500">Looking up your order…</p>
          </>
        ) : isPaid ? (
          <>
            <CheckCircle2 size={40} className="text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900">Payment successful</h2>
            <p className="text-sm text-gray-500">
              Order <span className="font-semibold text-gray-700">{orderNumber}</span> has been placed.
            </p>

            {order && (
              <div className="w-full mt-2 flex flex-col gap-2 text-left border-t border-gray-100 pt-4">
                {order.orderItems.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm text-gray-600">
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-800">{formatPrice(item.totalPrice, order.currency)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-100 pt-2 mt-1">
                  <span>Total</span>
                  <span>{formatPrice(order.grandTotal, order.currency)}</span>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-400">Redirecting you to your orders…</p>
          </>
        ) : (
          <>
            <XCircle size={40} className="text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">Payment failed or cancelled</h2>
            <p className="text-sm text-gray-500">
              Order <span className="font-semibold text-gray-700">{orderNumber}</span> was created but payment
              wasn't completed. You can retry payment from your orders page.
            </p>
            <p className="text-xs text-gray-400">Redirecting you to your orders…</p>
          </>
        )}

        <button
          onClick={() => navigate({ to: "/" })}
          className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue shopping
        </button>
      </div>
    </div>
  );
}

export const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders/confirmation",
  validateSearch: (search: Record<string, unknown>): OrderConfirmationSearch => ({
    orderNumber: search.orderNumber as string | undefined,
    status: search.status as string | undefined,
  }),
  component: OrderConfirmationPage,
});
