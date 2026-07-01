import type { OrderItem as OrderItemType } from "../../types/order";

const formatPrice = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

interface Props {
  item: OrderItemType;
}

const OrderItem = ({ item }: Props) => {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="relative shrink-0 h-16 w-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain p-1.5" />
        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">
          {item.quantity}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">Qty {item.quantity}</p>
      </div>
      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
        {formatPrice(item.price * item.quantity, item.currencyCode)}
      </span>
    </div>
  );
};

export default OrderItem;
