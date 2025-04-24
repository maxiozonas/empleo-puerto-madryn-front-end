import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Oferta } from "@/lib/types/iOferta";
import { useAddFavorito, useRemoveFavorito, useIsFavoritos } from "@/lib/hooks/useFavoritos";
import {
  ArrowRight,
  BookmarkPlus,
  CheckCircle,
  Copy,
  MessageCircle,
  Facebook,
  Mail,
} from "lucide-react";

interface OfertaActionsProps {
  oferta: Oferta;
  isOwnPost: boolean;
  token: string;
  status: "loading" | "authenticated" | "unauthenticated";
  onApply: () => void;
}

export default function OfertaActions({ oferta, isOwnPost, token, status, onApply }: OfertaActionsProps) {
  const [copied, setCopied] = useState(false);
  const { data: isFavoriteFromServer, isLoading: isFavoriteLoading } = useIsFavoritos(oferta.id, token);
  const addFavoriteMutation = useAddFavorito();
  const removeFavoriteMutation = useRemoveFavorito();
  const [optimisticIsFavorite, setOptimisticIsFavorite] = useState<boolean | undefined>(undefined);
  const isFavorite = optimisticIsFavorite !== undefined ? optimisticIsFavorite : isFavoriteFromServer;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavoriteLoading || !token || isOwnPost) return;

    const newFavoriteState = !isFavorite;
    setOptimisticIsFavorite(newFavoriteState);

    if (newFavoriteState) {
      addFavoriteMutation.mutate(
        { ofertaId: oferta.id, token },
        { onError: () => setOptimisticIsFavorite(isFavoriteFromServer) }
      );
    } else {
      removeFavoriteMutation.mutate(
        { ofertaId: oferta.id, token },
        { onError: () => setOptimisticIsFavorite(isFavoriteFromServer) }
      );
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
      const text = encodeURIComponent(`${oferta.titulo} - ${oferta.empresaConsultora}`);
      window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
    }
  };

  const shareOnFacebook = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    }
  };

  return (
    <>
      <Card className="mb-6 shadow-md md:hidden">
        <CardHeader className="bg-heritage-gradient text-white rounded-t-lg">
          <CardTitle className="text-xl">Acciones Rápidas</CardTitle>
          <CardDescription className="text-white/90">
            Opciones disponibles para este empleo
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Button
            className="bg-ocean-gradient w-full text-white font-semibold py-2 px-6 rounded-md transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
            onClick={onApply}
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

      <div className="hidden lg:block">
        <Card className="mb-6 shadow-md">
          <CardHeader className="bg-heritage-gradient text-white rounded-t-lg">
            <CardTitle className="text-xl">Acciones Rápidas</CardTitle>
            <CardDescription className="text-white/90">
              Opciones disponibles para este empleo
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Button
              className="bg-ocean-gradient w-full text-white font-semibold py-2 px-6 rounded-md transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
              onClick={onApply}
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
    </>
  );
}