"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function FooterSection() {
  const router = useRouter();

  const icons = {
    instagram: "/icons/instagram.svg",
    facebook: "/icons/facebook.svg",
    cafecito: "/icons/cafecito.png",
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
  
  return (
    <div className="border-t mt-6 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
      <div className="mb-4 md:mb-0 flex">
        <h2 className="bg-clip-text text-primary mr-2 uppercase text-lg">
          Madryn Empleos
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
                className="h-6 w-6 mr-3"
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
                className="h-6 w-6 mr-3"
            />
        </a>        
      </div>
      <div className="mb-4 md:mb-0 flex">
          <a
              href="https://cafecito.app/madrynempleos"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                  src={icons.cafecito}
                  alt="Cafecito Madryn Empleos"
                  width={516} 
                  height={516}
                  className="h-8 w-full"
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
