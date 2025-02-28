"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { useCategorias } from "@/hooks/useCategories";

interface SearchFiltersProps {
  onFilterChange: (filters: { searchTerm: string; selectedCategory: string }) => void;
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const { categorias, error } = useCategorias();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const activeFiltersCount = (searchTerm.trim() ? 1 : 0) + (selectedCategory !== "all" ? 1 : 0);

  const handleFilterChange = () => {
    console.log("Enviando filtros:", { searchTerm, selectedCategory }); // Depuración
    onFilterChange({ searchTerm, selectedCategory });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    onFilterChange({ searchTerm: "", selectedCategory: "all" });
  };

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg border shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Buscador principal */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar empleos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
              className="pl-10"
            />
          </div>

          {/* Filtro por categoría */}
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              console.log("Seleccionando categoría:", value); // Depuración
              setSelectedCategory(value);
              handleFilterChange();
            }}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categorias.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">
              <X className="mr-2 h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Indicadores de filtros activos */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchTerm.trim() && (
            <Badge variant="secondary" className="text-sm">
              Búsqueda: {searchTerm}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => {
                  setSearchTerm("");
                  handleFilterChange();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="text-sm">
              Categoría: {categorias.find((cat) => cat.id === selectedCategory)?.nombre || selectedCategory}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => {
                  setSelectedCategory("all");
                  handleFilterChange();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}