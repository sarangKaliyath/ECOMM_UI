import type { ProductListParams } from "../../types";

export const productKeys = {
  all: ["products"] as const,
  allProducts: () => [...productKeys.all, "list"] as const,
  paginated: ({page, size}: ProductListParams) =>
    [...productKeys.all, "product-list", page, size] as const,
};
