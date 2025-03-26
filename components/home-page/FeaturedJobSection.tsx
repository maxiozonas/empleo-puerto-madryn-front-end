"use client";

import { JobCard } from "@/components/ofertas/job-card";
import { useJobPosts } from "@/lib/hooks/useOfertas";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FeaturedJobsSection() {
  const { data: jobs, isLoading, error } = useJobPosts();

  if (isLoading) {
    return (
      <section className="container mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-2">Empleos Destacados</h2>
          <p className="text-muted-foreground">Cargando empleos destacados...</p>
        </div>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      </section>
    );
  }

  if (error || !jobs) {
    return (
      <section className="container mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-2">Empleos Destacados</h2>
          <p className="text-destructive">No se pudieron cargar los empleos destacados.</p>
        </div>
      </section>
    );
  }

  const featuredJobs = jobs.slice(0, 3); // Mostrar solo las primeras 3 ofertas

  return (
    <section className="container mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-primary mb-2">Empleos Destacados</h2>
        <p className="text-muted-foreground">Las mejores oportunidades laborales en Puerto Madryn</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      <div className="text-center mt-10">
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300"
        >
          <Link href="/avisos">
            Ver todos los empleos
          </Link>
        </Button>
      </div>
    </section>
  );
}