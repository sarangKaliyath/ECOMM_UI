import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCartStore } from './store'
import { useUpsertCartItem, useDeleteCartItem, useUpdateCartItemQuantity } from './mutations'

const DEBOUNCE_MS = 600

/**
 * scheduleSync — debounced. Resets the timer on every call; fires 600ms after the
 * last click and reads the latest Zustand state at that point. Safe when the
 * component stays mounted (e.g. catalog Card showing qty controls).
 *
 * syncDelete — immediate. Cancels any pending debounced sync and fires a delete
 * right away. Use in CartItemRow where the component unmounts on removal
 * (a pending timer would be cancelled by the cleanup effect, so we must act now).
 */
export function useCartSync(id: string | number = "", onError?: (error: unknown) => void) {
  const queryClient = useQueryClient()
  const { mutate: upsertItem } = useUpsertCartItem(onError)
  const { mutate: deleteItem } = useDeleteCartItem(onError)
  const { mutate: updateQuantity } = useUpdateCartItemQuantity(onError)

  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const scheduleSync = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      // Read store directly here to avoid stale closure — getState() is always current
      const item = useCartStore.getState().items.find(i => i.id === id)
      if (item) upsertItem(item)
      else deleteItem(id)
    }, DEBOUNCE_MS)
  }, [id, upsertItem, deleteItem])

  // Use PATCH /quantity instead of POST /add when the item already exists in cart.
  const scheduleQuantityUpdate = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const item = useCartStore.getState().items.find(i => i.id === id)
      if (!item) return
      updateQuantity(
        { productId: Number(id), quantity: item.quantity },
        {
          onSuccess: (response) => {
            if (response.data) {
              // Keep RQ cache in sync so navigating to /cart doesn't flash stale quantities
              queryClient.setQueryData(['cart', 'GUEST'], response.data)
            }
          },
        }
      )
    }, DEBOUNCE_MS)
  }, [id, updateQuantity])

  const syncDelete = useCallback(() => {
    clearTimeout(timerRef.current)
    deleteItem(id)
  }, [id, deleteItem])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return { scheduleSync, scheduleQuantityUpdate, syncDelete }
}
