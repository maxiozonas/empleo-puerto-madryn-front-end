import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Oferta } from "../types/iOferta";
import { 
  createOferta,
  deleteOferta, 
  deleteOfertaAdmin,
  enableOfertaAdmin,
  fetchOfertaById, 
  fetchOfertaBySlug,
  fetchOfertas, 
  fetchUserOfertas,
  updateOferta 
} from "../api/ofertas";

export function useOfertaById(id: string) {
    return useQuery<Oferta, Error>({
        queryKey: ["jobPost", id],
        queryFn: () => fetchOfertaById(id),
        enabled: !!id,
        staleTime: 30 * 1000, 
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 2
    });
}

export function useOfertaBySlug(slug: string) {
    return useQuery<Oferta, Error>({
        queryKey: ["jobPostBySlug", slug],
        queryFn: () => fetchOfertaBySlug(slug),
        enabled: !!slug,
        staleTime: 30 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 2
    });
}

export function useOfertas() {
    return useQuery<Oferta[], Error>({
        queryKey: ["jobPosts"],
        queryFn: fetchOfertas,
        staleTime: 30 * 1000, 
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchInterval: 60 * 1000, 
        retry: 2
    });
}

export function useUserOfertas(token: string) {
    return useQuery<Oferta[], Error>({
        queryKey: ["userJobPosts", token],
        queryFn: () => fetchUserOfertas(token),
        enabled: !!token,
        staleTime: 30 * 1000, 
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchInterval: 60 * 1000, 
        retry: 2
    });
}

export function useOfertasByCategory(categoryId: string) {
  return useQuery({
    queryKey: ["jobPostsByCategory", categoryId],
    queryFn: async () => {
            const allJobs = await fetchOfertas();
            return allJobs.filter((job) => job.categoria.id === categoryId);
        },
        staleTime: 30 * 1000, 
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchInterval: 60 * 1000, 
        retry: 2
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

export function useCreateOferta() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, token }: { 
            data: {
                titulo: string;
                descripcion: string;
                usuarioId: string;
                empresaConsultora: string;
                fechaCierre: string | null;
                formaPostulacion: string;
                emailContacto: string | null;
                linkPostulacion: string | null;
                categoriaId: string;
                logo?: File | null;
            }, 
            token: string 
        }) => createOferta(data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
            queryClient.invalidateQueries({ queryKey: ["userJobPosts"] });
        },
        onError: (err) => {
            console.error("Error al crear la oferta:", err);
        },
    });
}

export function useUpdateOferta() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, token }: { 
            data: {
                id: string;
                titulo: string;
                descripcion: string;
                usuarioId: string;
                empresaConsultora: string;
                fechaCierre: Date | null;
                formaPostulacion: string;
                emailContacto: string | null;
                linkPostulacion: string | null;
                categoriaId: string;
                logo?: File | null;
                logoUrl?: string | null;
                habilitado: boolean;
            }, 
            token: string 
        }) => updateOferta(data, token),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
            queryClient.invalidateQueries({ queryKey: ["userJobPosts"] });
            if (data && data.id) {
                queryClient.invalidateQueries({ queryKey: ["jobPost", data.id] });
            }
        },
        onError: (err) => {
            console.error("Error al actualizar la oferta:", err);
        },
    });
}

export function useDeleteOfertaAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, token }: { id: string; token: string }) => deleteOfertaAdmin(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
            queryClient.invalidateQueries({ queryKey: ["userJobPosts"] });
        },
        onError: (err) => {
            console.error("Error al eliminar la oferta como administrador:", err);
        },
    });
}

export function useEnableOfertaAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, token }: { id: string; token: string }) => enableOfertaAdmin(id, token),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
            queryClient.invalidateQueries({ queryKey: ["userJobPosts"] });
            queryClient.invalidateQueries({ queryKey: ["jobPost", id] });
        },
        onError: (err) => {
            console.error("Error al habilitar la oferta como administrador:", err);
        },
    });
}

