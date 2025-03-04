"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { JobList } from "@/components/job-list";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserJobPosts } from "@/lib/hooks/useOfertas";

export default function MisAvisosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: jobs, isLoading, error } = useUserJobPosts(session?.backendToken || "");

  const deleteMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(`https://empleo-pm-back-end-app.onrender.com/api/ofertas/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.backendToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la publicación");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userJobPosts", session?.backendToken] });
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : "Error desconocido");
    },
  });

  const handleEdit = (jobId: string) => {
    router.push(`/editar-aviso/${jobId}`);
  };

  const handleDelete = (jobId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      deleteMutation.mutate(jobId);
    }
  };

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

  return (
    <div className="container mx-auto py-8 px-4">
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