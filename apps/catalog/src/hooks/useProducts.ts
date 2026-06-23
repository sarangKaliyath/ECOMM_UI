// features/products/hooks/useProducts.ts

import { useQuery } from "@tanstack/react-query";
import { productQueries } from "../queries/product/productQueries";

export function useProducts() {
  return useQuery(productQueries.list());
}