"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobPosting } from "@/lib/types/iJobPosting";
import { Heart, MapPin, Calendar, ArrowRight, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import { useAddFavorite, useRemoveFavorite, useIsFavorite } from "@/lib/hooks/useFavoritos";

interface JobCardProps {
  job: JobPosting;
  showEditOptions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function JobCard({ job, showEditOptions = false, onEdit, onDelete }: JobCardProps) {
  const { data: session, status } = useSession();
  const token = session?.backendToken || "";
  const userEmail = session?.user?.email || "";
  const isOwnPost = job.usuarioPublicador?.email === userEmail;
  const { data: isFavorite, isLoading: isFavoriteLoading } = useIsFavorite(job.id, token);
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const formattedDate = new Date(job.fechaPublicacion).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleToggleFavorite = () => {
    if (isFavoriteLoading || !token || isOwnPost) return;

    if (isFavorite) {
      removeFavoriteMutation.mutate({ ofertaId: job.id, token });
    } else {
      addFavoriteMutation.mutate({ ofertaId: job.id, token });
    }
  };

  const canShowFavoriteButton = status === "authenticated" && !isOwnPost;

  return (
    <Card className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-secondary/30 bg-gradient-to-b from-white to-secondary/10 min-w-[280px]">
      {canShowFavoriteButton && (
        <div className="absolute top-3 right-3 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className={cn(
                    "bg-background/80 backdrop-blur-sm transition-transform group-hover:scale-110",
                    isFavorite ? "text-accent" : "text-gray-500"
                  )}
                  onClick={handleToggleFavorite}
                  disabled={isFavoriteLoading || !token || addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-all duration-200 ease-in-out",
                      isFavorite ? "fill-accent stroke-accent scale-110" : "stroke-current hover:stroke-accent hover:scale-110"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {showEditOptions && (
        <div className="absolute top-3 right-3 z-10 md:hidden">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onEdit}
                  className="mr-2 bg-background/80 backdrop-blur-sm hover:bg-primary/10"
                >
                  <Edit className="h-5 w-5 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onDelete}
                  className="bg-background/80 backdrop-blur-sm hover:bg-destructive/10"
                >
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Eliminar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <CardHeader className="pb-2 pt-6">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {job.categoria.nombre}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 mt-3 group-hover:text-primary transition-colors">{job.titulo}</CardTitle>
        <p className="text-muted-foreground font-medium">{job.empresaConsultora}</p>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow pb-6">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span className="text-neutral-800 font-medium">Puerto Madryn</span>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full">
            <Calendar className="h-3.5 w-3.5 text-accent" />
            <span className="text-neutral-800 font-medium">{formattedDate}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground line-clamp-3">{job.descripcion}</p>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex gap-2 md:flex-row md:justify-between">
        <Button
          asChild
          className="flex-1 group/button transition-all bg-ocean-gradient hover:bg-primary/90"
          variant="default"
        >
          <Link href={`/detalles-empleo/${job.id}`} className="flex items-center justify-center">
            <span>Ver detalles</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
          </Link>
        </Button>
        {showEditOptions && (
          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-2 ">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="flex items-center gap-2 text-destructive border-destructive/30 hover:bg-red-500 hover:text-neutral-800 min-w-[100px]"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}