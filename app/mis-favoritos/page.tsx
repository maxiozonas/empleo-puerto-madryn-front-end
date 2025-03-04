"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { JobList } from "@/components/job-list";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserFavorites } from "@/lib/hooks/useFavoritos";

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

  const favoriteJobs = favoritos?.map((fav: any) => fav.ofertaEmpleo) || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Mis Favoritos</h1>
      {favoriteJobs.length > 0 ? (
        <JobList
          searchTerm=""
          selectedCategory="all"
          jobs={favoriteJobs}
          showEditOptions={false}
        />
      ) : (
        <p className="text-muted-foreground">No tienes publicaciones en favoritos aún.</p>
      )}
    </div>
  );
}