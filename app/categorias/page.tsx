"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { useJobPosts } from "@/lib/hooks/useOfertas";
import Link from "next/link";
import { Loader2, ArrowLeft, Anchor, CircleDollarSign, Fish, Briefcase, Factory, Building, Coffee, Book, HeartPulse, Hammer, Laptop, BicepsFlexed, SquareChartGantt, Warehouse, BookUser, ChartArea, Waypoints, Handshake, Wrench, Truck, Scissors } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CategoriasPage() {
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategorias();
  const { data: allJobs, isLoading: jobsLoading, error: jobsError } = useJobPosts();
  const router = useRouter();

  if (categoriesLoading || jobsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (categoriesError || jobsError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        <p>{categoriesError?.message || jobsError?.message || "Error al cargar las categorías u ofertas"}</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <p>No hay categorías disponibles.</p>
      </div>
    );
  }

  const categoryIcons: { [key: string]: React.ReactNode } = {
    "Turismo": <Anchor className="h-6 w-6" />,
    "Ventas": <CircleDollarSign className="h-6 w-6" />,
    "Pesca": <Fish className="h-6 w-6" />,
    "Marketing": <Briefcase className="h-6 w-6" />,
    "Tecnología": <Laptop className="h-6 w-6" />,
    "Deporte": <BicepsFlexed className="h-6 w-6" />,
    "Ingeniería": <Factory className="h-6 w-6" />,
    "Diseño": <SquareChartGantt className="h-6 w-6" />,
    "Producción": <Building className="h-6 w-6" />,
    "Logística": <Warehouse className="h-6 w-6" />,
    "Atención al Cliente": <BookUser className="h-6 w-6" />,
    "Finanzas": <ChartArea className="h-6 w-6" />,
    "Administración": <Waypoints className="h-6 w-6" />,
    "Recursos Humanos": <Handshake className="h-6 w-6" />,
    "Educación": <Book className="h-6 w-6" />,
    "Salud": <HeartPulse className="h-6 w-6" />,
    "Construcción": <Hammer className="h-6 w-6" />,
    "Servicios": <Wrench className="h-6 w-6" />,
    "Chofer": <Truck className="h-6 w-6" />,
    "Gastronomía": <Coffee className="h-6 w-6" />,
    "Comercio": <Building className="h-6 w-6" />,
    "Industria": <Factory className="h-6 w-6" />,
    "Belleza": <Scissors className="h-6 w-6" />,
    "Otros": <Anchor className="h-6 w-6" />,
  };

  const jobCountByCategory = allJobs?.reduce((acc, job) => {
    if (job.habilitado === true) {
      acc[job.categoria.id] = (acc[job.categoria.id] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number }) || {};

  const handleBack = () => {
    router.push("/");
  };

  return (
    <section className="container mx-auto py-6 px-4">
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
        <h1 className="text-3xl font-bold text-primary mb-2">Categorías Destacadas</h1>
        <p className="text-muted-foreground">Explora oportunidades por sector en Puerto Madryn</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={cn(
              "group relative flex flex-col overflow-hidden transition-all duration-300",
              "hover:shadow-xl hover:-translate-y-2 hover:bg-primary/5 border-secondary/30",
              "bg-gradient-to-b from-white to-secondary/10 min-w-[280px]"
            )}
          >
            <Link href={`/categorias/${category.id}`}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="mb-4 rounded-full p-3 group-hover:text-primary">
                  {categoryIcons[category.nombre] || <Briefcase className="h-6 w-6 text-blue-600" />}
                </div>
                <CardTitle className="text-lg font-semibold group-hover:text-primary text-foreground mb-2">
                  {category.nombre}
                </CardTitle>
                <p className="text-md text-gray-500">
                  {jobCountByCategory[category.id] || 0} ofertas disponibles
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}