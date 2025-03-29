"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { JobList } from "@/components/ofertas/job-list";
import { Anchor, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserFavorites } from "@/lib/hooks/useFavoritos";
import { JobPosting } from "@/lib/types/iJobPosting"; // Asegúrate de importar el tipo correcto

export default function FavoritosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const token = session?.backendToken || "";
  const { data: favoritos, isLoading, error } = useUserFavorites(token);

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

  const favoriteJobs = favoritos?.map((fav: { ofertaEmpleo: JobPosting }) => fav.ofertaEmpleo) || [];

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="container min-h-screen mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button
          onClick={handleBack}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Volver</span>
        </Button>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary mb-2">Mis favoritos</h1>
        <p className="text-muted-foreground">Aqui podras ver todas los avisos que agregaste a favoritos.</p>
      </div>
      {favoriteJobs.length > 0 ? (
        <JobList
          searchTerm=""
          selectedCategory="all"
          jobs={favoriteJobs}
          showEditOptions={false}
        />
      ) : (
        <div className="text-center py-8 px-4 bg-secondary/20 rounded-lg border border-secondary">
          <Anchor className="h-8 w-8 mx-auto text-primary mb-2" />
          <p className="text-foreground">Aún no tienes avisos en favoritos.</p>
        </div>
      )}
    </div>
  );
}