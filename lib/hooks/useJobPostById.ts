import { useQuery, QueryFunctionContext } from "@tanstack/react-query";
import { JobPosting } from "../types/iJobPosting";
import { fetchJobPostById } from "../api/fetchJobPostById";

export function useJobPostById(id: string) {
  return useQuery<JobPosting, Error>({
    queryKey: ["jobPostById", id],
    queryFn: ({ queryKey }: QueryFunctionContext<[string, string]>) => fetchJobPostById({ queryKey }),
  });
}
