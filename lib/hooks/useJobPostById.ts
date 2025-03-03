import { useQuery } from "@tanstack/react-query";
import { JobPosting } from "../types/iJobPosting";
import { fetchJobPostById } from "../api/fetchJobPostById";

export function useJobPostById(id: string, token?: string) {
  return useQuery<JobPosting, Error>({
    queryKey: ["jobPost", id],
    queryFn: () => fetchJobPostById(id),
    enabled: !!id,
  });
}
