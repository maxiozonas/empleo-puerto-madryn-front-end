import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite, fetchUserFavorites, checkIsFavorite } from "../api/favoritos";

export function useAddFavorito() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ofertaId, token }: { ofertaId: string; token: string }) => addFavorite(ofertaId, token),
    onSuccess: (_, { ofertaId, token }) => {
      queryClient.invalidateQueries({ queryKey: ["favorites", token] });
      queryClient.invalidateQueries({ queryKey: ["isFavorite", ofertaId, token] });
    },
  });
}

export function useRemoveFavorito() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ofertaId, token }: { ofertaId: string; token: string }) => removeFavorite(ofertaId, token),
    onSuccess: (_, { ofertaId, token }) => {
      queryClient.invalidateQueries({ queryKey: ["favorites", token] });
      queryClient.invalidateQueries({ queryKey: ["isFavorite", ofertaId, token] });
    },
  });
}

export function useUserFavoritos(token: string) {
  return useQuery({
    queryKey: ["favorites", token],
    queryFn: () => fetchUserFavorites(token),
    enabled: !!token,
  });
}

export function useIsFavoritos(ofertaId: string, token: string) {
  return useQuery({
    queryKey: ["isFavorite", ofertaId, token],
    queryFn: () => checkIsFavorite(ofertaId, token),
    enabled: !!token && !!ofertaId,
  });
}