import ordersAxios from "./axiosInstance";
import type { CreateOrderPayload, CreateOrderResponse } from "./types";

export const createOrderApi = (payload: CreateOrderPayload) =>
  ordersAxios.post<CreateOrderResponse>("orders", payload).then((response) => response.data);
