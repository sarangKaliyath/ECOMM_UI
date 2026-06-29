import type { CartItem } from "./store";
import axiosInstance from "./axiosInstance";

export const upsertCartItemApi = (item: CartItem) =>
  axiosInstance.post("/add", {
    productId: item.id,
    cartType: "GUEST", // TODO: need to configure for USER type, after auth implementation.
    quantity: item.quantity,
    imageUrl: item.imageUrl,
    productName: item.name,
    priceSnapshot: item.price,
  });

export const getCartItemsApi = (cartType: String = "GUEST") =>
  axiosInstance.get("/get/" + cartType);

export const updateCartItemQuantityApi = (
  cartType: String = "GUEST",
  productId: number,
  quantity: number,
) =>
  axiosInstance.patch("/quantity", {
    cartType,
    productId,
    quantity,
  });

export const deleteCartItemApi = (cartType: String = 'GUEST', productId: String) =>
  axiosInstance.delete(`/remove/${cartType}/${productId}`);

export const clearCartApi = (cartType: String | null = "GUEST") => 
    axiosInstance.delete(`/clear/${cartType}`)
