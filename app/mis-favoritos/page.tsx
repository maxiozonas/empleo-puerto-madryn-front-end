"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OfertaList } from "@/components/ofertas/OfertaList";
import { useUserFavoritos } from "@/lib/hooks/useFavoritos";
import { Oferta } from "@/lib/types/iOferta";
import VolverButton from "@/components/ui/volver";
import Loader from "@/components/ui/loader";
import Error from "@/components/ui/error";
import { Anchor } from "lucide-react";

export default function FavoritosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const token = session?.backendToken || "";
  const { data: favoritos, isLoading, error } = useUserFavoritos(token);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (isLoading) { return <Loader />; }

  if (error) { return <Error error={error} />; }

  const favoriteJobs = favoritos?.map((fav: { ofertaEmpleo: Oferta }) => fav.ofertaEmpleo) || [];

  return (
    <div className="container min-h-screen mx-auto py-6 px-4">
      <VolverButton />
      <div className="text-center mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2 uppercase">Mis favoritos</h1>
        <p className="text-muted-foreground">Aqui podras ver todas los avisos que agregaste a favoritos.</p>
      </div>
      {favoriteJobs.length > 0 ? (
        <OfertaList
          searchTerm=""
          selectedCategoria="all"
          ofertas={favoriteJobs}
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