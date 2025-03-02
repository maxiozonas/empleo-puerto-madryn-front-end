"use client";

import { useState, useEffect } from "react";
import { JobCard } from "@/components/job-card";
import { JobPosting } from "@/lib/types/iJobPosting";
import { useJobPosts } from "@/lib/hooks/useJobPosts";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface JobListProps {
  searchTerm: string;
  selectedCategory: string;
}

export function JobList({ searchTerm, selectedCategory }: JobListProps) {
  const { data: jobs, isLoading, error, refetch } = useJobPosts();
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    if (!jobs) return;

    const applyFilters = () => {
      let result = [...jobs];

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        result = result.filter(
          (job) =>
            job.titulo.toLowerCase().includes(term) ||
            job.descripcion.toLowerCase().includes(term) ||
            job.empresaConsultora.toLowerCase().includes(term)
        );
      }

      if (selectedCategory !== "all") {
        result = result.filter((job) => job.categoria.id === selectedCategory);
      }

      setFilteredJobs(result);
    };

    applyFilters();
  }, [searchTerm, selectedCategory, jobs]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-muted-foreground">Cargando ofertas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error.message}</p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (!filteredJobs.length) {
    return <div className="text-center py-8">No hay ofertas disponibles con los filtros seleccionados.</div>;
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {filteredJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}