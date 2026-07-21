export interface CreateOrderPayload {
  shippingAddressId: number;
}

export interface CreateOrderResponse {
  orderId: number;
  orderNumber: string;
  paymentUrl: string | null;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "REFUNDED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  productId: number;
  productName: string;
  productImageUrl: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderSummaryResponse {
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentUrl: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  shippingCharge: number;
  grandTotal: number;
  currency: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface OrderListParams {
  page?: number;
  size?: number;
  sort?: string;
}
