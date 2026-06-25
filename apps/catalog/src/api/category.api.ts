import axiosInstance from "./axiosInstance";
import type { Category } from "../types";

export async function getAllCategories(): Promise<Category[]> {
  const { data } = await axiosInstance.get("category");
  return data;
}
