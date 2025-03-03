"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building, Calendar, Clock, Briefcase, User, Mail, ExternalLink, Loader2 } from "lucide-react";
import { fetchJobPostById } from "@/lib/api/fetchJobPostById";
import { JobPosting } from "@/lib/types/iJobPosting";

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [job, setJob] = useState<JobPosting | null>(null); // Usamos JobPosting en lugar de any
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchJobPostById(id as string);
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };
    loadJob();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calculateDaysRemaining = (fechaCierre?: string) => {
    if (!fechaCierre) return null;
    const today = new Date();
    const cierre = new Date(fechaCierre);
    const diffTime = cierre.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : null;
  };

  const handleBack = () => {
    router.push("/ofertas-laborales");
  };

  const handleApply = () => {
    if (job?.contactoPostulacion) {
      if (job.formaPostulacion === "MAIL") {
        window.location.href = `mailto:${job.contactoPostulacion}`;
      } else if (job.formaPostulacion === "LINK") {
        window.open(job.contactoPostulacion, "_blank");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        <p>{error || "No se pudo cargar la oferta"}</p>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(job.fechaCierre);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Volver a empleos</span>
        </Button>

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {job.categoria.nombre}
              </span>
              {daysRemaining !== null && (
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    daysRemaining < 3 ? "bg-destructive/20 text-destructive" : "bg-secondary/20 text-secondary-foreground"
                  }`}
                >
                  {daysRemaining === 0 ? "Cierra hoy" : `${daysRemaining} días restantes`}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.titulo}</h1>
            <p className="text-white/90 text-lg">{job.empresaConsultora}</p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Job details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-border pb-8">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Empresa</h3>
                  <p className="text-muted-foreground">{job.empresaConsultora}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Fecha de publicación</h3>
                  <p className="text-muted-foreground">{formatDate(job.fechaPublicacion)}</p>
                </div>
              </div>

              {job.fechaCierre && (
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Fecha de cierre</h3>
                    <p className="text-muted-foreground">{formatDate(job.fechaCierre)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Categoría</h3>
                  <p className="text-muted-foreground">{job.categoria.nombre}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Publicado por</h3>
                  <p className="text-muted-foreground">{job.usuarioPublicador.email}</p>
                </div>
              </div>

              {job.contactoPostulacion && (
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Contacto</h3>
                    <p className="text-muted-foreground">{job.contactoPostulacion}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Job description */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-primary mb-4">Descripción del puesto</h2>
              <div className="prose text-foreground max-w-none">
                {job.descripcion.split("\n\n").map((paragraph: string, index: number) => (
                  <div key={index} className="mb-4">
                    {paragraph.includes(":") && paragraph.split(":")[0].trim().endsWith("s") ? (
                      <>
                        <h3 className="font-bold mb-2">{paragraph.split(":")[0]}</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {paragraph
                            .split(":")[1]
                            .split("\n- ")
                            .filter(Boolean)
                            .map((item: string, i: number) => (
                              <li key={i}>{item.trim()}</li>
                            ))}
                        </ul>
                      </>
                    ) : (
                      <p>{paragraph}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Application section */}
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
              <h2 className="text-xl font-bold text-primary mb-4">¿Cómo postular?</h2>
              <p className="mb-6">
                Para postularte a esta oferta laboral, haz clic en el botón de abajo.{" "}
                {job.contactoPostulacion &&
                  `También puedes contactar directamente a ${job.contactoPostulacion}.`}
              </p>
              <Button
                onClick={handleApply}
                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Postular ahora</span>
                <ExternalLink className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}