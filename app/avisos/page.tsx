"use client";

import { useState } from "react";
import { OfertaList } from "@/components/ofertas/OfertaList";
import { SearchFilters } from "@/components/ofertas/SearchFilters";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useOfertas } from "@/lib/hooks/useOfertas";


export default function AvisosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: ofertas, isLoading, error } = useOfertas()

  const handleFilterChange = (newFilters: { searchTerm?: string; selectedCategory?: string }) => {
    if (newFilters.searchTerm !== undefined) setSearchTerm(newFilters.searchTerm);
    if (newFilters.selectedCategory !== undefined) setSelectedCategory(newFilters.selectedCategory);
  };

  const handleBack = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="container min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto justify-center items-center text-primary" />
        <p className="mt-2 text-muted-foreground">Cargando</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4 text-center text-destructive">
        <p>{error.message}</p>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-primary mb-2">Ofertas Laborales</h1>
        <p className="text-muted-foreground">Explora todas las oportunidades laborales en Puerto Madryn.</p>
      </div>
      <SearchFilters onFilterChange={handleFilterChange} />
      <OfertaList searchTerm={searchTerm} selectedCategoria={selectedCategory} ofertas={ofertas} />
    </div>
  );
}