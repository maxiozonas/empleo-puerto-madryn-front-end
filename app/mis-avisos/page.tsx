"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { JobList } from "@/components/ofertas/job-list";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUserJobPosts, useDeleteJobOffer } from "@/lib/hooks/useOfertas";

export default function MisAvisosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const token = session?.backendToken || "";
  const { data: jobs, isLoading, error } = useUserJobPosts(token);
  const deleteMutation = useDeleteJobOffer(); // Usa el hook existente

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        <p>{error.message}</p>
      </div>
    );
  }

  const handleEdit = (jobId: string) => {
    router.push(`/editar-aviso/${jobId}`);
  };

  const handleDelete = (jobId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      deleteMutation.mutate(
        { id: jobId, token },
        {
          onError: (err) => {
            console.error("Error al eliminar:", err);
            alert(err instanceof Error ? err.message : "Error desconocido al eliminar la publicación");
          },
          onSuccess: () => {
            console.log("Publicación eliminada con éxito");
          },
        }
      );
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto min-h-screen py-6 px-4">
      <div className="flex items-center mb-6">
        <Button
          onClick={handleBack}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Volver</span>
        </Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Mis Avisos</h1>
        <Button asChild className="bg-ocean-gradient hover:bg-primary/90">
          <Link href="/nuevo-aviso">Nuevo Aviso</Link>
        </Button>
      </div>
      {jobs && jobs.length > 0 ? (
        <JobList
          searchTerm=""
          selectedCategory="all"
          jobs={jobs}
          showEditOptions={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <p className="text-muted-foreground">No tienes publicaciones aún.</p>
      )}
    </div>
  );
}