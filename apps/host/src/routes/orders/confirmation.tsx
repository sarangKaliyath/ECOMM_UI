import { useEffect, useState } from "react";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, XCircle, PackageSearch } from "lucide-react";
import { rootRoute } from "../__root";

interface OrderConfirmationSearch {
  razorpay_payment_link_id?: string;
  razorpay_payment_id?: string;
  razorpay_payment_link_reference_id?: string;
  razorpay_payment_link_status?: string;
  razorpay_signature?: string;
}

interface DummyOrder {
  orderNumber: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

// TODO: replace with a real `getOrderByIdApi(orderId)` call once the order
// service exposes a GET /orders/{id} endpoint. The order/payment status is
// not reconciled by the backend on this redirect yet, so nothing here
// should be treated as a trusted source of truth beyond what to display.
const getDummyOrder = (orderId: string): DummyOrder => ({
  orderNumber: `ORD-${orderId.padStart(6, "0")}`,
  items: [
    { name: "Wireless Headphones", quantity: 1, price: 59.99 },
    { name: "USB-C Cable", quantity: 2, price: 9.99 },
  ],
  total: 79.97,
});

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

function OrderConfirmationPage() {
  const navigate = useNavigate();
  const search = orderConfirmationRoute.useSearch();
  const referenceId = search.razorpay_payment_link_reference_id;
  const isPaid = search.razorpay_payment_link_status === "paid";

  const [order, setOrder] = useState<DummyOrder | null>(null);
  const [isLoading, setIsLoading] = useState(!!referenceId);

  useEffect(() => {
    if (!referenceId) return;
    const timer = setTimeout(() => {
      setOrder(getDummyOrder(referenceId));
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [referenceId]);

  useEffect(() => {
    if (!referenceId || isLoading) return;
    const redirectTimer = setTimeout(() => {
      navigate({ to: "/orders" });
    }, 2000);
    return () => clearTimeout(redirectTimer);
  }, [referenceId, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden px-8 py-8 flex flex-col items-center text-center gap-4">
        {isLoading ? (
          <>
            <PackageSearch size={40} className="text-gray-300 animate-pulse" />
            <p className="text-sm text-gray-500">Looking up your order…</p>
          </>
        ) : !referenceId ? (
          <>
            <XCircle size={40} className="text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">Order reference missing</h2>
            <p className="text-sm text-gray-500">
              We couldn't find an order reference in the payment redirect. If you completed a payment, check your
              orders page for the latest status.
            </p>
          </>
        ) : isPaid ? (
          <>
            <CheckCircle2 size={40} className="text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900">Payment successful</h2>
            <p className="text-sm text-gray-500">
              Order <span className="font-semibold text-gray-700">{order?.orderNumber}</span> has been placed.
            </p>

            {order && (
              <div className="w-full mt-2 flex flex-col gap-2 text-left border-t border-gray-100 pt-4">
                {order.items.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm text-gray-600">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-100 pt-2 mt-1">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
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
              Order <span className="font-semibold text-gray-700">{order?.orderNumber}</span> was created but
              payment wasn't completed. You can retry payment from your orders page.
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
    razorpay_payment_link_id: search.razorpay_payment_link_id as string | undefined,
    razorpay_payment_id: search.razorpay_payment_id as string | undefined,
    razorpay_payment_link_reference_id: search.razorpay_payment_link_reference_id as string | undefined,
    razorpay_payment_link_status: search.razorpay_payment_link_status as string | undefined,
    razorpay_signature: search.razorpay_signature as string | undefined,
  }),
  component: OrderConfirmationPage,
});
