import { useMutation, useQuery } from '@tanstack/react-query'
import { upsertCartItemApi, getCartItemsApi, deleteCartItemApi} from './api'

type OnError = (error: unknown) => void

export const useUpsertCartItem = (onError?: OnError) =>
  useMutation({ mutationFn: upsertCartItemApi, onError })

export const useDeleteCartItem = (onError?: OnError) =>
  useMutation({ mutationFn: deleteCartItemApi, onError })

export const useGetCartItems = (cartType: string = 'GUEST') =>
  useQuery({
    queryKey: ['cart', cartType],
    queryFn: () => getCartItemsApi(cartType).then((res) => res.data),
  })
