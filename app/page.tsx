"use client";

import { HeroSection } from "@/components/home-page/HeroSection";
import { OfertasDestacadasSection } from "@/components/home-page/OfertasDestacasSection";
import { SobreMadrynSection } from "@/components/home-page/SobreMadrynSection";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";

export default function HomePage() {
  useAuthCheck();

  return (
    <div>
      <HeroSection />
      <OfertasDestacadasSection />
      <SobreMadrynSection />
    </div>
  );
}

