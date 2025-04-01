"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { useEffect, useState, useMemo } from "react";
import { JobPosting } from "@/lib/types/iJobPosting";
import { ServicioUsuario } from "@/lib/types/iServicioUsuario"; // Asegúrate de que la ruta sea correcta
import { useJobPosts } from "@/lib/hooks/useOfertas";
import { useServices } from "@/lib/hooks/useServicios"; // Asegúrate de que la ruta sea correcta
import { useSession } from "next-auth/react";
import { enableJobOfferAdmin, deleteJobOfferAdmin } from "@/lib/api/ofertas";
import { enableServiceAdmin, deleteServiceAdmin } from "@/lib/api/servicios"; // Asegúrate de que la ruta sea correcta
import Image from "next/image";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: fetchedJobs, isLoading: jobsLoading } = useJobPosts();
  const { data: fetchedServices, isLoading: servicesLoading } = useServices();
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServicioUsuario[]>([]);

  useAuthCheck();

  // Filtrar ofertas de empleo pendientes
  const filteredJobsMemo = useMemo(() => {
    const jobsToFilter = fetchedJobs || [];
    return jobsToFilter.filter((job) => job.habilitado === false);
  }, [fetchedJobs]);

  // Filtrar servicios pendientes
  const filteredServicesMemo = useMemo(() => {
    const servicesToFilter = fetchedServices || [];
    return servicesToFilter.filter((service) => service.habilitado === false);
  }, [fetchedServices]);

  useEffect(() => {
    setFilteredJobs(filteredJobsMemo);
    setFilteredServices(filteredServicesMemo);
  }, [filteredJobsMemo, filteredServicesMemo]);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (
    status === "authenticated" &&
    !process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").includes(session?.user.email as string)
  ) {
    router.push("/");
    return null;
  }

  if (status === "loading" || jobsLoading || servicesLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  const handleBack = () => {
    router.push("/");
  };

  const handleHabilitarOferta = async (data: JobPosting) => {
    try {
      await enableJobOfferAdmin(data.id, session?.backendToken as string);
      setFilteredJobs((prev) => prev.filter((job) => job.id !== data.id));
    } catch (error) {
      console.error("Error al habilitar la oferta:", error);
    }
  };

  const handleRechazarOferta = async (data: JobPosting) => {
    try {
      await deleteJobOfferAdmin(data.id, session?.backendToken as string);
      setFilteredJobs((prev) => prev.filter((job) => job.id !== data.id));
    } catch (error) {
      console.error("Error al rechazar la oferta:", error);
    }
  };

  const handleHabilitarServicio = async (data: ServicioUsuario) => {
    try {
      await enableServiceAdmin(data.id, session?.backendToken as string);
      setFilteredServices((prev) => prev.filter((service) => service.id !== data.id));
    } catch (error) {
      console.error("Error al habilitar el servicio:", error);
    }
  };

  const handleRechazarServicio = async (data: ServicioUsuario) => {
    try {
      await deleteServiceAdmin(data.id, session?.backendToken as string);
      setFilteredServices((prev) => prev.filter((service) => service.id !== data.id));
    } catch (error) {
      console.error("Error al rechazar el servicio:", error);
    }
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
      <header className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-center text-primary">Panel de Administración</h1>
        <p className="text-center text-muted-foreground">
          Revisa y habilita las ofertas de empleo y servicios enviados por los usuarios.
        </p>
      </header>

      {/* Sección de Ofertas de Empleo */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-primary mb-4">Ofertas de Empleo Pendientes</h2>
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onHabilitar={() => handleHabilitarOferta(job)}
                onRechazar={() => handleRechazarOferta(job)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 bg-gray-100 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No hay ofertas de empleo pendientes para habilitar.</p>
          </div>
        )}
      </div>

      {/* Sección de Servicios */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-primary mb-4">Servicios Pendientes</h2>
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onHabilitar={() => handleHabilitarServicio(service)}
                onRechazar={() => handleRechazarServicio(service)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 bg-gray-100 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No hay servicios pendientes para habilitar.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function JobCard({ job, onHabilitar, onRechazar }: { job: JobPosting; onHabilitar: () => void; onRechazar: () => void }) {
  const [imageSrc, setImageSrc] = useState<string | null>(
    job.logoUrl ? `${process.env.NEXT_PUBLIC_API_URL}${job.logoUrl}` : null
  );

  const handleImageError = () => {
    console.log(`Error al cargar la imagen para el trabajo ${job.id}: ${imageSrc}`);
    setImageSrc("/placeholder-logo.png");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {imageSrc && (
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image
            src={imageSrc}
            alt={`${job.empresaConsultora} logo`}
            fill
            className="object-contain rounded-md"
            onError={handleImageError}
          />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{job.titulo}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{job.descripcion}</p>
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Empresa:</span> {job.empresaConsultora}
        </p>
        <p>
          <span className="font-medium">Publicador:</span> {job.usuarioPublicador.email}
        </p>
        <p>
          <span className="font-medium">Categoría:</span> {job.categoria.nombre}
        </p>
        <p>
          <span className="font-medium">Fecha de publicación:</span>{" "}
          {new Date(job.fechaPublicacion).toLocaleDateString()}
        </p>
        {job.fechaCierre && (
          <p>
            <span className="font-medium">Fecha de cierre:</span>{" "}
            {new Date(job.fechaCierre).toLocaleDateString()}
          </p>
        )}
        <p>
          <span className="font-medium">Forma de postulación:</span> {job.formaPostulacion}
        </p>
        {job.contactoPostulacion && (
          <p>
            <span className="font-medium">Contacto:</span>{" "}
            {job.formaPostulacion === "MAIL" ? (
              <a href={`mailto:${job.contactoPostulacion}`} className="text-blue-500 hover:underline">
                {job.contactoPostulacion}
              </a>
            ) : (
              <a
                href={job.contactoPostulacion}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {job.contactoPostulacion}
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

function ServiceCard({
  service,
  onHabilitar,
  onRechazar,
}: {
  service: ServicioUsuario;
  onHabilitar: () => void;
  onRechazar: () => void;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(
    service.imagenUrl ? `${process.env.NEXT_PUBLIC_API_URL}${service.imagenUrl}` : null
  );

  const handleImageError = () => {
    console.log(`Error al cargar la imagen para el servicio ${service.id}: ${imageSrc}`);
    setImageSrc("/placeholder-logo.png");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {imageSrc && (
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image
            src={imageSrc}
            alt={`${service.titulo} imagen`}
            fill
            className="object-contain rounded-md"
            onError={handleImageError}
          />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{service.titulo}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{service.descripcion}</p>
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Oferente:</span>{" "}
          {service.usuarioOferente.nombre || service.usuarioOferente.email}
        </p>
        <p>
          <span className="font-medium">Categoría:</span> {service.categoria.nombre}
        </p>
        <p>
          <span className="font-medium">Fecha de publicación:</span>{" "}
          {new Date(service.fechaPublicacion).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Forma de contacto:</span> {service.formaContacto}
        </p>
        <p>
          <span className="font-medium">Contacto:</span>{" "}
          {service.formaContacto === "MAIL" ? (
            <a href={`mailto:${service.contacto}`} className="text-blue-500 hover:underline">
              {service.contacto}
            </a>
          ) : (
            <a href={`tel:${service.contacto}`} className="text-blue-500 hover:underline">
              {service.contacto}
            </a>
          )}
        </p>
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