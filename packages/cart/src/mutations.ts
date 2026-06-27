import { useMutation } from '@tanstack/react-query'
import { upsertCartItemApi, deleteCartItemApi } from './api'

type OnError = (error: unknown) => void

export const useUpsertCartItem = (onError?: OnError) =>
  useMutation({ mutationFn: upsertCartItemApi, onError })

export const useDeleteCartItem = (onError?: OnError) =>
  useMutation({ mutationFn: deleteCartItemApi, onError })
