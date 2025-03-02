"use client";

import { useState } from "react";
import { JobList } from "@/components/job-list";
import { SearchFilters } from "@/components/search-filters";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useAuthCheck();

  const handleFilterChange = (newFilters: { searchTerm?: string; selectedCategory?: string }) => {
    if (newFilters.searchTerm !== undefined) setSearchTerm(newFilters.searchTerm);
    if (newFilters.selectedCategory !== undefined) setSelectedCategory(newFilters.selectedCategory);
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
      <JobList searchTerm={searchTerm} selectedCategory={selectedCategory} />
    </div>
  );
}