"use client";

import { useParams, useRouter } from "next/navigation";
import { JobList } from "@/components/ofertas/job-list";
import { useJobPostsByCategory } from "@/lib/hooks/useOfertas";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const { id } = useParams();
  const { data: jobs, isLoading, error } = useJobPostsByCategory(id as string);
  const { data: categories } = useCategorias();
  const router = useRouter();

  const categoryName = categories?.find((cat) => cat.id === id)?.nombre || "Categoría";

  const handleBack = () => {
    router.push("/categorias");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        <p>{error.message}</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
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
        <h1 className="text-3xl font-bold text-primary text-center mb-2">{categoryName}</h1>
        <p className="text-muted-foreground text-center mb-2">Estas son las ofertas de empleo para la categoria {categoryName}</p>
        <JobList searchTerm="" selectedCategory="all" jobs={jobs} showEditOptions={false} />
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
      <h1 className="text-3xl font-bold text-primary text-center">{categoryName}</h1>
      <p className="text-muted-foreground text-center">Estas son las ofertas de empleo para la categoria {categoryName}</p>
      <JobList searchTerm="" selectedCategory="all" jobs={jobs} showEditOptions={false} />
    </div>
  );
}