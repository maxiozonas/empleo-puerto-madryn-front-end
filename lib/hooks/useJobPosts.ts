import { useQuery } from "@tanstack/react-query";
import { fetchJobPosts } from "../api/fetchJobPosts";
import { JobPosting } from "../types/iJobPosting";

export function useJobPosts(p0: { enabled: boolean; }) {
  return useQuery<JobPosting[], Error>({
    queryKey: ["jobPosts"],
    queryFn: fetchJobPosts
  });
}