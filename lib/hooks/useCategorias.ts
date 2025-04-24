import { useQuery } from "@tanstack/react-query";
import { Categoria } from "../types/iCategoria";
import { fetchCategorias } from "../api/categorias";

export function useCategorias() {
  return useQuery<Categoria[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategorias,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
}