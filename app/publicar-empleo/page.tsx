"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCategorias } from "@/hooks/useCategories";
import { createJobOffer } from "@/lib/api";
import { useState } from "react";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const formSchema = z.object({
  titulo: z.string().min(1, "El título es requerido").max(150, "Máximo 150 caracteres"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  empresaConsultora: z.string().min(1, "La empresa es requerida").max(150, "Máximo 150 caracteres"),
  categoria: z.string().min(1, "La categoría es requerida"),
  formaPostulacion: z.enum(["MAIL", "LINK"], { required_error: "La forma de postulación es requerida" }),
  emailContacto: z.string().email("Formato de email inválido").optional().nullable(),
  linkPostulacion: z.string().url("Debe ser una URL válida").optional().nullable(),
  fechaCierre: z.string().optional().nullable(),
}).refine(
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

export default function PublicarEmpleoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { categorias, error: categoriasError } = useCategorias();
  const [formError, setFormError] = useState<string | null>(null);

  useAuthCheck();

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


  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (categoriasError) {
    return <div className="text-center text-red-500">{categoriasError}</div>;
  }

  const onSubmit = async (data: FormData) => {
    setFormError(null);
    try {
      await createJobOffer(
        {
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
        session?.backendToken ?? ""
      );
      router.push("/");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      <header className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Publicar empleo</h1>
        <p className="text-muted-foreground">
          Complete el formulario para publicar una nueva oferta de empleo
        </p>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título del empleo</FormLabel>
                <FormControl>
                  <Input placeholder="ej: Full Stack Developer Junior" {...field} />
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
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe los requisitos y responsabilidades del puesto"
                    className="min-h-[100px]"
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
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="ej: Globant" {...field} />
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
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
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
                <FormLabel>Forma de postulación</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
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
                  <FormLabel>Email de contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="contacto@empresa.com" {...field} value={field.value ?? ""} />
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
                  <FormLabel>Link de postulación</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value ?? ""} />
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
                <FormLabel>Fecha de cierre (opcional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {formError && <p className="text-red-500 text-center">{formError}</p>}
          <Button type="submit" className="w-full">
            Publicar empleo
          </Button>
        </form>
      </Form>
    </div>
  );
}