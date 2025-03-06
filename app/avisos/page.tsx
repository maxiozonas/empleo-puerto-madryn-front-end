"use client";

import { useState } from "react";
import { JobList } from "@/components/job-list";
import { SearchFilters } from "@/components/search-filters";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function OfertasLaboralesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useAuthCheck();

  const handleFilterChange = (newFilters: { searchTerm?: string; selectedCategory?: string }) => {
    if (newFilters.searchTerm !== undefined) setSearchTerm(newFilters.searchTerm);
    if (newFilters.selectedCategory !== undefined) setSelectedCategory(newFilters.selectedCategory);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto py-6 px-4">
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
        <p className="text-muted-foreground">Explora todas las oportunidades laborales en Puerto Madryn</p>
      </div>
      <SearchFilters onFilterChange={handleFilterChange} />
      <JobList searchTerm={searchTerm} selectedCategory={selectedCategory} />
    </div>
  );
}