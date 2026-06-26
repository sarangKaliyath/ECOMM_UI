export const productKeys = {
  all: ["products"] as const,
  allProducts: () => [...productKeys.all, "list"] as const,
  paginated: (page: number, size: number) =>
    [...productKeys.all, "product-list", page, size] as const,
};
