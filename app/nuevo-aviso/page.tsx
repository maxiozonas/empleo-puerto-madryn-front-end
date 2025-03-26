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
import { useCategorias } from "@/lib/hooks/useCategorias";
import { createJobOffer } from "@/lib/api/ofertas";
import { Loader2, Anchor, ArrowLeft } from "lucide-react";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RteEditor from "@/components/ui/RteEditor";

const formSchema = z
  .object({
    titulo: z.string()
      .min(1, "El título es obligatorio")
      .max(150, "El título no puede superar los 150 caracteres")
      .trim()
      .refine((val) => val.length > 0 && val.trim().length > 0, {
        message: "El título no puede ser solo espacios",
      })
      .refine((val) => !/[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,-]/.test(val), {
        message: "El título no puede contener caracteres especiales raros",
      }),
    descripcion: z.string()
      .min(1, "La descripción es obligatoria")
      .max(5000, "La descripción no puede superar los 5000 caracteres")
      .trim()
      .refine((val) => val.length > 0 && val.trim().length > 0, {
        message: "La descripción no puede ser solo espacios",
      }),
    empresaConsultora: z.string()
      .min(1, "El nombre de la empresa es obligatorio")
      .max(150, "El nombre de la empresa no puede superar los 150 caracteres")
      .trim()
      .refine((val) => val.length > 0 && val.trim().length > 0, {
        message: "La empresa no puede ser solo espacios",
      })
      .refine((val) => !/[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,-]/.test(val), {
        message: "La empresa no puede contener caracteres especiales raros",
      }),
    categoria: z.string()
      .min(1, "Debes seleccionar una categoría"),
    formaPostulacion: z.enum(["MAIL", "LINK"], {
      required_error: "Debes seleccionar una forma de postulación",
    }),
    emailContacto: z.string()
      .email("Debes ingresar un email válido")
      .optional()
      .nullable(),
    linkPostulacion: z.string()
      .url("Debes ingresar una URL válida (ej: https://example.com)")
      .trim()
      .refine((val) => !val || (val.length > 0 && val.trim().length > 0), {
        message: "El link no puede ser solo espacios",
      })
      .optional()
      .nullable(),
    fechaCierre: z.string()
      .optional()
      .nullable(), 
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
      message: "Debes ingresar un email válido para postulación por email, una URL válida para postulación por enlace, y la fecha de cierre no puede ser anterior a hoy",
      path: ["formaPostulacion"],
    }
  );

type FormData = z.infer<typeof formSchema>;

export default function PublicarEmpleoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: categorias, isLoading: categoriasLoading, error: categoriasError } = useCategorias();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  type CreateJobOfferData = {
    titulo: string;
    descripcion: string;
    usuarioId: string;
    empresaConsultora: string;
    fechaCierre: string | null;
    formaPostulacion: string;
    emailContacto: string | null;
    linkPostulacion: string | null;
    categoriaId: string;
  };

  const createJobOfferMutation = useMutation({
    mutationFn: ({ data, token }: { data: CreateJobOfferData; token: string }) => createJobOffer(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
      setSubmitSuccess("¡Oferta publicada con éxito!");
      setTimeout(() => router.push("/"), 2000);
    },
    onError: (err) => {
      setSubmitError(err instanceof Error ? err.message : "Error desconocido al crear la oferta");
    },
  });

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

  useAuthCheck();

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading" || categoriasLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (categoriasError) {
    return (
      <div className="text-center text-destructive py-8">
        <p>{categoriasError.message}</p>
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
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);
    console.log("Form data:", data);
    try {
      console.log("Session data:", session);
      console.log("User ID:", session?.user?.id);
      
      const createData: CreateJobOfferData = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        usuarioId: session?.user?.id || "",
        empresaConsultora: data.empresaConsultora,
        fechaCierre: data.fechaCierre ? new Date(data.fechaCierre).toISOString() : null,
        formaPostulacion: data.formaPostulacion,
        emailContacto: data.formaPostulacion === "MAIL" ? data.emailContacto ?? null : null,
        linkPostulacion: data.formaPostulacion === "LINK" ? data.linkPostulacion ?? null : null,
        categoriaId: data.categoria,
      };

      console.log("Create data:", createData);

      await createJobOfferMutation.mutateAsync({
        data: createData,
        token: session?.backendToken || "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl py-6 px-4">
      <div className="flex items-center mb-6">
        <Button
          onClick={handleBack}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Volver</span>
        </Button>
      </div>
      <header className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-center text-primary">Publicar empleo</h1>
        <p className="text-center text-muted-foreground">
          Complete el formulario para publicar una nueva oferta de empleo en Puerto Madryn
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
                  <RteEditor
                      content={field.value}
                      onChange={(val) => field.onChange(val)}
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
          {submitSuccess && (
            <Alert variant="default" className="border-green-500 text-green-700">
              <AlertDescription>{submitSuccess}</AlertDescription>
            </Alert>
          )}
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Anchor className="mr-2 h-4 w-4" />
                Publicar empleo
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}