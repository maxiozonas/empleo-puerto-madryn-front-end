"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useCategorias } from "@/lib/hooks/useCategorias";

interface SearchFiltersProps {
  onFilterChange: (filters: { searchTerm?: string; selectedCategory?: string }) => void;
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const { data: categorias, error } = useCategorias();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    onFilterChange({ searchTerm, selectedCategory });
  }, [searchTerm, selectedCategory, onFilterChange]);

  const activeFiltersCount = (searchTerm.trim() ? 1 : 0) + (selectedCategory !== "all" ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };


  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        <p>{error.message}</p>
      </div>
    );
  }

  if (!categorias || categorias.length === 0) {
    return true
  }

  return (
    <div className="space-y-6 mb-3">
      <div className="bg-white p-4 sm:p-6 rounded-lg border shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Buscador principal */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar empleos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro por categoría */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value="all" className="bg-primary text-white">Todas las categorías</SelectItem>
              {categorias.map((category) => (
                <SelectItem key={category.id} value={category.id} className="hover:bg-primary hover:text-white !important">
                  {category.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <Button onClick={clearFilters} className="w-full sm:w-auto hover:bg-primary hover:text-white">
              <X className="mr-2 h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}