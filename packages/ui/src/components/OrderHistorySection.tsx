import { useState } from "react";
import { Package, CreditCard } from "lucide-react";
import { useMyOrders, useMyPendingOrders, useRetryPayment, type OrderSummaryResponse } from "@ecomm/orders";

const PAGE_SIZE = 10;

const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount);

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

const orderStatusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-gray-200 text-gray-600",
  REFUNDED: "bg-blue-100 text-blue-700",
};

const orderStatusLabels: Record<string, string> = {
  PENDING: "Order Pending",
  CONFIRMED: "Order Confirmed",
  CANCELLED: "Order Cancelled",
  REFUNDED: "Order Refunded",
};

const paymentStatusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-300",
  PAID: "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-300",
  FAILED: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-300",
  REFUNDED: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-300",
};

const paymentStatusLabels: Record<string, string> = {
  PENDING: "Payment Pending",
  PAID: "Payment Paid",
  FAILED: "Payment Failed",
  REFUNDED: "Payment Refunded",
};

function OrderCard({ order }: { order: OrderSummaryResponse }) {
  const [payError, setPayError] = useState<string | null>(null);
  const retryPayment = useRetryPayment();

  const handlePayNow = async () => {
    setPayError(null);
    // Always fetch a fresh payment link rather than reopening order.paymentUrl:
    // Razorpay links expire a short time after creation, and the stored URL
    // is never cleared, so it goes stale on any order left pending a while.
    try {
      const updated = await retryPayment.mutateAsync(order.orderNumber);
      if (updated.paymentUrl) {
        window.open(updated.paymentUrl, "_blank", "noopener,noreferrer");
      } else {
        setPayError("Payment link isn't ready yet. Please try again in a moment.");
      }
    } catch {
      setPayError("Couldn't reach the payment gateway. Please try again shortly.");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
          <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${orderStatusStyles[order.orderStatus] ?? "bg-gray-100 text-gray-600"}`}
          >
            <Package className="h-3 w-3" aria-hidden="true" />
            {orderStatusLabels[order.orderStatus] ?? order.orderStatus}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${paymentStatusStyles[order.paymentStatus] ?? "bg-gray-100 text-gray-600"}`}
          >
            <CreditCard className="h-3 w-3" aria-hidden="true" />
            {paymentStatusLabels[order.paymentStatus] ?? order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
        {order.orderItems.map((item) => (
          <div key={item.productId} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3 min-w-0">
              {item.productImageUrl ? (
                <img src={item.productImageUrl} alt={item.productName} className="h-10 w-10 rounded-lg border border-gray-200 object-cover shrink-0" />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-gray-100 shrink-0" />
              )}
              <span className="truncate text-gray-700">
                {item.productName} × {item.quantity}
              </span>
            </div>
            <span className="font-medium text-gray-800 shrink-0">{formatPrice(item.totalPrice, order.currency)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <span className="text-sm font-semibold text-gray-900">
          Total: {formatPrice(order.grandTotal, order.currency)}
        </span>

        {order.orderStatus === "PENDING" && (
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => void handlePayNow()}
              disabled={retryPayment.isPending}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {retryPayment.isPending ? "Preparing payment…" : "Pay Now"}
            </button>
            {payError && <p className="text-xs text-red-600">{payError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderHistorySection() {
  const [tab, setTab] = useState<"all" | "pending">("all");
  const [page, setPage] = useState(0);

  const allOrders = useMyOrders({ page, size: PAGE_SIZE });
  const pendingOrders = useMyPendingOrders({ page, size: PAGE_SIZE });

  const active = tab === "all" ? allOrders : pendingOrders;

  const switchTab = (next: "all" | "pending") => {
    setTab(next);
    setPage(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">My Orders</p>
        <h2 className="text-2xl font-semibold text-gray-900">Order history</h2>
        <p className="mt-1 text-sm text-gray-500">Track your orders and complete pending payments.</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => switchTab("all")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => switchTab("pending")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === "pending" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending Payment
          </button>
        </div>
      </div>

      {active.isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading your orders…</div>
      ) : active.isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Unable to load your orders. Please try again later.
        </div>
      ) : !active.data || active.data.content.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          {tab === "all" ? "You haven't placed any orders yet." : "No pending payments — you're all caught up."}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {active.data.content.map((order) => (
              <OrderCard key={order.orderNumber} order={order} />
            ))}
          </div>

          {active.data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={active.data.first}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {active.data.number + 1} of {active.data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={active.data.last}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
