import type { OrderItem } from "../types/order";
import productAlt from "../assets/hero.png";

export const mockOrderItems: OrderItem[] = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 129.99,
    quantity: 1,
    imageUrl: productAlt,
    currencyCode: "USD",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 89.5,
    quantity: 2,
    imageUrl: productAlt,
    currencyCode: "USD",
  },
  {
    id: 3,
    name: "Portable Bluetooth Speaker",
    price: 44.99,
    quantity: 1,
    imageUrl: productAlt,
    currencyCode: "USD",
  },
];

export const TAX_RATE = 0.08;
export const SHIPPING_FLAT_RATE = 5.99;
