import type { CartItem } from "./store";
import axiosInstance from "./axiosInstance";

export interface CartItemDto {
  productId: string | number;
  productName: string;
  imageUrl: string;
  quantity: number;
  priceSnapshot: number;
}

export interface CartResponseDto {
  cartId?: string;
  cartType: string;
  cartItems: CartItemDto[];
  totalPrice: number;
  totalQuantity: number;
  lastUpdatedAt: string;
}

export const mergeCartApi = () =>
  axiosInstance.post<CartResponseDto>("/merge");

export const upsertCartItemApi = (item: CartItem) =>
  axiosInstance.post("/add", {
    productId: item.id,
    quantity: item.quantity,
    imageUrl: item.imageUrl,
    productName: item.name,
    priceSnapshot: item.price,
  });

export const getCartItemsApi = () =>
  axiosInstance.get("/get");

export const updateCartItemQuantityApi = (
  productId: number,
  quantity: number,
) =>
  axiosInstance.patch("/quantity", { productId, quantity });

export const deleteCartItemApi = (productId: string | number) =>
  axiosInstance.delete(`/remove/${productId}`);

export const clearCartApi = () =>
  axiosInstance.delete(`/clear`);
