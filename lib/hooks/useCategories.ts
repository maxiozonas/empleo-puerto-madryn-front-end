import { useQuery } from "@tanstack/react-query";
import { Category } from "../types/iCategory";
import { fetchCategories } from "../api/fetchCategories";

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });
}