import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "./store";
import type { CartItem } from "./store";
import { useAuthStore } from "@ecomm/auth";
import {
  useUpsertCartItem,
  useDeleteCartItem,
  useUpdateCartItemQuantity,
  useClearCartItem,
} from "./mutations";

const DEBOUNCE_MS = 600;

/**
 * scheduleSync — debounced. Resets the timer on every call; fires 600ms after the
 * last click and reads the latest Zustand state at that point. Safe when the
 * component stays mounted (e.g. catalog Card showing qty controls).
 *
 * scheduleQuantityUpdate - debounced, Resets the timer on every call; fires 600ms
 * after the last click.
 *
 * syncDelete — immediate. Cancels any pending debounced sync and fires a delete
 * right away. Use in CartItemRow where the component unmounts on removal
 * (a pending timer would be cancelled by the cleanup effect, so we must act now).
 */
export function useCartSync(
  id: string | number = "",
  onError?: (error: unknown) => void,
) {
  const queryClient = useQueryClient();
  const { mutate: upsertItem } = useUpsertCartItem(onError);
  const { mutate: deleteItem } = useDeleteCartItem(onError);
  const { mutate: updateQuantity } = useUpdateCartItemQuantity(onError);
  const { mutate: clearCartItems } = useClearCartItem(onError);

  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const scheduleSync = useCallback(() => {
    if (timerRef?.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const item = useCartStore.getState().items.find((i) => i.id === id);
      if (item) upsertItem(item);
      else deleteItem(id);
    }, DEBOUNCE_MS);
  }, [id, upsertItem, deleteItem]);

  const scheduleQuantityUpdate = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const item = useCartStore.getState().items.find((i) => i.id === id);
      if (!item) return;
      const cartType = useAuthStore.getState().isAuthenticated ? "USER" : "GUEST";
      updateQuantity(
        { productId: Number(id), quantity: item.quantity },
        {
          onSuccess: (response) => {
            if (response.data) {
              queryClient.setQueryData(["cart", cartType], response.data);
            }
          },
        },
      );
    }, DEBOUNCE_MS);
  }, [id, updateQuantity]);

  const syncDelete = useCallback(
    (itemSnapshot?: CartItem) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      deleteItem(id, {
        onError: () => {
          if (itemSnapshot) {
            const items = useCartStore.getState().items;
            if (!items.find((i) => i.id === id)) {
              useCartStore.getState().setItems([...items, itemSnapshot]);
            }
          }
        },
      });
    },
    [id, deleteItem],
  );

  const clearCart = useCallback(() => {
    const itemsSnapshot = useCartStore.getState().items;
    useCartStore.getState().clearCart();

    clearCartItems(undefined, {
      onError: () => {
        useCartStore.getState().setItems(itemsSnapshot);
      },
    });
  }, [clearCartItems]);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  return { scheduleSync, scheduleQuantityUpdate, syncDelete, clearCart };
}
