import axiosInstance from "./axiosInstance";
import type { Product, PaginatedResponse } from "../types";

export async function getAllProducts(): Promise<Product[]> {
  const { data } = await axiosInstance.get("product");
  return data;
}

export async function getProductList(
  page: number = 0,
  size: number = 10,
): Promise<PaginatedResponse<Product>> {
  const { data } = await axiosInstance.get("product/list", {
    params: {
      page,
      size,
    },
  });
  return data;
}
