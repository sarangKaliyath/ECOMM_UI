import profileAxios from "./axiosInstance";
import type {
  AddressPayload,
  AddressResponse,
  ProfileResponse,
  ProfileUpdatePayload,
} from "./types";

export const getMyProfileApi = () =>
  profileAxios.get<ProfileResponse>("/profile/me").then((response) => response.data);

export const updateMyProfileApi = (payload: ProfileUpdatePayload) =>
  profileAxios.patch<ProfileResponse>("/profile/me", payload).then((response) => response.data);

export const getMyAddressesApi = () =>
  profileAxios.get<AddressResponse[]>("/profile/me/addresses").then((response) => response.data);

export const createAddressApi = (payload: AddressPayload) =>
  profileAxios.post<AddressResponse>("/profile/me/addresses", payload).then((response) => response.data);

export const updateAddressApi = (addressId: number, payload: AddressPayload) =>
  profileAxios.patch<AddressResponse>(`/profile/me/addresses/${addressId}`, payload).then((response) => response.data);

export const deleteAddressApi = (addressId: number) =>
  profileAxios.delete(`/profile/me/addresses/${addressId}`).then(() => undefined);

export const setDefaultAddressApi = (addressId: number) =>
  profileAxios.put<AddressResponse>(`/profile/me/addresses/${addressId}`).then((response) => response.data);
