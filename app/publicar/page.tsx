"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function PublicarOpcionesPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (status === "unauthenticated") {
    return null; 
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">¿Qué deseas publicar?</h1>
      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Briefcase className="h-6 w-6 text-primary" />
              Oferta de empleo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-center">
              Publica una oferta de trabajo.
            </p>
            <Button
              className="w-full bg-primary text-white hover:bg-primary/90"
              onClick={() => router.push("/nuevo-aviso")}
            >
              Publicar oferta
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Ship className="h-6 w-6 text-primary" />
              Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-center">
              Ofrece un servicio profesional.
            </p>
            <Button
              className="w-full bg-primary text-white hover:bg-primary/90"
              onClick={() => router.push("/nuevo-servicio")}
            >
              Publicar servicio
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}