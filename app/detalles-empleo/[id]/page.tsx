"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { JobPosting } from "@/lib/types/iJobPosting";
import { fetchJobPostById } from "@/lib/api/ofertas";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useAddFavorite, useRemoveFavorite, useIsFavorite } from "@/lib/hooks/useFavoritos";
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
  BookmarkPlus,
  Briefcase,
  Link as LinkIcon,
  Building,
  MapPin
} from "lucide-react";
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
  const { data: session, status } = useSession();
  const token = session?.backendToken || "";
  const userEmail = session?.user?.email || "";
  const isOwnPost = job?.usuarioPublicador?.email === userEmail;
  const { data: isFavoriteFromServer, isLoading: isFavoriteLoading } = useIsFavorite(id as string, token);
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();
  const [optimisticIsFavorite, setOptimisticIsFavorite] = useState<boolean | undefined>(undefined);
  const isFavorite = optimisticIsFavorite !== undefined ? optimisticIsFavorite : isFavoriteFromServer;

  const editor = useEditor({
    extensions: [StarterKit, Underline.configure()],
    editorProps: { attributes: { class: style.editorContent } },
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

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavoriteLoading || !token || isOwnPost) return;

    const newFavoriteState = !isFavorite;
    setOptimisticIsFavorite(newFavoriteState);

    if (newFavoriteState) {
      addFavoriteMutation.mutate(
        { ofertaId: id as string, token },
        { onError: () => setOptimisticIsFavorite(isFavoriteFromServer) }
      );
    } else {
      removeFavoriteMutation.mutate(
        { ofertaId: id as string, token },
        { onError: () => setOptimisticIsFavorite(isFavoriteFromServer) }
      );
    }
  };

  const handleBack = () => router.push("/avisos");

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
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button
          onClick={handleBack}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Volver</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-ocean-gradient rounded-lg p-8 mb-6 shadow-md text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{job.titulo}</h1>
                <p className="text-lg text-white/90 mb-4">{job.empresaConsultora}</p>
                <Badge className="bg-secondary text-secondary-foreground font-medium">
                  {job.categoria.nombre}
                </Badge>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                {job.logoUrl ? (
                  <Image src={`${process.env.NEXT_PUBLIC_API_URL}${job.logoUrl}`} alt={job.empresaConsultora} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <Building className="h-10 w-10" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Descripción del empleo</h2>
            <div className="text-gray-700 whitespace-pre-line mb-8">
              <EditorContent editor={editor} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de publicación</p>
                  <p>Publicado {formatDate(job.fechaPublicacion)}</p>
                </div>
              </div>

              {job.fechaCierre && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha de cierre</p>
                    <p>Cierra {formatDate(job.fechaCierre)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-700">
                <Briefcase className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Empresa</p>
                  <p>{job.empresaConsultora}</p>
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
                {job.formaPostulacion === "MAIL" ? (
                  <Mail className="h-5 w-5 text-primary" />
                ) : (
                  <LinkIcon className="h-5 w-5 text-primary" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Forma de postulación</p>
                  <p>{job.formaPostulacion === "MAIL" ? "Email" : "Link externo"}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-primary mb-4">¿Cómo aplicar?</h3>
              {job.formaPostulacion === "MAIL" ? (
                <div className="flex">
                  <p className="mb-4">Envía tu CV al siguiente correo electrónico:</p>
                  <p className="text-muted-foreground ml-2">{job.contactoPostulacion}</p>
                </div>
              ) : (
                <div>
                  <p className="mb-4">Postúlate a través del siguiente enlace:</p>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    asChild
                  >
                    <a href={job.contactoPostulacion || "#"} target="_blank" rel="noopener noreferrer">
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
        </div>

        <div className="lg:block">
          <div className="sticky top-20">
            <Card className="mb-6 shadow-md">
              <CardHeader className="bg-heritage-gradient text-white rounded-t-lg">
                <CardTitle className="text-xl">Acciones Rápidas</CardTitle>
                <CardDescription className="text-white/90">
                  Opciones disponibles para este empleo
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2"
                  onClick={handleApply}
                >
                  {job.formaPostulacion === "MAIL" ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  Postularme ahora
                </Button>

                {status === "authenticated" && !isOwnPost && (
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10 flex items-center gap-2"
                    onClick={handleToggleFavorite}
                    disabled={isFavoriteLoading || !token || addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                  >
                    <BookmarkPlus className="h-4 w-4" />
                    {isFavorite ? "Guardado" : "Guardar empleo"}
                  </Button>
                )}

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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}