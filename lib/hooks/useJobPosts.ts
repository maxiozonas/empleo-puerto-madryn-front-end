import { useQuery } from "@tanstack/react-query";
import { fetchJobPosts } from "../api/fetchJobPosts";
import { JobPosting } from "../types/iJobPosting"; // Ajusta la ruta según tu estructura

export function useJobPosts() {
  return useQuery<JobPosting[], Error>({
    queryKey: ["jobPosts"],
    queryFn: fetchJobPosts
  });
}