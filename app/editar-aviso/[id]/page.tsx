"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCategories } from "@/lib/hooks/useCategories";
import { useJobPostById } from "@/lib/hooks/useJobPostById";
import { useUpdateJobOffer } from "@/lib/hooks/useUpdateJobOffer";
import { Loader2, Ship } from "lucide-react";
import { useEffect, useState } from "react";

const formSchema = z
  .object({
    titulo: z.string().min(1, "El título es requerido").max(150, "Máximo 150 caracteres"),
    descripcion: z.string().min(1, "La descripción es requerida"),
    empresaConsultora: z.string().min(1, "La empresa es requerida").max(150, "Máximo 150 caracteres"),
    categoria: z.string().min(1, "La categoría es requerida"),
    formaPostulacion: z.enum(["MAIL", "LINK"], { required_error: "La forma de postulación es requerida" }),
    emailContacto: z.string().email("Formato de email inválido").optional().nullable(),
    linkPostulacion: z.string().url("Debe ser una URL válida").optional().nullable(),
    fechaCierre: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.formaPostulacion === "MAIL" && (!data.emailContacto || data.emailContacto.trim() === "")) {
        return false;
      }
      if (data.formaPostulacion === "LINK" && (!data.linkPostulacion || data.linkPostulacion.trim() === "")) {
        return false;
      }
      if (data.fechaCierre && new Date(data.fechaCierre) < new Date()) {
        return false;
      }
      return true;
    },
    {
      message: "Debe proporcionar email o link según la forma de postulación, y la fecha de cierre no puede ser pasada",
      path: ["formaPostulacion"],
    }
  );

type FormData = z.infer<typeof formSchema>;

export default function EditarAvisoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const { data: job, isLoading: jobLoading, error: jobError } = useJobPostById(id as string, session?.backendToken || "");
  const { data: categorias, isLoading: categoriasLoading, error: categoriasError } = useCategories();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      empresaConsultora: "",
      categoria: "",
      formaPostulacion: "MAIL",
      emailContacto: null,
      linkPostulacion: null,
      fechaCierre: null,
    },
  });

  useEffect(() => {
    if (job) {
      form.reset({
        titulo: job.titulo,
        descripcion: job.descripcion,
        empresaConsultora: job.empresaConsultora,
        categoria: job.categoria.id,
        formaPostulacion: job.formaPostulacion as "MAIL" | "LINK",
        emailContacto: job.formaPostulacion === "MAIL" ? job.contactoPostulacion : null,
        linkPostulacion: job.formaPostulacion === "LINK" ? job.contactoPostulacion : null,
        fechaCierre: job.fechaCierre ? new Date(job.fechaCierre).toISOString().split("T")[0] : null,
      });
    }
  }, [job, form]);

  if (status === "loading" || jobLoading || categoriasLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (jobError || categoriasError || !job) {
    return (
      <div className="text-center text-destructive py-8">
        <p>{jobError?.message || categoriasError?.message || "No se pudo cargar la oferta"}</p>
        <Button
          variant="outline"
          className="mt-4 border-primary text-primary hover:bg-primary/10"
          onClick={() => router.refresh()}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  if (!categorias || categorias.length === 0) {
    return <div className="text-center py-8">No hay categorías disponibles.</div>;
  }

  const onSubmit = async (data: FormData) => {
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      await useUpdateJobOffer(
        {
          id: id as string,
          titulo: data.titulo,
          descripcion: data.descripcion,
          usuarioId: session?.user.id ?? "",
          empresaConsultora: data.empresaConsultora,
          fechaCierre: data.fechaCierre ?? null,
          formaPostulacion: data.formaPostulacion,
          emailContacto: data.emailContacto ?? null,
          linkPostulacion: data.linkPostulacion ?? null,
          categoriaId: data.categoria,
        },
        session?.backendToken ?? "",
      )
      router.push("/mis-avisos")
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error desconocido al crear la oferta")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <header className="mb-8 space-y-4">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Ship className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-primary">Editar Aviso</h1>
        <p className="text-center text-accent">
          Modifique los campos que desee y guarde los cambios
        </p>
      </header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-gradient-to-b from-white to-secondary/10 p-6 rounded-lg border border-secondary/30 shadow-sm"
        >
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">Título del empleo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ej: Full Stack Developer Junior"
                    {...field}
                    className="border-primary/20 focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe los requisitos y responsabilidades del puesto"
                    className="min-h-[100px] border-primary/20 focus-visible:ring-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="empresaConsultora"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">Empresa</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ej: Globant"
                    {...field}
                    className="border-primary/20 focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">Categoría</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-primary/20 focus:ring-primary">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="formaPostulacion"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-primary font-medium">Forma de postulación</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="MAIL" />
                      </FormControl>
                      <FormLabel className="font-normal">Email</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="LINK" />
                      </FormControl>
                      <FormLabel className="font-normal">Link externo</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("formaPostulacion") === "MAIL" && (
            <FormField
              control={form.control}
              name="emailContacto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Email de contacto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="contacto@empresa.com"
                      {...field}
                      value={field.value ?? ""}
                      className="border-primary/20 focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {form.watch("formaPostulacion") === "LINK" && (
            <FormField
              control={form.control}
              name="linkPostulacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Link de postulación</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
                      {...field}
                      value={field.value ?? ""}
                      className="border-primary/20 focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="fechaCierre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">Fecha de cierre (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value ?? ""}
                    className="border-primary/20 focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {submitError && <p className="text-destructive text-center">{submitError}</p>}
          <Button type="submit" className="w-full bg-ocean-gradient hover:bg-primary/90" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Ship className="mr-2 h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}