"use client";

import { Button } from "@/components/ui/button";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AboutUs() {
  const router = useRouter();

  const images = {
    maxifoto: "/lib/maxifoto.jpg",
    juanifoto: "/lib/juanfoto.jpg",
  };

  const icons = {
    instagram: "/icons/instagram.svg",
    linkedin: "/icons/linkedin.svg",
    github: "/icons/github.svg",
  };

  useAuthCheck();

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
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center text-primary mb-2">
          Sobre Nosotros
        </h1>
        <p className="text-muted-foreground text-justify">
          Somos dos amigos que, motivados por una necesidad observada en Puerto Madryn, decidimos unir nuestras habilidades y entusiasmo para crear esta página web. Nuestro objetivo principal es facilitar la búsqueda y creación de oportunidades laborales en la región, un área donde identificamos una carencia que queríamos abordar. Este proyecto nace no solo como una solución práctica para conectar a la comunidad con el empleo, sino también como una oportunidad para poner en práctica nuestros conocimientos y contribuir al bienestar de la ciudad. <br />
          Con dedicación y compromiso, buscamos ofrecer una herramienta útil que apoye el desarrollo económico y social de esta ciudad.
        </p>
        <p className="text-muted-foreground text-justify">
          Esperamos que esta plataforma sea de gran ayuda para todos. ¡Gracias por ser parte de este esfuerzo y bienvenidos a nuestra comunidad!
        </p>        
      </div>
      <div className="flex flex-col items-center gap-12 mt-16 md:flex-row md:justify-center">
        {/* Máximo Ozonas */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-48 h-48">
            <Image
              src={images.maxifoto}
              alt="Maxi_Foto"
              fill={true}
              className="rounded-full object-cover"
            />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-muted-foreground">Máximo Ozonas</p>
            <p className="text-sm text-muted-foreground">Técnico en Programación</p>
          </div>
          <div className="flex justify-center gap-3">
            <a
              href="https://instagram.com/maxiozonas"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity"
            >
              <Image
                src={icons.instagram}
                alt="Instagram de Máximo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </a>
            <a
              href="https://linkedin.com/in/maximoozonas"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity"
            >
              <Image
                src={icons.linkedin}
                alt="LinkedIn de Máximo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </a>
            <a
              href="https://github.com/MaxiOzonas"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity"
            >
              <Image
                src={icons.github}
                alt="GitHub de Máximo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </a>
          </div>
        </div>

        {/* Juan Ignacio Rodríguez Mariani */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-48 h-48">
            <Image
              src={images.juanifoto}
              alt="Juani_Foto"
              fill={true}
              className="rounded-full object-cover"
            />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-muted-foreground">Juan Ignacio Rodríguez Mariani</p>
            <p className="text-sm text-muted-foreground">Estudiante de Ingeniería en Sistemas de Información</p>
          </div>
          <div className="flex justify-center gap-3">
            <a
              href="https://instagram.com/juanirmariani"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity"
            >
              <Image
                src={icons.instagram}
                alt="Instagram de Juan Ignacio"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </a>
            <a
              href="https://linkedin.com/in/juan-ignacio-rodriguez-mariani"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity"
            >
              <Image
                src={icons.linkedin}
                alt="LinkedIn de Juan Ignacio"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </a>
            <a
              href="https://github.com/JuaniRMariani"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity"
            >
              <Image
                src={icons.github}
                alt="GitHub de Juan Ignacio"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}