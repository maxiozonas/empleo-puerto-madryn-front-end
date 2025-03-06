"use client"

import type { JobPosting } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { CalendarDays, Building2, Mail, LinkIcon, MapPin, Briefcase, Share2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {fetchJobById} from "@/lib/data";

export default function JobDetailsPage() {
    const [job, setJob] = useState<JobPosting>()
    const router = useRouter()
    const {data: session, status} = useSession()
    const params = useParams()
    const id = params.id

    const fetchJob = async () => {
        const Job = await fetchJobById(session, id)
        setJob(Job)
    }

    useEffect( () => {
        console.log(session)
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }else 
            fetchJob().then(r => r)
        console.log(id)
    }, [fetchJob, id, router, status])

    const formattedDate = new Date(job.fechaPublicacion).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const handleShare = async () => {
        try {
            await navigator.share({
                title: job.titulo,
                text: `Oferta de trabajo: ${job.titulo} en ${job.empresaConsultora}`,
                url: window.location.href,
            })
        } catch (error) {
            console.log("Error sharing:", error)
        }
    }

    return (
        <div className="mx-auto max-w-3xl py-8">
            <div className="space-y-6">
                <Card>
                    <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-3xl">{job.titulo}</CardTitle>
                            </div>
                            <div className="flex gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={handleShare}>
                                                <Share2 className="h-5 w-5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Compartir empleo</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <span>{job.empresaConsultora}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>Puerto Madryn</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                <span>Publicado el {formattedDate}</span>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Descripción */}
                <Card>
                    <CardHeader>
                        <CardTitle>Descripción del puesto</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-gray max-w-none">
                        {job.descripcion}
                    </CardContent>
                </Card>

                {/* Información de la empresa */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sobre la empresa</CardTitle>
                        <CardDescription>Publicado por {job.empresaConsultora}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                            <span>Múltiples vacantes disponibles</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>¿Cómo postularse?</CardTitle>
                        <CardDescription>
                            {job.formaPostulacion === "EMAIL" ? "Envía tu CV por email" : "Postúlate a través del sitio web"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {job.formaPostulacion === "EMAIL" && job.contactoPostulacion && (
                            <Button asChild className="w-full">
                                <Link href={`mailto:${job.contactoPostulacion}`}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Postular por email
                                </Link>
                            </Button>
                        )}
                        {job.formaPostulacion === "LINK" && job.empresaConsultora && (
                            <Button asChild className="w-full">
                                <Link href={job.empresaConsultora} target="_blank" rel="noopener noreferrer">
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    Ir al sitio de postulación
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}