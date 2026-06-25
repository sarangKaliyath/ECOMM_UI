import axiosInstance from "./axiosInstance";
import type { Product } from "../types";

export async function getAllProducts(): Promise<Product[]> {
  const { data } = await axiosInstance.get("product");
  return data;
}
