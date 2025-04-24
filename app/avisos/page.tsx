"use client";

import { useState } from "react";
import { OfertaList } from "@/components/ofertas/OfertaList";
import { SearchFilters } from "@/components/ofertas/SearchFilters";
import { useOfertas } from "@/lib/hooks/useOfertas";
import VolverButton from "@/components/ui/volver";
import Loader from "@/components/ui/loader";
import Error from "@/components/ui/error";

export default function AvisosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: ofertas, isLoading, error } = useOfertas()

  const handleFilterChange = (newFilters: { searchTerm?: string; selectedCategory?: string }) => {
    if (newFilters.searchTerm !== undefined) setSearchTerm(newFilters.searchTerm);
    if (newFilters.selectedCategory !== undefined) setSelectedCategory(newFilters.selectedCategory);
  };

  if (isLoading) { return <Loader />; }

  if (error) { return <Error error={error} />; }

  return (
    <div className="container min-h-screen mx-auto py-6 px-4">
      <VolverButton />
      <div className="text-center mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2 uppercase">Ofertas Laborales en Puerto Madryn</h1>
        <p className="text-muted-foreground">Encuentra las mejores oportunidades laborales en Puerto Madryn.</p>
      </div>
      <SearchFilters onFilterChange={handleFilterChange} />
      <OfertaList searchTerm={searchTerm} selectedCategoria={selectedCategory} ofertas={ofertas} />
      <div className="text-center mt-6 bg-secondary/20 p-4 rounded-lg">
        <p className="text-foreground">
          ¡Estamos creciendo! No dudes en ofrecer tu puesto de trabajo a la comunidad. ¿Tienes un empleo para ofrecer?{" "}
          <a href="/nuevo-aviso" className="text-primary underline">Publica tu aviso ahora</a>.
        </p>
      </div>
    </div>
  );
}