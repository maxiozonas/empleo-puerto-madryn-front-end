"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { useJobPosts } from "@/lib/hooks/useOfertas";
import Link from "next/link";
import { Loader2, ArrowLeft, Anchor, CircleDollarSign, Fish, Briefcase, Factory, Building, Coffee, Book, HeartPulse, Hammer, Laptop, BicepsFlexed, SquareChartGantt, Warehouse, BookUser, ChartArea, Waypoints, Handshake, ArrowRight, Wrench, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

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
        "Industria": <Factory className="h-6 w-6" />            
    };

    const jobCountByCategory = allJobs?.reduce((acc, job) => {
        acc[job.categoria.id] = (acc[job.categoria.id] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const handleBack = () => {
        router.push("/");
    };

    console.log("categories", categories?.map(category => category.nombre));

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
            <h1 className="text-3xl font-bold text-primary mb-8 text-center">Categorías</h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {categories.map((category) => (
                    <Card
                        key={category.id}
                        className="overflow-hidden border-0 bg-background shadow-md hover:shadow-lg transition-shadow"
                    >
                        <Link href={`/categorias/${category.id}`}>
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                                <div className="mb-4 text-primary">
                                    {categoryIcons[category.nombre] || <Briefcase className="h-12 w-12" />}
                                </div>
                                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                                    {category.nombre}
                                </CardTitle>
                                <p className="text-muted-foreground mb-4">
                                    {jobCountByCategory?.[category.id] || 0} avisos activos
                                </p>
                                <Button
                                    onClick={() => router.push(`/categorias/${category.id}`)}
                                    className="flex-1 group/button transition-all bg-ocean-gradient hover:bg-primary/90"
                                >
                                    <span>Ver mas</span>
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    );
}