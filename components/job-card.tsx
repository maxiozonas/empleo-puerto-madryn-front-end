// empleo-puerto-madryn-front-end/components/job-card.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { JobPosting } from "@/lib/types"
import { Heart, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface JobCardProps {
  job: JobPosting;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  showEditOptions?: boolean;
}

export function JobCard({ job, onToggleFavorite, isFavorite = false, showEditOptions = false }: JobCardProps) {
  const formattedDate = new Date(job.fechaPublicacion).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="group relative flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex justify-end mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={onToggleFavorite}
                >
                  <Heart className={cn("h-5 w-5", isFavorite && "fill-primary stroke-primary")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{job.titulo}</CardTitle>
        <p className="text-muted-foreground">{job.empresaConsultora}</p>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Puerto Madryn</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
        <Badge variant="secondary" className="bg-secondary/50">
          {job.categoria.nombre}
        </Badge>
        <p className="text-sm text-muted-foreground line-clamp-2">{job.descripcion}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90">
          <Link href={`/empleos/${job.id}`}>Ver detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}