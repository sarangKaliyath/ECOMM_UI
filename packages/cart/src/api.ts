import type { CartItem } from "./store";
import axiosInstance from "./axiosInstance";
import { useAuthStore } from "@ecomm/auth";

const getCartType = () =>
  useAuthStore.getState().isAuthenticated ? "USER" : "GUEST";

export const upsertCartItemApi = (item: CartItem) =>
  axiosInstance.post("/add", {
    productId: item.id,
    cartType: getCartType(),
    quantity: item.quantity,
    imageUrl: item.imageUrl,
    productName: item.name,
    priceSnapshot: item.price,
  });

export const getCartItemsApi = (cartType?: string) =>
  axiosInstance.get("/get/" + (cartType ?? getCartType()));

export const updateCartItemQuantityApi = (
  productId: number,
  quantity: number,
) =>
  axiosInstance.patch("/quantity", {
    cartType: getCartType(),
    productId,
    quantity,
  });

export const deleteCartItemApi = (productId: string | number) =>
  axiosInstance.delete(`/remove/${getCartType()}/${productId}`);

export const clearCartApi = () =>
  axiosInstance.delete(`/clear/${getCartType()}`);
