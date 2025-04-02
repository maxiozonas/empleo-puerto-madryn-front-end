"use client";

import { useEffect, useState, useMemo } from "react";
import { OfertaCard } from "@/components/ofertas/OfertaCard";
import { Oferta } from "@/lib/types/iOferta";
import { Loader2, Anchor, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOfertas } from "@/lib/hooks/useOfertas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDeleteOferta } from "@/lib/hooks/useOfertas";
import { useSession } from "next-auth/react";

interface OfertaListProps {
  searchTerm: string;
  selectedCategoria: string;
  ofertas?: Oferta[];
  showEditOptions?: boolean;
  onEdit?: (ofertaId: string) => void;
  onDelete?: (ofertaId: string) => void;
}

export function OfertaList({
  searchTerm,
  selectedCategoria: selectedCategoria,
  ofertas: externalOfertas,
  showEditOptions = false,
  onEdit,
  onDelete,
}: OfertaListProps) {
  const { data: session } = useSession();
  const { data: fetchedOfertas, isLoading, error, refetch } = useOfertas();
  const [filteredOfertas, setFilteredOfertas] = useState<Oferta[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteOfertaMutation = useDeleteOferta();

  const allOfertas = useMemo(() => externalOfertas || fetchedOfertas || [], [externalOfertas, fetchedOfertas]);

  useEffect(() => {
    const applyFilters = () => {
      let result = [...allOfertas];

      result = result.filter((oferta) => oferta.habilitado === true);

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        result = result.filter(
          (oferta) =>
            oferta.titulo.toLowerCase().includes(term) ||
            oferta.descripcion.toLowerCase().includes(term) ||
            oferta.empresaConsultora.toLowerCase().includes(term)
        );
      }

      if (selectedCategoria !== "all") {
        result = result.filter((job) => job.categoria.id === selectedCategoria);
      }

      setFilteredOfertas(result);
    };

    applyFilters();
  }, [searchTerm, selectedCategoria, allOfertas]);

  const handleDelete = (ofertaId: string) => {
    setShowConfirmDelete(ofertaId);
  };

  const confirmDelete = () => {
    if (showConfirmDelete && session?.backendToken) {
      deleteOfertaMutation.mutate(
        { id: showConfirmDelete, token: session.backendToken },
        {
          onSuccess: () => {
            setFilteredOfertas((prev) => prev.filter((oferta) => oferta.id !== showConfirmDelete));
            setDeleteSuccess("¡Oferta eliminada con éxito!");
            if (onDelete) onDelete(showConfirmDelete);
            setShowConfirmDelete(null);
            setDeleteError(null); // Limpiar cualquier error previo
          },
          onError: (err) => {
            console.error("Error al eliminar la oferta:", err);
            // Ignoramos el error 404, ya que indica que la oferta fue eliminada correctamente
            if (err.message.includes("404")) {
              setFilteredOfertas((prev) => prev.filter((oferta) => oferta.id !== showConfirmDelete));
              setDeleteSuccess("¡Oferta eliminada con éxito!");
              if (onDelete) onDelete(showConfirmDelete);
            } else {
              setDeleteError(
                "Error al eliminar la oferta: " + (err instanceof Error ? err.message : "Error desconocido")
              );
            }
            setShowConfirmDelete(null);
          },
        }
      );
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  const handleCloseSuccess = () => {
    setDeleteSuccess(null);
  };

  const handleCloseError = () => {
    setDeleteError(null);
  };

  if (isLoading && !externalOfertas) {
    return (
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-muted-foreground">Cargando ofertas...</p>
      </div>
    );
  }

  if (error && !externalOfertas) {
    return (
      <div className="text-center text-destructive">
        <p>{error.message}</p>
        <Button
          variant="outline"
          className="mt-4 border-primary text-primary hover:bg-primary/10"
          onClick={() => refetch()}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  if (allOfertas.length === 0 || !allOfertas.some(job => job.habilitado === true)) {
    console.log("Showing no enabled jobs message");
    return (
      <div className="text-center py-8 px-4 bg-secondary/20 rounded-lg border border-secondary">
        <Anchor className="h-8 w-8 mx-auto text-primary mb-2" />
        <p className="text-foreground">Aún no hay ofertas publicadas.</p>
      </div>
    );
  }

  if (!filteredOfertas.length) {
    console.log("Showing no matching filters message");
    return (
      <div className="text-center py-8 px-4 bg-secondary/20 rounded-lg border border-secondary">
        <Anchor className="h-8 w-8 mx-auto text-primary mb-2" />
        <p className="text-foreground">No hay ofertas disponibles con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOfertas.map((oferta) => (
          <OfertaCard
            key={oferta.id}
            oferta={oferta}
            showEditOptions={showEditOptions}
            onEdit={() => onEdit?.(oferta.id)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <Alert 
            variant="default" 
            className="bg-white border border-gray-300 text-gray-800 shadow-lg max-w-md w-full p-6"
          >
            <AlertTitle className="text-lg font-semibold">Confirmar eliminación</AlertTitle>
            <AlertDescription className="mt-1">
              ¿Estás seguro que deseas eliminar esta oferta? Esta acción no se puede deshacer.
            </AlertDescription>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={cancelDelete}
                disabled={deleteOfertaMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                disabled={deleteOfertaMutation.isPending}
              >
                {deleteOfertaMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Confirmar
              </Button>
            </div>
          </Alert>
        </div>
      )}

      {deleteSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Alert 
            variant="default" 
            className="bg-green-50 border-green-400 text-green-800 shadow-lg max-w-md w-full p-6"
          >
            <CheckCircle2 className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">¡Éxito!</AlertTitle>
            <AlertDescription className="mt-1">
              {deleteSuccess}
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={handleCloseSuccess}
            >
              Cerrar
            </Button>
          </Alert>
        </div>
      )}

      {deleteError && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Alert 
            variant="destructive" 
            className="bg-red-50 border-red-400 text-red-800 shadow-lg max-w-md w-full p-6"
          >
            <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
            <AlertDescription className="mt-1">
              {deleteError}
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={handleCloseError}
            >
              Cerrar
            </Button>
          </Alert>
        </div>
      )}
    </>
  );
}