// features/products/queries/productQueries.ts

import { queryOptions } from "@tanstack/react-query";
import { getAllProducts } from "../../api/products.api";

import { productKeys } from "./productKeys";

export const productQueries = {
  list: () =>
    queryOptions({
      queryKey: productKeys.lists(),
      queryFn: getAllProducts,
      staleTime: 1000 * 60 * 5,
    }),
};
