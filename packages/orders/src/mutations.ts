import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@ecomm/auth";
import { createOrderApi, getMyOrdersApi, getMyPendingOrdersApi, getOrderByNumberApi, retryPaymentApi } from "./api";
import type { CreateOrderResponse, OrderListParams, OrderSummaryResponse, Page } from "./types";
import { ordersKeys } from "./ordersKeys";

export const useCreateOrder = () =>
  useMutation<CreateOrderResponse, unknown, number>({
    mutationFn: (shippingAddressId) => createOrderApi({ shippingAddressId }),
  });

export const useMyOrders = (params: OrderListParams = {}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authReady = useAuthStore((s) => s.authReady);
  return useQuery<Page<OrderSummaryResponse>>({
    queryKey: ordersKeys.list(params),
    queryFn: () => getMyOrdersApi(params),
    enabled: authReady && isAuthenticated,
  });
};

export const useMyPendingOrders = (params: OrderListParams = {}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authReady = useAuthStore((s) => s.authReady);
  return useQuery<Page<OrderSummaryResponse>>({
    queryKey: ordersKeys.pending(params),
    queryFn: () => getMyPendingOrdersApi(params),
    enabled: authReady && isAuthenticated,
  });
};

export const useOrderDetail = (orderNumber: string | undefined) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authReady = useAuthStore((s) => s.authReady);
  return useQuery<OrderSummaryResponse>({
    queryKey: ordersKeys.detail(orderNumber ?? ""),
    queryFn: () => getOrderByNumberApi(orderNumber as string),
    enabled: authReady && isAuthenticated && !!orderNumber,
  });
};

export const useRetryPayment = (onError?: (error: unknown) => void) => {
  const queryClient = useQueryClient();
  return useMutation<OrderSummaryResponse, unknown, string>({
    mutationFn: (orderNumber) => retryPaymentApi(orderNumber),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ordersKeys.all }),
    onError,
  });
};
