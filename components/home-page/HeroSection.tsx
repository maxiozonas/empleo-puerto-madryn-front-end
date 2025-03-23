"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import aguaImage from "/public/lib/agua.jpg";
import ballenaImage from "/public/lib/ballena.jpg";
import playaImage from "/public/lib/playa.jpg";

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [aguaImage, ballenaImage, playaImage];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative h-[500px] overflow-hidden rounded-3xl shadow-xl w-full">
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/30 z-10"></div>
          <Image
            src={src}
            alt={`Puerto Madryn escena ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-6 md:items-start md:px-12 z-20 container mx-auto">
        <div className="max-w-2xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full">
              <Image
                src="/lib/logoPage.png"
                alt="Empleos Madryn"
                width={128}
                height={128}
                className="h-16 w-16"
              />
            </div>
            <h2 className="text-white font-medium">Empleos Madryn</h2>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Descubre tu futuro en Puerto Madryn
          </h1>
          <p className="text-white/90 text-lg sm:text-xl mb-8">
            Donde el mar patagónico y las oportunidades laborales se encuentran
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-neutral-800 hover:bg-white/30"
            >
              <Link href="/avisos">Ver avisos laborales</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-neutral-800 hover:bg-white/30"
            >
              <Link href="/nuevo-aviso">Publicar aviso</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}