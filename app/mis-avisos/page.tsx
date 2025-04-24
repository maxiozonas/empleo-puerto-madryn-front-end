"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OfertaList } from "@/components/ofertas/OfertaList";
import { Anchor } from "lucide-react";
import { useUserOfertas, useDeleteOferta } from "@/lib/hooks/useOfertas";
import VolverButton from "@/components/ui/volver";
import Loader from "@/components/ui/loader";
import Error from "@/components/ui/error";

export default function MisAvisosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const token = session?.backendToken || "";
  const { data: ofertas, isLoading, error } = useUserOfertas(token);
  const deleteMutation = useDeleteOferta();

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading" || isLoading) { return <Loader />; }
  if (error) {
    return <Error error={error instanceof Error ? error : null} message={!error || !(error instanceof Error) ? "Ha ocurrido un error" : undefined} />;
  }

  const handleEdit = (ofertaId: string) => {
    router.push(`/editar-aviso/${ofertaId}`);
  };

  const handleDelete = (ofertaId: string) => {
    deleteMutation.mutate(
      { id: ofertaId, token },
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
  };

  return (
    <div className="container mx-auto min-h-screen py-6 px-4">
      <VolverButton />
      <div className="text-center mb-10">
        <h1 className="text-2xl lg:text-2xl font-bold text-primary mb-2 uppercase">Mis avisos</h1>
        <p className="text-muted-foreground">Aqui podras gestionar todos los avisos que publicaste desde tu cuenta.</p>
        <p className="text-muted-foreground">Aquí podrás ver, editar o eliminar los avisos que has publicado desde tu cuenta.</p>
      </div>
      {ofertas && ofertas.length > 0 ? (
        <OfertaList
          searchTerm=""
          selectedCategoria="all"
          ofertas={ofertas}
          showEditOptions={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="text-center py-8 px-4 bg-secondary/20 rounded-lg border border-secondary">
          <Anchor className="h-8 w-8 mx-auto text-primary mb-2" />
          <p className="text-foreground">Aún no hiciste ninguna publicacion.</p>
        </div>
      )}
    </div>
  );
}