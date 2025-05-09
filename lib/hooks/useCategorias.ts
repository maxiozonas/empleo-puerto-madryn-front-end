import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Categoria } from "../types/iCategoria";
import { createCategoriaImage, deleteCategoriaImage, fetchaAllCategoriasImages, fetchCategorias } from "../api/categorias";

export function useCategorias() {
  return useQuery<Categoria[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategorias,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
}

export function useCategoriaImages(id: string, token: string) {
  return useQuery<string[], Error>({
    queryKey: ["categories", id],
    queryFn: () => fetchaAllCategoriasImages(id, token),
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
}

export function useCreateImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoriaId, imageUrl, token }: { categoriaId: string; imageUrl: string; token: string }) => createCategoriaImage(categoriaId, imageUrl, token),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]});
    },
    onError: (error) => {
      console.error("Error creating image:", error);
    }
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoriaId, imageUrl, token }: { categoriaId: string; imageUrl: string; token: string }) => deleteCategoriaImage(categoriaId, imageUrl, token),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]});
    },
    onError: (error) => {
      console.error("Error deleting image:", error);
    }
  });
}