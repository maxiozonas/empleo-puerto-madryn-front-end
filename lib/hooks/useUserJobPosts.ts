import { useQuery } from "@tanstack/react-query";
import { JobPosting } from "../types/iJobPosting";
import { fetchUserJobPosts } from "../api/fetchUserJobPosts";

export function useUserJobPosts(token: string) {
  return useQuery<JobPosting[], Error>({
    queryKey: ["userJobPosts", token],
    queryFn: () => fetchUserJobPosts(token),
    enabled: !!token, 
  });
}