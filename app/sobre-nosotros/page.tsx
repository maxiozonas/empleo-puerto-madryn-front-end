"use client";

import { Button } from "@/components/ui/button";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SobreNosotrosPage() {
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
    <section className="container min-h-screen mx-auto py-6 px-4">
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
        <h1 className="text-2xl lg:text-3xl font-bold text-center text-primary uppercase">Sobre Nosotros</h1>
        <p className="text-muted-foreground ">
          Somos Máximo Ozonas y Juan Ignacio Rodríguez Mariani, dos amigos de Puerto Madryn, Chubut, que decidimos unir nuestras habilidades para crear &quot;Madryn Empleos&quot;. Este proyecto nace de una necesidad que observamos en la comunidad: la falta de una plataforma efectiva para conectar a quienes buscan empleo con empresas locales. Combinamos nuestra pasión por la tecnología y el desarrollo web para ofrecer una solución práctica que fomente las oportunidades laborales en la Patagonia Argentina.
        </p>
        <p className="text-muted-foreground">
          Nuestro objetivo es simple pero ambicioso: facilitar la búsqueda y creación de empleo en Puerto Madryn, apoyando tanto a los residentes como a las empresas de la región. Este sitio no solo es una herramienta útil, sino también un reflejo de nuestro compromiso con el crecimiento económico y social de la ciudad. Esperamos que &quot;Madryn Empleos&quot; sea un puente para el talento local y una ayuda para quienes buscan dar el próximo paso en su carrera. ¡Gracias por acompañarnos en esta misión y bienvenidos a nuestra comunidad!
        </p>
      </div>
      <div className="flex flex-col items-center gap-12 mt-16 md:flex-row md:justify-center">
        {/* Máximo Ozonas */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-48 h-48">
            <Image
              src={images.maxifoto}
              alt="Foto de Máximo Ozonas, creador de Madryn Empleos"
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
              alt="Foto de Juan Ignacio Rodríguez Mariani, creador de Madryn Empleos"
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