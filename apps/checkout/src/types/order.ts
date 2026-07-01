export interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  currencyCode?: string;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export type PaymentMethodType = "card" | "upi" | "cod";
