"use client"; // Asegúrate de que sea un componente del lado del cliente

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    router.push("/"); 
  };

  const handlePrivacyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/politica-privacidad"); 
  };

  const handleAboutUsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/sobre-nosotros");
  }

  const handlePublishClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/nuevo-aviso"); 
  };
  

  return (
    <div className="border-t mt-6 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
      <div className="mb-4 md:mb-0">
        Hecho con <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> por Máximo y Juan Ignacio.
      </div>
      <div className="flex flex-wrap justify-center md:justify-end gap-4">
        <a
          href="#"
          onClick={handleHomeClick}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          Home
        </a>
        <span>·</span>
        <a
          href="#"
          onClick={handlePrivacyClick}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          Política Privacidad
        </a>
        <span>·</span>
        <a
          href="#"
          onClick={handleAboutUsClick}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          Sobre Nosotros
        </a>
        <span>·</span>
        <a
          href="#"
          onClick={handlePublishClick}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          Publicar
        </a>
      </div>
    </div>
  );
}