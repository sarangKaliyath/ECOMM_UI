// features/products/hooks/useProducts.ts

import { useQuery } from "@tanstack/react-query";
import { productQueries } from "../../queries";
import type { ProductListParams } from "../../types";

export function useProducts(params: ProductListParams) {
  return useQuery(productQueries.paginated(params));
}