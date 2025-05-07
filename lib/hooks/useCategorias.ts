import { useQuery } from "@tanstack/react-query";
import { Categoria } from "../types/iCategoria";
import { fetchaAllCategoriasImages, fetchCategorias } from "../api/categorias";

export function useCategorias() {
  return useQuery<Categoria[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategorias,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
}

export function useCategoriaImages(id: string, token: string) {
  return useQuery<String[], Error>({
    queryKey: ["categories", id],
    queryFn: () => fetchaAllCategoriasImages(id, token),
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
}