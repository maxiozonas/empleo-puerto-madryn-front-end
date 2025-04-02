"use client";

import { OfertaCard } from "@/components/ofertas/OfertaCard";
import { useOfertas } from "@/lib/hooks/useOfertas";
import { Anchor, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function OfertasDestacadasSection() {
  const { data: ofertas, isLoading, error } = useOfertas();

  if (isLoading) {
    return (
      <section className="container mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-2">Empleos Destacados</h2>
          <p className="text-muted-foreground">Cargando empleos destacados...</p>
        </div>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      </section>
    );
  }

  if (error || !ofertas || ofertas.length === 0 || !ofertas.some(job => job.habilitado === true)) {
    return (
      <section className="mx-auto py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-2">Empleos Destacados</h2>
          <p className="text-muted-foreground">Las mejores oportunidades laborales en Puerto Madryn</p>
          <div className="text-center w-full py-8 px-4 bg-secondary/20 rounded-lg border border-secondary mt-8">
            <Anchor className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-foreground">Aún no hay ofertas publicadas.</p>
          </div>
        </div>
      </section>
    );
  }

  const ofertasDestacadas = ofertas
    .filter(oferta => oferta.habilitado === true)
    .sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime())
    .slice(0, 3);

  return (
    <section className="mx-auto py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-primary mb-2">Empleos Destacados</h2>
        <p className="text-muted-foreground">Las mejores oportunidades laborales en Puerto Madryn</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ofertasDestacadas.map((oferta) => (
          <OfertaCard key={oferta.id} oferta={oferta} />
        ))}
      </div>
      <div className="text-center mt-5">
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300"
        >
          <Link href="/avisos">
            Ver todos los empleos
          </Link>
        </Button>
      </div>
    </section>
  );
}