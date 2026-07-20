export interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  currencyCode?: string;
}

export type PaymentMethodType = "card" | "upi" | "cod";
