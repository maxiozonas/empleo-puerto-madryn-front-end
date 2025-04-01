"use client";

import { SearchFilters } from "@/components/ofertas/search-filters";
import { ServiceList } from "@/components/servicios/ServiceList";
import { useState } from "react";

export default function ServiciosPage() {
  const [filters, setFilters] = useState<{ searchTerm?: string; selectedCategory?: string }>({
    searchTerm: "",
    selectedCategory: "all",
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Servicios Disponibles</h1>
      <SearchFilters onFilterChange={setFilters} />
      <ServiceList searchTerm={filters.searchTerm || ""} selectedCategory={filters.selectedCategory || "all"} />
    </div>
  );
}