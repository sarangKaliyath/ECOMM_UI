import { useQuery } from "@tanstack/react-query";
import { categoryQueries } from "../../queries";

export function useCategory() {
  return useQuery(categoryQueries.list());
}
