"use client";

import { useState } from "react";
import { JobList } from "@/components/job-list";
import { SearchFilters } from "@/components/search-filters";

export default function HomePage() {
  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedCategory: "all",
  });

  const handleFilterChange = (newFilters: { searchTerm: string; selectedCategory: string }) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-8 px-4">
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Encuentra tu próximo empleo en Puerto Madryn
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Explora las últimas ofertas laborales de toda la ciudad
        </p>
      </section>
      <SearchFilters onFilterChange={handleFilterChange} />
      <JobList searchTerm={filters.searchTerm} selectedCategory={filters.selectedCategory} />
    </div>
  );
}