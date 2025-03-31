"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobPosting } from "@/lib/types/iJobPosting";
import { MapPin, Calendar, Edit, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "@/public/lib/logo.jpeg";
import { Separator } from "../ui/separator";

interface JobCardProps {
  job: JobPosting;
  showEditOptions?: boolean;
  onEdit?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
}

export function JobCard({ job, showEditOptions = false, onEdit, onDelete }: JobCardProps) {

  const calculateDaysAgo = (date: string) => {
    const publicationDate = new Date(date);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - publicationDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays <= 0 ? "Publicado hoy" : `Publicado hace ${differenceInDays} días`;
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onEdit) onEdit(job.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete) onDelete(job.id);
  };

  return (
    <Link href={`/detalles-empleo/${job.id}`} passHref>
      <Card
        className={cn(
          "group relative flex flex-col overflow-hidden transition-all duration-300",
          "hover:shadow-xl hover:-translate-y-2 hover:bg-primary/5 border-secondary/30",
          "bg-gradient-to-b from-white to-secondary/10 min-w-[280px]"
        )}
      >
        <CardHeader className="pb-2 pt-5">
          <div className="flex justify-between items-center gap-2 mb-1">
            <Image
              src={job.logoUrl ? `${process.env.NEXT_PUBLIC_API_URL}${job.logoUrl}` : logo}
              alt={job.empresaConsultora || "Logo de la empresa"}
              width={60}
              height={60}
              className="rounded-full h-12 w-12 object-cover"
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
          <Separator className="border border-accent" />
        </CardHeader>

        <CardContent className="space-y-4 flex-grow pb-6 mt-2">
          <div className="flex justify-between gap-4 text-sm">
            <div className="flex items-center gap-1.5 bg-secondary/30 py-1 px-2 rounded-full">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="text-neutral-800 font-medium line-clamp-1">Puerto Madryn</span>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary/30 py-1 px-2 rounded-full">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span className="text-neutral-800 font-medium line-clamp-1">{calculateDaysAgo(job.fechaPublicacion)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="w-full flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              className="flex hover:bg-primary/90 hover:text-white items-center gap-2 w-full"
            >
              <ArrowRight className="h-4 w-4" />
              Ver detalles
            </Button>
          </div>
        </CardFooter>

        {showEditOptions && (
          <div className="flex justify-between items-center gap-2 px-4 pb-2">
            <Button
              variant="outline"
              size="lg"
              onClick={handleEditClick}
              className="flex hover:bg-primary/90 hover:text-white items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDeleteClick}
              className="flex items-center gap-2 text-destructive border-destructive/30 hover:bg-destructive"
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