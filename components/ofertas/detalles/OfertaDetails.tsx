import { Oferta } from "@/lib/types/iOferta";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Briefcase, MapPin, Mail, Link as LinkIcon } from "lucide-react";

interface OfertaDetailsProps {
  oferta: Oferta;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function OfertaDetails({ oferta }: OfertaDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-gray-500">Fecha de publicación</p>
            <p>Publicado {formatDate(oferta.fechaPublicacion)}</p>
          </div>
        </div>

        {oferta.fechaCierre && (
          <div className="flex items-center gap-3 text-gray-700">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de cierre</p>
              <p>Cierra {formatDate(oferta.fechaCierre)}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 text-gray-700">
          <Briefcase className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-gray-500">Empresa</p>
            <p>{oferta.empresaConsultora}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-gray-500">Ubicación</p>
            <p>Puerto Madryn</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          {oferta.formaPostulacion === "MAIL" ? (
            <Mail className="h-5 w-5 text-primary" />
          ) : (
            <LinkIcon className="h-5 w-5 text-primary" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-500">Forma de postulación</p>
            <p>{oferta.formaPostulacion === "MAIL" ? "Email" : "Link externo"}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg md:text-xl font-bold text-primary mb-4">¿Cómo aplicar?</h3>
        {oferta.formaPostulacion === "MAIL" ? (
          <div className="flex">
            <p className="text-gray-700 text-sm md:text-base">
              Envía tu CV a: <span className="text-primary">{oferta.contactoPostulacion}</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <p className="text-gray-700">Postúlate a través del siguiente enlace:</p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto"
              asChild
            >
              <a href={oferta.contactoPostulacion || "#"} target="_blank" rel="noopener noreferrer">
                <LinkIcon className="mr-2 h-4 w-4" />
                Aplicar en sitio externo
              </a>
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm font-medium text-justify">
            Por favor, al momento de postularte indicá que encontraste el aviso en Empleo Puerto Madryn. Esto nos
            ayuda a conseguir que más empleadores publiquen en el sitio, ¡muchas gracias!
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-justify">
            Al buscar empleo NUNCA vas a necesitar pagar para postularte o acceder a una oferta, en todo momento
            realizá si es posible una investigación previa del empleador y protegé tu información personal. No
            descargues archivos sospechosos ni te reúnas en lugares o sitios de desconfianza.
          </p>
        </div>
      </div>
    </div>
  );
}