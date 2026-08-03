// features/products/queries/productQueries.ts

import { queryOptions } from "@tanstack/react-query";
import { getAllProducts, getProductList } from "../../api";

import { productKeys } from "./productKeys";
import type { ProductListParams } from "../../types";

const DEFAULT_STALE_TIME = 1000 * 60 * 5;

export const productQueries = {
  all: () =>
    queryOptions({
      queryKey: productKeys.allProducts(),
      queryFn: getAllProducts,
      staleTime: DEFAULT_STALE_TIME,
    }),
  paginated: (params: ProductListParams) =>
    queryOptions({
      queryKey: productKeys.paginated(params),
      queryFn: () => getProductList(params),
      staleTime: DEFAULT_STALE_TIME,
    }),
};
