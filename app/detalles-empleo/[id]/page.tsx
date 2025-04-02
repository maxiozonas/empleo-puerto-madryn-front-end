"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Oferta } from "@/lib/types/iOferta";
import { fetchOfertaById } from "@/lib/api/ofertas";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useAddFavorito, useRemoveFavorito, useIsFavoritos } from "@/lib/hooks/useFavoritos";
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
  MapPin,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useDropzone } from "react-dropzone";
import style from '../../../components/contacto.module.css';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function OfertaDetallePage() {
  const router = useRouter();
  const { id } = useParams();
  const [oferta, setOferta] = useState<Oferta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Nuevo estado para la alerta de éxito
  const { data: session, status } = useSession();
  const token = session?.backendToken || "";
  const userEmail = session?.user?.email || "";
  const isOwnPost = oferta?.usuarioPublicador?.email === userEmail;
  const { data: isFavoriteFromServer, isLoading: isFavoriteLoading } = useIsFavoritos(id as string, token);
  const addFavoriteMutation = useAddFavorito();
  const removeFavoriteMutation = useRemoveFavorito();
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
    const CargarOferta = async () => {
      try {
        const data = await fetchOfertaById(id as string);
        setOferta(data);
        if (editor && data) {
          editor.commands.setContent(data.descripcion);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };
    CargarOferta();
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
    if (oferta?.formaPostulacion === "MAIL") {
      setShowApplyModal(true);
    } else if (oferta?.formaPostulacion === "LINK" && oferta.contactoPostulacion) {
      window.open(oferta.contactoPostulacion, "_blank");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"], "application/msword": [".doc"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
  });

  const handleSubmitApplication = async () => {
    if (!selectedFile || !userEmail || !oferta?.id) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("applicantEmail", userEmail);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/apply/${oferta.id}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setShowSuccessAlert(true);
      setShowApplyModal(false);
      setSelectedFile(null);
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Intenta de nuevo";
      alert("Error al enviar la postulación: " + errorMessage);
    } finally {
      setIsSubmitting(false);
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
      const text = encodeURIComponent(`${oferta?.titulo} - ${oferta?.empresaConsultora}`);
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
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Cargando</p>
      </div>
    );
  }

  if (error || !oferta || !editor) {
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
          <div className="bg-ocean-gradient rounded-lg p-6 mb-6 shadow-md text-white">
            <div className="flex flex-col space-y-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2 text-center md:text-start">
                <h1 className="text-2xl md:text-3xl font-bold">{oferta.titulo}</h1>
                <div className="flex justify-between md:flex-col">
                  <p className="text-base md:text-lg text-white/90">{oferta.empresaConsultora}</p>
                  <Badge className="w-28 bg-secondary text-white text-md font-medium md:mt-2">
                    {oferta.categoria.nombre}
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full self-center md:self-start hidden md:block">
                {oferta.logoUrl ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${oferta.logoUrl}`}
                    alt={oferta.empresaConsultora}
                    width={80}
                    height={80}
                    className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover"
                  />
                ) : (
                  <Building className="h-8 w-8 md:h-10 md:w-10" />
                )}
              </div>
            </div>
          </div>

          <Card className="mb-6 shadow-md md:hidden">
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
                {oferta.formaPostulacion === "MAIL" ? (
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

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">Descripción del empleo</h2>
            <div className="text-gray-700 whitespace-pre-line mb-8">
              <EditorContent editor={editor} />
            </div>

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
                <div className="flex flex-col space-y-2">
                  <p className="text-gray-700">Envía tu CV a:</p>
                  <p className="text-primary font-medium break-all">{oferta.contactoPostulacion}</p>
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
        </div>

        <div className="hidden lg:block">
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
                  {oferta.formaPostulacion === "MAIL" ? (
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

      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <CardHeader>
              <CardTitle>Subir currículum</CardTitle>
              <CardDescription>
                Arrastra y suelta tu CV en formato .pdf o .doc (máximo 5MB). Recibirás una confirmación por correo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed p-6 rounded-lg text-center ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
                  }`}
              >
                <input {...getInputProps()} />
                {selectedFile ? (
                  <p>{selectedFile.name}</p>
                ) : isDragActive ? (
                  <p>Suelta el archivo aquí...</p>
                ) : (
                  <p>Arrastra tu CV aquí o haz clic para seleccionarlo</p>
                )}
                <Upload className="h-8 w-8 mx-auto mt-2 text-gray-500" />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowApplyModal(false);
                    setSelectedFile(null);
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmitApplication}
                  disabled={!selectedFile || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Enviar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showSuccessAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <Alert
            variant="default"
            className="bg-green-50 border-green-400 text-green-800 shadow-lg max-w-md w-full mx-4 p-6 text-center rounded-lg"
          >
            <CheckCircle2 className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">¡Postulación enviada!</AlertTitle>
            <AlertDescription className="mt-1">
              Tu CV se ha enviado con éxito. Revisa tu correo para una confirmación.
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full text-"
              onClick={() => setShowSuccessAlert(false)}
            >
              Cerrar
            </Button>
          </Alert>
        </div>
      )}
    </div>
  );
}