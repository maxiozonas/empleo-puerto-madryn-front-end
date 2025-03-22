"use client"; // Asegúrate de que sea un componente del lado del cliente

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Footer() {
  const router = useRouter();

  const icons = {
    instagram: "/icons/instagram.svg",
    facebook: "/icons/facebook.svg",
  };

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
      <div className="mb-4 md:mb-0 flex">
        <h2 className="bg-clip-text text-transparent bg-ocean-gradient mr-4">
          Empleos Madryn
        </h2>
        <a
          href="https://www.instagram.com/madrynempleos"
          target="_blank"
          rel="noopener noreferrer"
        >
            <Image
                src={icons.instagram}
                alt="Instagram Madryn Empleos"
                width={24}
                height={24}
                className="h-5 w-5 mr-3"
            />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=61574532959697&locale=es_LA"
          target="_blank"
          rel="noopener noreferrer"
        >
            <Image
                src={icons.facebook}
                alt="Facebook Madryn Empleos"
                width={24}
                height={24}
                className="h-5 w-5"
            />
        </a>
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
      </div>
    </div>
  );
}