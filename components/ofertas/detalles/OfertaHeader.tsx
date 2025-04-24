"use client"

import Image from "next/image";
import { Oferta } from "@/lib/types/iOferta";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
import { useState } from "react";

interface OfertaHeaderProps {
  oferta: Oferta;
}

const DEFAULT_LOGO_URL = "https://example.com/default-logo.png";

const getLogoUrl = (logoUrl: string | null | undefined): string | null => {
  if (!logoUrl || logoUrl === DEFAULT_LOGO_URL) {
    return null;
  }
  const isExternalUrl = logoUrl.startsWith("http://") || logoUrl.startsWith("https://");
  return isExternalUrl ? logoUrl : `${process.env.NEXT_PUBLIC_API_URL}${logoUrl}`;
};

export default function OfertaHeader({ oferta }: OfertaHeaderProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="bg-ocean-gradient rounded-lg p-6 mb-6 shadow-md text-white">
      <div className="flex flex-col space-y-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2 text-center md:text-start">
          <h1 className="text-sm md:text-xl md:text-start font-bold uppercase">{oferta.titulo}</h1>
          <div className="flex justify-between md:flex-col">
            <p className="text-xs uppercase md:text-base text-white/90 font-medium">{oferta.empresaConsultora}</p>
            <div className="inline-flex md:mt-2">
              <Badge className="bg-white hover:bg-primary hover:text-white text-primary text-xs md:text-base font-medium">
                {oferta.categoria.nombre}
              </Badge>
            </div>
          </div>
        </div>
        <div className="p-3 bg-white/20 rounded-full self-center md:self-start hidden md:block">
          {logoError || !getLogoUrl(oferta.logoUrl) ? (
            <Building className="h-8 w-8 md:h-10 md:w-10" />
          ) : (
            <Image
              src={getLogoUrl(oferta.logoUrl) as string}
              alt={oferta.empresaConsultora}
              width={80}
              height={80}
              className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover"
              onError={() => setLogoError(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}