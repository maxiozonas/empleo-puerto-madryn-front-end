import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite, fetchUserFavorites, checkIsFavorite } from "../api/favoritos";

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ofertaId, token }: { ofertaId: string; token: string }) => addFavorite(ofertaId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavorite() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ ofertaId, token }: { ofertaId: string; token: string }) => removeFavorite(ofertaId, token),
      onSuccess: (_, { ofertaId, token }) => {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        queryClient.invalidateQueries({ queryKey: ["isFavorite", ofertaId, token] }); // Invalida específicamente esta oferta
      },
    });
  }

export function useUserFavorites(token: string) {
  return useQuery({
    queryKey: ["favorites", token],
    queryFn: () => fetchUserFavorites(token),
    enabled: !!token,
  });
}

export function useIsFavorite(ofertaId: string, token: string) {
  return useQuery({
    queryKey: ["isFavorite", ofertaId, token],
    queryFn: () => checkIsFavorite(ofertaId, token),
    enabled: !!token && !!ofertaId,
  });
}