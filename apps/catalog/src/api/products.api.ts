import axiosInstance from "./axiosInstance";
import type { Product, PaginatedResponse } from "../types";
import type { ProductListParams } from "../types";

export async function getAllProducts(): Promise<Product[]> {
  const { data } = await axiosInstance.get("product");
  return data;
}

export async function getProductList({
  page = 0,
  size = 10,
  category_id,
  min_price,
  max_price,
  rating,
  in_stock,
  on_sale,
}: ProductListParams): Promise<PaginatedResponse<Product>> {
  const { data } = await axiosInstance.get("product/list", {
    params: {
      page,
      size,
      category_id,
      min_price,
      max_price,
      rating,
      in_stock,
      on_sale,
    },
  });
  return data;
}
