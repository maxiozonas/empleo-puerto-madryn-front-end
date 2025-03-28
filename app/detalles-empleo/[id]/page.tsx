"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Loader2,
  CheckCircle,
  Copy,
  MessageCircle,
  Facebook,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { JobPosting } from "@/lib/types/iJobPosting";
import { fetchJobPostById } from "@/lib/api/ofertas";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit"; 
import Underline from "@tiptap/extension-underline";
import style from '../../../components/contacto.module.css';

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline.configure(), 
    ],
    editorProps: {
      attributes: {
          class: style.editorContent,
      },
  },
    content: "", 
    editable: false, 
    immediatelyRender: false,
  });

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchJobPostById(id as string);
        setJob(data);
        if (editor && data) {
          editor.commands.setContent(data.descripcion);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };
    loadJob();
  }, [id, editor]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleBack = () => {
    router.push("/avisos");
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

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`${job?.titulo} - ${job?.empresaConsultora}`);
      window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
    }
  };

  const shareOnFacebook = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !job || !editor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        <p>{error || "No se pudo cargar la oferta"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center mb-6">
          <Button
            onClick={handleBack}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Volver</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h1 className="md:text-3xl text-xl font-bold mb-2 text-justify">{job.titulo}</h1>

            <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline" className="bg-primary text-white border-primary font-semibold px-3 py-1 rounded-md">
                {job.categoria.nombre}
              </Badge>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Descripción del puesto</h2>
              <div className="bg-background md:p-4 p-0 text-muted-foreground text-justify">                
                <EditorContent editor={editor} />
              </div>
              {job.formaPostulacion === "MAIL" && job.contactoPostulacion && (
                <p className="text-muted-foreground mt-4">
                  Enviar CV a: <span className="font-bold">{job.contactoPostulacion}</span>
                </p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <div>
                  <p className="text-amber-800 text-sm font-medium text-justify">
                    Por favor, al momento de postularte indicá que encontraste el aviso en Empleo Puerto Madryn. Esto nos
                    ayuda a conseguir que más empleadores publiquen en el sitio, ¡muchas gracias!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 text-justify">
                Al buscar empleo NUNCA vas a necesitar pagar para postularte o acceder a una oferta, en todo momento
                realizá si es posible una investigación previa del empleador y protegé tu información personal. No
                descargues archivos sospechosos ni te reúnas en lugares o sitios de desconfianza.
              </p>
            </div>
          </div>

          <div className="md:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold">{job.empresaConsultora}</h3>
                    <div className="flex items-center justify-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Verificado</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleApply}
                    className="w-full mb-6 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300"
                  >
                    <span>Aplicar ahora</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                  </Button>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Publicado el</h4>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(job.fechaPublicacion)}</span>
                      </div>
                    </div>

                    {job.fechaCierre && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Finaliza el</h4>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(job.fechaCierre)}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Forma postulación</h4>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{job.formaPostulacion === "MAIL" ? "Correo electrónico" : "Enlace externo"}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Compartir</h4>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-9 w-9"
                                onClick={copyToClipboard}
                              >
                                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copiar enlace</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-9 w-9"
                                onClick={shareOnWhatsApp}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Compartir por WhatsApp</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-9 w-9"
                                onClick={shareOnFacebook}
                              >
                                <Facebook className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Compartir en Facebook</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}