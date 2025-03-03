"use client";

import { useJobPosts } from "@/lib/hooks/useJobPosts";
import { Anchor, Fish, Compass, Building, Factory, Coffee } from "lucide-react";

export function CategoriesSection() {
  const { data: jobs, isLoading, error } = useJobPosts();

  const predefinedCategories = [
    { icon: <Anchor className="h-6 w-6" />, name: "Turismo", id: "ce1778d7-e298-462d-96f3-42dcbb06772f" },
    { icon: <Fish className="h-6 w-6" />, name: "Pesca", id: "ce73250e-bb3a-429e-beb0-1f58825dad5f" },
    { icon: <Factory className="h-6 w-6" />, name: "Industria", id: "910d5ff8-680a-458a-a621-354d17cb9508" },
    { icon: <Building className="h-6 w-6" />, name: "Comercio", id: "e319c73d-0b81-4c01-b437-d49aa11767ff" },
    { icon: <Compass className="h-6 w-6" />, name: "Servicios", id: "02d48eac-f6b8-4a27-b03a-4adacadec4ff" },
    { icon: <Coffee className="h-6 w-6" />, name: "Gastronomía", id: "2bec0f16-cb9e-4ebf-9c39-a2caf469ce97" },
  ];

  if (isLoading || error || !jobs) return null;

  const categoryCounts = predefinedCategories.map((category) => {
    const count = jobs.filter((job) => job.categoria.id === category.id).length;
    return { ...category, count };
  });

  return (
    <section className="container mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-primary mb-2">Sectores Principales</h2>
        <p className="text-muted-foreground">Explora oportunidades en los sectores económicos de Puerto Madryn</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categoryCounts.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col items-center text-center border border-secondary/20 hover:border-secondary"
          >
            <div className="bg-primary/10 p-3 rounded-full mb-3">{category.icon}</div>
            <h3 className="font-medium text-foreground">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.count} empleos</p>
          </div>
        ))}
      </div>
    </section>
  );
}