import { queryOptions } from "@tanstack/react-query";
import { getAllCategories } from "../../api";
import { categoryKeys } from "./categoryKeys";

export const categoryQueries = {
  list: () =>
    queryOptions({
      queryKey: categoryKeys.lists(),
      queryFn: getAllCategories,
      staleTime: 1000 * 60 * 5,
    }),
};
