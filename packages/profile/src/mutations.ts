import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@ecomm/auth";
import { getMyAddressesApi, updateAddressApi, deleteAddressApi } from "./api";
import type { AddressPayload, AddressResponse } from "./types";
import { profileKeys } from "./profileKeys";

type OnError = (error: unknown) => void;

export const useGetMyAddresses = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authReady = useAuthStore((s) => s.authReady);
  return useQuery<AddressResponse[]>({
    queryKey: profileKeys.addresses(),
    queryFn: getMyAddressesApi,
    enabled: authReady && isAuthenticated,
  });
};

export const useUpdateAddress = (onError?: OnError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, payload }: { addressId: number; payload: AddressPayload }) =>
      updateAddressApi(addressId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.addresses() }),
    onError,
  });
};

export const useDeleteAddress = (onError?: OnError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: number) => deleteAddressApi(addressId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.addresses() }),
    onError,
  });
};
