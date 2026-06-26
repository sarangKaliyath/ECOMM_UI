import type { ProductListParams } from "../../types";

export const productKeys = {
  all: ["products"] as const,
  allProducts: () => [...productKeys.all, "list"] as const,
  paginated: (params: ProductListParams) =>
    [...productKeys.all, "product-list", params] as const,
};
