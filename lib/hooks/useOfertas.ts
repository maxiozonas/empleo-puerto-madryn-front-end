import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JobPosting } from "../types/iJobPosting";
import { deleteJobOffer, fetchJobPostById, fetchJobPosts, fetchUserJobPosts } from "../api/ofertas";

export function useJobPostById(id: string) {
    return useQuery<JobPosting, Error>({
        queryKey: ["jobPost", id],
        queryFn: () => fetchJobPostById(id),
        enabled: !!id,
    });
}

export function useJobPosts() {
    return useQuery<JobPosting[], Error>({
        queryKey: ["jobPosts"],
        queryFn: fetchJobPosts,
    });
}

export function useUserJobPosts(token: string) {
    return useQuery<JobPosting[], Error>({
        queryKey: ["userJobPosts", token],
        queryFn: () => fetchUserJobPosts(token),
        enabled: !!token,
    });
}

export function useJobPostsByCategory(categoryId: string) {
    return useQuery<JobPosting[], Error>({
        queryKey: ["jobPostsByCategory", categoryId],
        queryFn: async () => {
            const allJobs = await fetchJobPosts();
            return allJobs.filter((job) => job.categoria.id === categoryId);
        },
    });
}

export function useDeleteJobOffer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, token }: { id: string; token: string }) => deleteJobOffer(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
            queryClient.invalidateQueries({ queryKey: ["userJobPosts"] });
        },
        onError: (err) => {
            console.error("Error al eliminar la oferta:", err);
        },
    });
}