"use client";

import { useEffect, useState, useMemo } from "react";
import { ServiceCard } from "./ServiceCard";
import { ServicioUsuario } from "@/lib/types/iServicioUsuario";
import { Loader2, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServices } from "@/lib/hooks/useServicios";

interface ServiceListProps {
    searchTerm: string;
    selectedCategory: string;
    services?: ServicioUsuario[];
    showEditOptions?: boolean;
    onEdit?: (serviceId: string) => void;
    onDelete?: (serviceId: string) => void;
}

export function ServiceList({
    searchTerm,
    selectedCategory,
    services: externalServices,
    showEditOptions = false,
    onEdit,
    onDelete,
}: ServiceListProps) {
    const { data: fetchedServices, isLoading, error, refetch } = useServices();
    const [filteredServices, setFilteredServices] = useState<ServicioUsuario[]>([]);

    const allServices = useMemo(() => externalServices || fetchedServices || [], [externalServices, fetchedServices]);

    useEffect(() => {
        const applyFilters = () => {
            let result = [...allServices];

            result = result.filter((service) => service.habilitado === true);

            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase().trim();
                result = result.filter(
                    (service) =>
                        service.titulo.toLowerCase().includes(term) ||
                        service.descripcion.toLowerCase().includes(term) ||
                        service.usuarioOferente.email.toLowerCase().includes(term) ||
                        (service.usuarioOferente.nombre && service.usuarioOferente.nombre.toLowerCase().includes(term))
                );
            }

            if (selectedCategory !== "all") {
                result = result.filter((service) => service.categoria.id === selectedCategory);
            }

            setFilteredServices(result);
        };

        applyFilters();
    }, [searchTerm, selectedCategory, allServices]);

    if (isLoading && !externalServices) {
        return (
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-muted-foreground">Cargando servicios...</p>
            </div>
        );
    }

    if (error && !externalServices) {
        return (
            <div className="text-center text-destructive">
                <p>{error.message}</p>
                <Button
                    variant="outline"
                    className="mt-4 border-primary text-primary hover:bg-primary/10"
                    onClick={() => refetch()}
                >
                    Reintentar
                </Button>
            </div>
        );
    }

    if (allServices.length === 0 || !allServices.some(service => service.habilitado === true)) {
        return (
            <div className="text-center py-8 px-4 bg-secondary/20 rounded-lg border border-secondary">
                <Anchor className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-foreground">Aún no hay servicios publicados.</p>
            </div>
        );
    }

    if (!filteredServices.length) {
        return (
            <div className="text-center py-8 px-4 bg-secondary/20 rounded-lg border border-secondary">
                <Anchor className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-foreground">No hay servicios disponibles con los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                    showEditOptions={showEditOptions}
                    onEdit={() => onEdit?.(service.id)}
                    onDelete={() => onDelete?.(service.id)}
                />
            ))}
        </div>
    );
}