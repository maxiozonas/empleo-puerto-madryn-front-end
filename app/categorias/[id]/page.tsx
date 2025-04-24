"use client";

import { useParams } from "next/navigation";
import { OfertaList } from "@/components/ofertas/OfertaList";
import { useOfertasByCategory } from "@/lib/hooks/useOfertas";
import { useCategorias } from "@/lib/hooks/useCategorias";
import Loader from "@/components/ui/loader";
import Error from "@/components/ui/error";
import VolverButton from "@/components/ui/volver";

export default function CategoryPage() {
  const { id } = useParams();
  const { data: jobs, isLoading, error } = useOfertasByCategory(id as string);
  const { data: categories } = useCategorias();

  const categoryName = categories?.find((cat) => cat.id === id)?.nombre || "Categoría";

  if (isLoading) { return <Loader />; }

  if (error) { return <Error error={error} />; }

  return (
    <div className="container min-h-screen mx-auto py-6 px-4">
      <VolverButton />
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary text-center mb-2 uppercase">{categoryName}</h1>
        <p className="text-muted-foreground text-center mb-2">Descubre las mejores ofertas de empleo en {categoryName} en Puerto Madryn</p>
      </div>
      <OfertaList searchTerm="" selectedCategoria="all" ofertas={jobs} showEditOptions={false} />
    </div>
  );
}