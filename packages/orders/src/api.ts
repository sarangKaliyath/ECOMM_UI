import ordersAxios from "./axiosInstance";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  OrderListParams,
  OrderSummaryResponse,
  Page,
} from "./types";

export const createOrderApi = (payload: CreateOrderPayload) =>
  ordersAxios.post<CreateOrderResponse>("orders", payload).then((response) => response.data);

export const getMyOrdersApi = (params: OrderListParams = {}) =>
  ordersAxios
    .get<Page<OrderSummaryResponse>>("orders", { params })
    .then((response) => response.data);

export const getMyPendingOrdersApi = (params: OrderListParams = {}) =>
  ordersAxios
    .get<Page<OrderSummaryResponse>>("orders/pending", { params })
    .then((response) => response.data);

export const getOrderByNumberApi = (orderNumber: string) =>
  ordersAxios
    .get<OrderSummaryResponse>(`orders/${orderNumber}`)
    .then((response) => response.data);

export const retryPaymentApi = (orderNumber: string) =>
  ordersAxios
    .post<OrderSummaryResponse>(`orders/${orderNumber}/retry-payment`)
    .then((response) => response.data);
