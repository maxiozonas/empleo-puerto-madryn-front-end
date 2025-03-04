"use client";

import { useEffect, useState } from "react";
import { JobCard } from "@/components/job-card";
import { JobPosting } from "@/lib/types/iJobPosting";
import { Loader2, Anchor } from "lucide-react";
import { Button } from "./ui/button";
import { useJobPosts } from "@/lib/hooks/useOfertas";

interface JobListProps {
  searchTerm: string;
  selectedCategory: string;
  jobs?: JobPosting[]; 
  showEditOptions?: boolean; 
  onEdit?: (jobId: string) => void; 
  onDelete?: (jobId: string) => void; 
}

export function JobList({
  searchTerm,
  selectedCategory,
  jobs: externalJobs,
  showEditOptions = false,
  onEdit,
  onDelete,
}: JobListProps) {
  const { data: fetchedJobs, isLoading, error, refetch } = useJobPosts(); 
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    const jobsToFilter = externalJobs || fetchedJobs || [];
    if (!jobsToFilter.length) return;

    const applyFilters = () => {
      let result = [...jobsToFilter];

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
  }, [searchTerm, selectedCategory, externalJobs, fetchedJobs]);

  if (isLoading && !externalJobs) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-muted-foreground">Cargando ofertas...</p>
      </div>
    );
  }

  if (error && !externalJobs) {
    return (
      <div className="text-center text-destructive py-8">
        <p>{error.message}</p>
        <Button
          variant="outline"
          className="mt-4 border-primary text-primary hover:bg-primary/10"
          onClick={() => refetch()}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  if (!filteredJobs.length) {
    return (
      <div className="text-center py-8 px-4 bg-secondary/20 rounded-lg border border-secondary">
        <Anchor className="h-8 w-8 mx-auto text-primary mb-2" />
        <p className="text-foreground">No hay ofertas disponibles con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {filteredJobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          showEditOptions={showEditOptions} 
          onEdit={() => onEdit?.(job.id)} 
          onDelete={() => onDelete?.(job.id)} 
        />
      ))}
    </div>
  );
}