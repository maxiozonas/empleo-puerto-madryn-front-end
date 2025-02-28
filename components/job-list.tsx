"use client";

import { useEffect, useState } from "react";
import { JobCard } from "@/components/job-card";
import { JobPosting } from "@/lib/types";

interface JobListProps {
  searchTerm: string;
  selectedCategory: string;
}

export function JobList({ searchTerm, selectedCategory }: JobListProps) {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/ofertas", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("La respuesta del servidor no es un array válido");
        }
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido al cargar las ofertas");
      } 
    };

    fetchJobs();
  }, []);

  useEffect(() => {
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
      } else {
        result = [...jobs];
      }

      // Filtro por categoría
      if (selectedCategory !== "all") {
        console.log("Filtrando por categoría:", selectedCategory); 
        result = result.filter((job) => {
          const matches = job.categoria.id === selectedCategory;
          console.log(`Comparando ${job.categoria.id} con ${selectedCategory}: ${matches}`); 
          return matches;
        });
      }

      setFilteredJobs(result);
    };

    applyFilters();
  }, [searchTerm, selectedCategory, jobs]);


  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (filteredJobs.length === 0) {
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