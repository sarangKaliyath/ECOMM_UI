// features/products/queries/productQueries.ts

import { queryOptions } from "@tanstack/react-query";
import { getAllProducts, getProductList } from "../../api";

import { productKeys } from "./productKeys";

const DEFAULT_STALE_TIME = 1000 * 60 * 5;

export const productQueries = {
  all: () =>
    queryOptions({
      queryKey: productKeys.allProducts(),
      queryFn: getAllProducts,
      staleTime: DEFAULT_STALE_TIME,
    }),
  paginated: (page: number, size: number) =>
    queryOptions({
      queryKey: productKeys.paginated(page, size),
      queryFn: () => getProductList(page, size),
      staleTime: DEFAULT_STALE_TIME,
    }),
};
