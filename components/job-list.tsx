"use client";

import { useEffect, useState } from "react";
import { JobCard } from "@/components/job-card";
import { JobPosting } from "@/lib/types";

export function JobList() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/ofertas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorText = await response.text(); 
          throw new Error(`Error: ${response.status} - ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          throw new Error("La respuesta del servidor no es un array válido");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-center">Cargando ofertas de empleo...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (jobs.length === 0) {
    return <div className="text-center">No hay ofertas disponibles.</div>;
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}