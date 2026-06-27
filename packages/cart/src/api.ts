import type { CartItem } from "./store";
import axiosInstance from "./axiosInstance";

export const upsertCartItemApi = (item: CartItem) =>
  axiosInstance.post("/cart", {
    productId: item.id,
    cartType: "CART",
    quantity: item.quantity,
    imageUrl: item.imageUrl,
    productName: item.name,
    priceSnapshot: item.price,
  });

export const deleteCartItemApi = (id: string | number) =>
  axiosInstance.delete(`/cart/${id}`);
