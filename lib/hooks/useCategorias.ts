import { useQuery } from "@tanstack/react-query";
import { Category } from "../types/iCategory";
import { fetchCategorias } from "../api/categorias";

export function useCategorias() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategorias
  });
}