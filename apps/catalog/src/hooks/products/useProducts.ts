// features/products/hooks/useProducts.ts

import { useQuery } from "@tanstack/react-query";
import { productQueries } from "../../queries";

export function useProducts(page: number, size: number) {
  return useQuery(productQueries.paginated(page, size));
}