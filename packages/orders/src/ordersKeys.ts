import type { OrderListParams } from "./types";

export const ordersKeys = {
  all: ["orders"] as const,
  list: (params: OrderListParams = {}) => ["orders", "list", params] as const,
  pending: (params: OrderListParams = {}) => ["orders", "pending", params] as const,
  detail: (orderNumber: string) => ["orders", "detail", orderNumber] as const,
};
