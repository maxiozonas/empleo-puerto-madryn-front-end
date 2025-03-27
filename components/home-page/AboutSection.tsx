"use client";

import Image from "next/image";
import { Factory, Anchor as Whale, Fish } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">Trabajar en Puerto Madryn</h2>
            <p className="text-muted-foreground mb-6 text-justify">
              Puerto Madryn es una ciudad costera ubicada en la provincia de Chubut, Patagonia Argentina. Reconocida por
              su belleza natural, es un importante centro industrial, pesquero y turístico.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <Factory className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Polo Industrial</h3>
                  <p className="text-sm text-muted-foreground text-justify">
                    Sede de Aluar, la mayor productora de aluminio de Latinoamérica.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <Whale className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Turismo</h3>
                  <p className="text-sm text-muted-foreground text-justify">
                    Destino mundial para el avistamiento de ballenas y fauna marina.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <Fish className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Pesca</h3>
                  <p className="text-sm text-muted-foreground text-justify">
                    Importante centro pesquero con procesamiento de productos marinos.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1473437673642-a9229b66cd75?q=80&w=1932&auto=format&fit=crop"
              alt="Puerto Madryn"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white font-bold text-xl mb-2">Calidad de vida</h3>
              <p className="text-white/90 text-justify">
                Una ciudad que combina oportunidades laborales con un entorno natural privilegiado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}