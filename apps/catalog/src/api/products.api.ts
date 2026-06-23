import axios from "axios";
import type { Product } from "../types";

export async function getAllProducts(): Promise<Product[]> {
  const {data} = await axios.get("http://localhost:8082/product");
  return data;
}
