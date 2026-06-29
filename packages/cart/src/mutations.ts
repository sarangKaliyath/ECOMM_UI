import { useMutation, useQuery } from '@tanstack/react-query'
import { upsertCartItemApi, getCartItemsApi, deleteCartItemApi, updateCartItemQuantityApi, clearCartApi } from './api'

type OnError = (error: unknown) => void

export const useUpsertCartItem = (onError?: OnError) =>
  useMutation({ mutationFn: upsertCartItemApi, onError })

export const useDeleteCartItem = (onError?: OnError) =>
  useMutation({
    mutationFn: (productId: string | number) => deleteCartItemApi('GUEST', String(productId)),
    onError,
  })

export const useUpdateCartItemQuantity = (onError?: OnError) =>
  useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      updateCartItemQuantityApi('GUEST', productId, quantity),
    onError,
  })

export const useGetCartItems = (
  cartType: string = 'GUEST',
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ['cart', cartType],
    queryFn: () => getCartItemsApi(cartType).then((res) => res.data),
    enabled: options?.enabled ?? true,
  })


export const useClearCartItem = (onError?: OnError) => 
    useMutation({
      mutationFn: (cartType: String | null) => clearCartApi(cartType),
      onError
    })