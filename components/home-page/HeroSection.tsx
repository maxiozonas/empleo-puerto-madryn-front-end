"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Anchor } from "lucide-react";

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1526085714137-8c2402e21151?q=80&w=2071&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583030225577-329fe6cc80d6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523295029613-4b96e13a8c21?q=80&w=2071&auto=format&fit=crop",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <><div>
      <p className="text-secondary-foreground"> Aun estamos en desarrollo, si estan aqui es porque se les dio acceso mediante el link. Esto con el objetivo de obtener feedback. Muchas gracias.</p>
    </div><section className="relative h-[600px] overflow-hidden rounded-3xl shadow-xl w-full">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/30 z-10"></div>
            <Image
              src={src}
              alt={`Puerto Madryn escena ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0} />
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 z-20 container mx-auto">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                <Anchor className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-white font-medium">EmpleosMadryn</h2>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Descubre tu futuro profesional en Puerto Madryn
            </h1>
            <p className="text-white/90 text-lg sm:text-xl mb-8">
              Donde el mar patagónico y las oportunidades laborales se encuentran
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="outline" className="border-white text-neutral-800 hover:bg-white/10">
                <Link href="/avisos">Ver avisos laborales</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-neutral-800 hover:bg-white/10">
                <Link href="/nuevo-aviso">Publicar aviso</Link>
              </Button>
            </div>
          </div>
        </div>
      </section></>
  );
}