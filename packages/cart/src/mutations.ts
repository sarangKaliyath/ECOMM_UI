import { useMutation, useQuery } from "@tanstack/react-query";
import {
  upsertCartItemApi,
  getCartItemsApi,
  deleteCartItemApi,
  updateCartItemQuantityApi,
  clearCartApi,
} from "./api";
import { useAuthStore } from "@ecomm/auth";

type OnError = (error: unknown) => void;

export const useUpsertCartItem = (onError?: OnError) =>
  useMutation({ mutationFn: upsertCartItemApi, onError });

export const useDeleteCartItem = (onError?: OnError) =>
  useMutation({
    mutationFn: (productId: string | number) => deleteCartItemApi(productId),
    onError,
  });

export const useUpdateCartItemQuantity = (onError?: OnError) =>
  useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => updateCartItemQuantityApi(productId, quantity),
    onError,
  });

export const useGetCartItems = (options?: { enabled?: boolean }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authReady = useAuthStore((s) => s.authReady);
  const cartType = isAuthenticated ? "USER" : "GUEST";
  return useQuery({
    queryKey: ["cart", cartType],
    queryFn: () => getCartItemsApi().then((res) => res.data),
    enabled: authReady && (options?.enabled ?? true),
  });
};

export const useClearCartItem = (onError?: OnError) =>
  useMutation({
    mutationFn: clearCartApi,
    onError,
  });
