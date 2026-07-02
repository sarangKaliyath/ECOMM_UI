import { useMutation, useQuery } from "@tanstack/react-query";
import {
  upsertCartItemApi,
  getCartItemsApi,
  deleteCartItemApi,
  updateCartItemQuantityApi,
  clearCartApi,
} from "./api";
import { useAuthStore } from "@ecomm/auth";
import { cartKeys } from "./cartKeys";

type OnError = (error: unknown) => void;
type CartType = "USER" | "GUEST";
interface UseGetCartItemsOptions {
  enabled?: boolean;
  cartType?: CartType;
}

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

export const useGetCartItems = (options?: string | UseGetCartItemsOptions) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authReady = useAuthStore((s) => s.authReady);
  const resolvedOptions =
    typeof options === "string"
      ? { cartType: options as CartType }
      : options;
  const cartType = resolvedOptions?.cartType ?? (isAuthenticated ? "USER" : "GUEST");
  return useQuery({
    queryKey: cartKeys.byType(cartType),
    queryFn: () => getCartItemsApi().then((res) => res.data),
    enabled: authReady && (resolvedOptions?.enabled ?? true),
  });
};

export const useClearCartItem = (onError?: OnError) =>
  useMutation({
    mutationFn: clearCartApi,
    onError,
  });
