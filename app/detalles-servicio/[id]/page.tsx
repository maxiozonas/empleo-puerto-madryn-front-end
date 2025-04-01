"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ServicioUsuario } from "@/lib/types/iServicioUsuario"; // Asegúrate de que la ruta sea correcta
import { fetchServiceById } from "@/lib/api/servicios"; // Necesitarás crear esta función
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useAddFavorite, useRemoveFavorite, useIsFavorite } from "@/lib/hooks/useFavoritos";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Loader2,
  CheckCircle,
  Copy,
  MessageCircle,
  Facebook,
  ArrowRight,
  BookmarkPlus,
  Phone,
  User,
  Tag,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import style from '../../../components/contacto.module.css'; // Reutilizamos el mismo estilo

export default function ServiceDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [service, setService] = useState<ServicioUsuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { data: session, status } = useSession();
  const token = session?.backendToken || "";
  const userEmail = session?.user?.email || "";
  const isOwnPost = service?.usuarioOferente?.email === userEmail;
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
    const loadService = async () => {
      try {
        const data = await fetchServiceById(id as string); // Necesitarás implementar esta función
        setService(data);
        if (editor && data) {
          editor.commands.setContent(data.descripcion);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };
    loadService();
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
        { ofertaId: id as string, token }, // Ajusta si el campo para servicios es diferente (ej. servicioId)
        { onError: () => setOptimisticIsFavorite(isFavoriteFromServer) }
      );
    } else {
      removeFavoriteMutation.mutate(
        { ofertaId: id as string, token },
        { onError: () => setOptimisticIsFavorite(isFavoriteFromServer) }
      );
    }
  };

  const handleBack = () => router.push("/servicios"); 

  const handleContact = () => {
    if (service?.contacto) {
      if (service.formaContacto === "MAIL") {
        window.location.href = `mailto:${service.contacto}`;
      } else if (service.formaContacto === "PHONE") {
        window.location.href = `tel:${service.contacto}`;
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
      const text = encodeURIComponent(`${service?.titulo} - ${service?.usuarioOferente?.email}`);
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

  if (error || !service || !editor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        <p>{error || "No se pudo cargar el servicio"}</p>
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
                <h1 className="text-3xl font-bold mb-2">{service.titulo}</h1>
                <p className="text-lg text-white/90 mb-4">
                  Por {service.usuarioOferente.nombre || service.usuarioOferente.email}
                </p>
                <Badge className="bg-secondary text-secondary-foreground font-medium">
                  {service.categoria.nombre}
                </Badge>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                {service.imagenUrl ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${service.imagenUrl}`}
                    alt={service.titulo}
                    width={120}
                    height={120}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Descripción del servicio</h2>
            <div className="text-gray-700 whitespace-pre-line mb-8">
              <EditorContent editor={editor} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de publicación</p>
                  <p>Publicado {formatDate(service.fechaPublicacion)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Oferente</p>
                  <p>{service.usuarioOferente.nombre || service.usuarioOferente.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                {service.formaContacto === "MAIL" ? (
                  <Mail className="h-5 w-5 text-primary" />
                ) : (
                  <Phone className="h-5 w-5 text-primary" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Forma de contacto</p>
                  <p>{service.formaContacto === "MAIL" ? "Email" : "Teléfono"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Categoría</p>
                  <p>{service.categoria.nombre}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-primary mb-4">¿Cómo contactar?</h3>
              {service.formaContacto === "MAIL" ? (
                <div className="flex">
                  <p className="mb-4">Envía un correo al siguiente email:</p>
                  <p className="text-muted-foreground ml-2">{service.contacto}</p>
                </div>
              ) : (
                <div>
                  <p className="mb-4">Llama al siguiente número:</p>
                  <p className="text-muted-foreground">{service.contacto}</p>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm font-medium text-justify">
                  Por favor, al contactar al oferente, mencioná que encontraste el servicio en Empleo Puerto Madryn. Esto nos ayuda a que más personas publiquen sus servicios en el sitio, ¡muchas gracias!
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 text-justify">
                  Al buscar servicios, asegurate de verificar la identidad del oferente y protegé tu información personal. No realices pagos por adelantado sin confirmar la legitimidad del servicio.
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
                  Opciones disponibles para este servicio
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2"
                  onClick={handleContact}
                >
                  {service.formaContacto === "MAIL" ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
                  Contactar ahora
                </Button>

                {status === "authenticated" && !isOwnPost && (
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10 flex items-center gap-2"
                    onClick={handleToggleFavorite}
                    disabled={isFavoriteLoading || !token || addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                  >
                    <BookmarkPlus className="h-4 w-4" />
                    {isFavorite ? "Guardado" : "Guardar servicio"}
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