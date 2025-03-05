import { useQuery } from "@tanstack/react-query";
import { JobPosting } from "../types/iJobPosting";
import { fetchJobPostById, fetchJobPosts, fetchUserJobPosts } from "../api/ofertas";

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