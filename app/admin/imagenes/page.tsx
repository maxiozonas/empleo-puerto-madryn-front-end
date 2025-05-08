"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Anchor, BicepsFlexed, Book, BookUser, Briefcase, Building, ChartArea, CircleDollarSign, Coffee, Factory, Fish, Hammer, Handshake, HeartPulse, Laptop, Loader2, Scissors, SquareChartGantt, Truck, Warehouse, Waypoints, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import VolverButton from "@/components/ui/volver";

export default function AdminImages() {
    const { data: session, status } = useSession();
    const { data: categorias, isLoading: categoriasLoading } = useCategorias(); 
    const router = useRouter();
    
    useAuthCheck();
    
    useEffect(() => {
        if (status === "unauthenticated") {
        router.push("/login");
        }
    }, [status, router]);
    

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
      }
    
      if (status === "authenticated" && !process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").includes(session?.user.email as string)) {
        router.push("/");
         return null;
    }

    const categoriasIcons: { [key: string]: React.ReactNode } = {
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
    
      if (status === "loading"  || categoriasLoading) {
        return (
          <div className="min-h-screen flex flex-col justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Cargando...</p>
          </div>
        );
      }

    return (
        <div className="mb-8">
            <VolverButton />
            <h1 className="text-3xl font-bold text-center text-primary">Gestionar Imágenes</h1>
            <p className="text-center text-muted-foreground">
                Revisa y gestiona las imágenes de las categorías de la app.
            </p>
            {categorias?.map((categoria) => (
                <Card
                    key={categoria.id}
                    className={cn(
                    "group relative flex flex-col overflow-hidden transition-all duration-300",
                    "hover:shadow-xl hover:-translate-y-2 hover:bg-primary/5 border-secondary/30",
                    "bg-gradient-to-b from-white to-secondary/10 min-w-[280px]"
                    )}
                >
                    <a href={`/admin/imagenes/${categoria.id}`}>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                            <div className="mb-4 rounded-full p-3 group-hover:text-primary">
                            {categoriasIcons[categoria.nombre] || <Briefcase className="h-6 w-6 text-blue-600" />}
                            </div>
                            <CardTitle className="text-lg font-semibold group-hover:text-primary text-foreground mb-2">
                            {categoria.nombre}
                            </CardTitle>                
                        </CardContent>
                    </a>
                </Card>
            ))}
        </div>
    );
}