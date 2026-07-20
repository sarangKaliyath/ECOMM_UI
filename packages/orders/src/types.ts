export interface CreateOrderPayload {
  shippingAddressId: number;
}

export interface CreateOrderResponse {
  orderId: number;
  orderNumber: string;
  paymentUrl: string | null;
}
