"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { useEffect, useState, useMemo } from "react";
import { Oferta } from "@/lib/types/iOferta";
import { useOfertas } from "@/lib/hooks/useOfertas";
import { useSession } from "next-auth/react";
import { enableOfertaAdmin, deleteOfertaAdmin } from "@/lib/api/ofertas";
import Image from "next/image";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: fetchedOfertas, isLoading } = useOfertas();
  const [filteredOfertas, setFilteredOfertas] = useState<Oferta[]>([]);

  useAuthCheck();

  const filteredOfertasMemo = useMemo(() => {
    const ofertasToFilter = fetchedOfertas || [];
    return ofertasToFilter.filter((oferta) => oferta.habilitado === false);
  }, [fetchedOfertas]);

  useEffect(() => {
    setFilteredOfertas(filteredOfertasMemo);
  }, [filteredOfertasMemo]);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "authenticated" && !process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").includes(session?.user.email as string)) {
    router.push("/");
     return null;
}

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  const handleBack = () => {
    router.push("/");
  };

  const handleHabilitar = async (data: Oferta) => {
    try {
      await enableOfertaAdmin(data.id, session?.backendToken as string);
      setFilteredOfertas((prev) => prev.filter((job) => job.id !== data.id));
    } catch (error) {
      console.error("Error al habilitar la oferta:", error);
    }
  };

  const handleRechazar = async (data: Oferta) => {
    try {
      await deleteOfertaAdmin(data.id, session?.backendToken as string);
      setFilteredOfertas((prev) => prev.filter((job) => job.id !== data.id));
    } catch (error) {
      console.error("Error al rechazar la oferta:", error);
    }
  };

  return (
    <section className="container mx-auto py-6 px-4 min-h-screen">
      <div className="flex items-center mb-6">
        <Button
          onClick={handleBack}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Volver</span>
        </Button>
      </div>
      <header className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-center text-primary">Avisos Pendientes de Habilitación</h1>
        <p className="text-center text-muted-foreground">
          Revisa y habilita las ofertas de empleo enviadas por los usuarios.
        </p>
      </header>
      <div className="mb-8">
        {filteredOfertas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOfertas.map((oferta) => (
              <OfertaCard
                key={oferta.id}
                oferta={oferta}
                onHabilitar={() => handleHabilitar(oferta)}
                onRechazar={() => handleRechazar(oferta)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 bg-gray-100 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No hay avisos pendientes para habilitar.</p>
          </div>
        )}
      </div>
    </section>
  );
}


function OfertaCard({ oferta, onHabilitar, onRechazar}: { oferta: Oferta; onHabilitar: () => void; onRechazar: () => void }) {
  const [imageSrc, setImageSrc] = useState<string | null>(
    oferta.logoUrl ? `${process.env.NEXT_PUBLIC_API_URL}${oferta.logoUrl}` : null
  );
  
  const handleImageError = () => {
    console.log(`Error al cargar la imagen para el trabajo ${oferta.id}: ${imageSrc}`);
    setImageSrc("/placeholder-logo.png");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {imageSrc && (
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image
            src={imageSrc}
            alt={`${oferta.empresaConsultora} logo`}
            fill
            className="object-contain rounded-md"
            onError={handleImageError}
          />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{oferta.titulo}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{oferta.descripcion}</p>
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Empresa:</span> {oferta.empresaConsultora}
        </p>
        <p>
          <span className="font-medium">Publicador:</span> {oferta.usuarioPublicador.email}
        </p>
        <p>
          <span className="font-medium">Categoría:</span> {oferta.categoria.nombre}
        </p>
        <p>
          <span className="font-medium">Fecha de publicación:</span>{" "}
          {new Date(oferta.fechaPublicacion).toLocaleDateString()}
        </p>
        {oferta.fechaCierre && (
          <p>
            <span className="font-medium">Fecha de cierre:</span>{" "}
            {new Date(oferta.fechaCierre).toLocaleDateString()}
          </p>
        )}
        <p>
          <span className="font-medium">Forma de postulación:</span> {oferta.formaPostulacion}
        </p>
        {oferta.contactoPostulacion && (
          <p>
            <span className="font-medium">Contacto:</span>{" "}
            {oferta.formaPostulacion === "MAIL" ? (
              <a href={`mailto:${oferta.contactoPostulacion}`} className="text-blue-500 hover:underline">
                {oferta.contactoPostulacion}
              </a>
            ) : (
              <a
                href={oferta.contactoPostulacion}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {oferta.contactoPostulacion}
              </a>
            )}
          </p>
        )}
      </div>
      <Button
        onClick={onHabilitar}
        className="mt-4 w-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
      >
        Habilitar
      </Button>
      <Button
        onClick={onRechazar}
        className="mt-2 w-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
      >
        Rechazar
      </Button>
    </div>
  );
}