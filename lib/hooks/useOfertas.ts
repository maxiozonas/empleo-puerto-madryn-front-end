import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Oferta } from "../types/iOferta";
import { deleteOferta, fetchOfertaById, fetchOfertas, fetchUserOfertas } from "../api/ofertas";

export function useOfertaById(id: string) {
    return useQuery<Oferta, Error>({
        queryKey: ["jobPost", id],
        queryFn: () => fetchOfertaById(id),
        enabled: !!id,
    });
}

export function useOfertas() {
    return useQuery<Oferta[], Error>({
        queryKey: ["jobPosts"],
        queryFn: fetchOfertas,
    });
}

export function useUserOfertas(token: string) {
    return useQuery<Oferta[], Error>({
        queryKey: ["userJobPosts", token],
        queryFn: () => fetchUserOfertas(token),
        enabled: !!token,
    });
}

export function useOfertasByCategory(categoryId: string) {
    return useQuery<Oferta[], Error>({
        queryKey: ["jobPostsByCategory", categoryId],
        queryFn: async () => {
            const allJobs = await fetchOfertas();
            return allJobs.filter((job) => job.categoria.id === categoryId);
        },
    });
}

export function useDeleteOferta() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, token }: { id: string; token: string }) => deleteOferta(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
            queryClient.invalidateQueries({ queryKey: ["userJobPosts"] });
        },
        onError: (err) => {
            console.error("Error al eliminar la oferta:", err);
        },
    });
}