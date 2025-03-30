"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { useEffect, useState } from "react";
import { JobPosting } from "@/lib/types/iJobPosting";
import { useJobPosts } from "@/lib/hooks/useOfertas";
import { useSession } from "next-auth/react";
import { enableJobOfferAdmin } from "@/lib/api/ofertas";


export default function ContactUs() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { data: fetchedJobs, isLoading} = useJobPosts();
    const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  
    useAuthCheck();

    useEffect(() => {
        const jobsToFilter = fetchedJobs || [];
        
        const applyFilters = () => {
          let result = [...jobsToFilter];
    
          result = result.filter((job) => job.habilitado === false);
    
          setFilteredJobs(result);
        };
    
        applyFilters();
      }, [fetchedJobs]);

      if (status === "unauthenticated") {
    
        router.push("/login");
        return null;
      }

      if (status === "authenticated" && (session?.user.email !== "empleospuertomadryn@gmail.com")){
        router.push("/");
        return null;
    }

      if (status === "loading" || isLoading) {
          return (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-muted-foreground">Cargando...</p>
            </div>
          );
    }

    const handleBack = () => {
        router.push("/");
    };
    
    const handleHabiliar = async (data: JobPosting) => {
        enableJobOfferAdmin(data.id, session?.backendToken as string)
        router.refresh();
      };

  return (
    <section className="container mx-auto py-6 px-4">
        <div className="flex items-center mb-6">
          <Button
            onClick={handleBack}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Volver</span>
          </Button>          
        </div>
        <header className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-center text-primary">Avisos Para Habilitar</h1>          
        </header>
        <div className="mb-8">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="border p-4 mb-4 rounded-md shadow-sm bg-white">
                <h2 className="text-xl font-semibold">{job.titulo}</h2>
                <p className="text-gray-600">{job.descripcion}</p>
                <p className="text-gray-600">Empresa: {job.empresaConsultora}</p>
                <p className="text-gray-600">Fecha: {new Date(job.fechaPublicacion).toLocaleDateString()}</p>
                <Button
                    onClick={() => handleHabiliar(job)}
                    className="mt-2 rigth-0"
                >
                    Habilitar
                </Button>
              </div>
            ))
          ) : (
            <p>No hay avisos para habilitar.</p>
          )}
        </div>
    </section>
  );
}