"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobPosting } from "@/lib/types/iJobPosting";
import { Heart, MapPin, Calendar, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import { useAddFavorite, useRemoveFavorite, useIsFavorite } from "@/lib/hooks/useFavoritos";
import Image from "next/image";
import logo from "@/public/lib/logo.jpeg";

interface JobCardProps {
  job: JobPosting;
  showEditOptions?: boolean;
  onEdit?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
}

export function JobCard({ job, showEditOptions = false, onEdit, onDelete }: JobCardProps) {
  const { data: session, status } = useSession();
  const token = session?.backendToken || "";
  const userEmail = session?.user?.email || "";
  const isOwnPost = job.usuarioPublicador?.email === userEmail;
  const { data: isFavorite, isLoading: isFavoriteLoading } = useIsFavorite(job.id, token);
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const calculateDaysAgo = (date: string) => {
    const publicationDate = new Date(date);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - publicationDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    if (differenceInDays === -1) return "Publicado hoy";
    return differenceInDays === 0 ? "Publicado hoy" : `Publicado hace ${differenceInDays} días`;
  };

  const daysAgo = calculateDaysAgo(job.fechaPublicacion);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavoriteLoading || !token || isOwnPost) return;

    if (isFavorite) {
      removeFavoriteMutation.mutate({ ofertaId: job.id, token });
    } else {
      addFavoriteMutation.mutate({ ofertaId: job.id, token });
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (onEdit) onEdit(job.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete) onDelete(job.id);
  };

  const canShowFavoriteButton = status === "authenticated" && !isOwnPost;

  return (
    <Link href={`/detalles-empleo/${job.id}`} passHref>
      <Card
        className={cn(
          "group relative flex flex-col overflow-hidden transition-all duration-300",
          "hover:shadow-xl hover:-translate-y-2 hover:bg-primary/5 border-secondary/30",
          "bg-gradient-to-b from-white to-secondary/10 min-w-[280px]"
        )}
      >
        {canShowFavoriteButton && (
          <div className="absolute top-2 right-2 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className={cn(
                      "transition-transform group-hover:scale-110",
                      isFavorite ? "text-accent" : "text-gray-500"
                    )}
                    onClick={handleToggleFavorite}
                    disabled={isFavoriteLoading || !token || addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-all duration-200 ease-in-out",
                        isFavorite ? "fill-accent stroke-accent hover:bg-accent scale-110" : "stroke-current hover:accent hover:scale-110"
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

        <CardHeader className="pb-2 pt-6">
          <div className="flex justify-between items-center gap-2 mb-1">
            <Image
              src={job.logoUrl ? `${process.env.NEXT_PUBLIC_API_URL}${job.logoUrl}` : logo}
              alt={job.empresaConsultora || "Logo de la empresa"}
              width={60}
              height={60}
              className="rounded-full object-contain"
            />
            <Badge
              className="bg-primary text-white border-primary font-semibold px-3 py-1 rounded-md"
            >
              {job.categoria.nombre}
            </Badge>
          </div>
          <CardTitle className="line-clamp-1 md:text-xl text-md mt-3 font-bold group-hover:text-primary transition-colors">
            {job.titulo}
          </CardTitle>
          <p className="text-muted-foreground font-medium text-sm">{job.empresaConsultora}</p>
        </CardHeader>

        <CardContent className="space-y-4 flex-grow pb-6">
          <div className="flex justify-between gap-4 text-sm">
            <div className="flex items-center gap-1.5 bg-gray-100 py-1 rounded-full">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="text-neutral-800 font-medium line-clamp-1">Puerto Madryn</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-100 py-1 rounded-full">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span className="text-neutral-800 font-medium line-clamp-1">{daysAgo}</span>
            </div>
          </div>
        </CardContent>

        {showEditOptions && (
          <div className="flex justify-between p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditClick}
              className="flex hover:bg-primary/90 hover:text-white items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClick}
              className="flex items-center gap-2 text-destructive border-destructive/30 hover:bg-destructive min-w-[100px]"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        )}
      </Card>
    </Link>
  );
}