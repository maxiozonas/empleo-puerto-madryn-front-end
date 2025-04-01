"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { createService } from "@/lib/api/servicios"; // Asegúrate de que la ruta sea correcta
import { Loader2, Anchor, ArrowLeft, X } from "lucide-react";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import RteEditor from "@/components/ui/RteEditor";

const formSchema = z
  .object({
    titulo: z
      .string()
      .min(1, "El título es obligatorio")
      .max(150, "El título no puede superar los 150 caracteres")
      .trim()
      .refine((val) => val.length > 0 && val.trim().length > 0, {
        message: "El título no puede ser solo espacios",
      })
      .refine((val) => !/[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,-]/.test(val), {
        message: "El título no puede contener caracteres especiales raros",
      }),
    descripcion: z
      .string()
      .min(1, "La descripción es obligatoria")
      .max(5000, "La descripción no puede superar los 5000 caracteres")
      .trim()
      .refine((val) => val.length > 0 && val.trim().length > 0, {
        message: "La descripción no puede ser solo espacios",
      }),
    categoria: z.string().min(1, "Debes seleccionar una categoría"),
    formaContacto: z.enum(["MAIL", "PHONE"], {
      required_error: "Debes seleccionar una forma de contacto",
    }),
    contacto: z.string().min(1, "El contacto es obligatorio"),
    imagen: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: "El archivo no puede superar los 5MB",
      })
      .refine((file) => !file || ["image/png", "image/jpeg", "image/jpg"].includes(file.type), {
        message: "Solo se permiten imágenes en formato PNG, JPEG o JPG",
      }),
  })
  .refine(
    (data) => {
      if (data.formaContacto === "MAIL") {
        return z.string().email("Debes ingresar un email válido").safeParse(data.contacto).success;
      }
      if (data.formaContacto === "PHONE") {
        return /^\+?[1-9]\d{1,14}$/.test(data.contacto); // Validación básica de teléfono
      }
      return true;
    },
    {
      message: "Debes ingresar un contacto válido (email o teléfono según la forma seleccionada)",
      path: ["contacto"],
    }
  );

type FormData = z.infer<typeof formSchema>;

export default function PublicarServicioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: categorias, isLoading: categoriasLoading, error: categoriasError } = useCategorias();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  type CreateServiceData = {
    titulo: string;
    descripcion: string;
    usuarioId: string;
    categoriaId: string;
    formaContacto: string;
    contacto: string;
    imagen?: File | null;
  };

  const createServiceMutation = useMutation({
    mutationFn: ({ data, token }: { data: CreateServiceData; token: string }) => createService(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setSubmitSuccess(
        "¡Servicio enviado con éxito! Será publicado tras ser verificado por nuestro equipo. Recibirás un email de confirmación."
      );
      form.reset();
      setTimeout(() => router.push("/"), 6000);
    },
    onError: (err) => {
      setSubmitError(err instanceof Error ? err.message : "Error desconocido al crear el servicio");
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      categoria: "",
      formaContacto: "MAIL",
      contacto: "",
      imagen: undefined,
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
    try {
      const createData: CreateServiceData = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        usuarioId: session?.user?.id || "",
        categoriaId: data.categoria,
        formaContacto: data.formaContacto,
        contacto: data.contacto,
        imagen: data.imagen ?? null,
      };

      console.log("Create data:", createData);

      await createServiceMutation.mutateAsync({
        data: createData,
        token: session?.backendToken || "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/publicar");
  };

  return (
    <div className="container mx-auto py-6 px-4">
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
        <h1 className="text-3xl font-bold text-center text-primary">Publicar servicio</h1>
        <p className="text-center text-muted-foreground">
          Complete el formulario para ofrecer un servicio en Puerto Madryn
        </p>
      </header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-2xl mx-auto space-y-6 bg-gradient-to-b from-white to-secondary/10 p-6 rounded-lg border border-secondary/30 shadow-sm"
        >
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">Título del servicio</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ej: Clases de guitarra"
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
            name="imagen"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">Imagen del servicio (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                    }}
                    className="border-primary/20 cursor-pointer focus-visible:ring-primary"
                    {...field}
                  />
                </FormControl>
                {value && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{value.name}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive"
                      onClick={() => {
                        onChange(undefined);
                        const input = document.querySelector('input[name="imagen"]') as HTMLInputElement;
                        if (input) input.value = "";
                      }}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                )}
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
                  <RteEditor content={field.value} onChange={(val) => field.onChange(val)} />
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
            name="formaContacto"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-primary font-medium">Forma de contacto</FormLabel>
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
                        <RadioGroupItem value="PHONE" />
                      </FormControl>
                      <FormLabel className="font-normal">Teléfono</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contacto"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">
                  {form.watch("formaContacto") === "MAIL" ? "Email de contacto" : "Número de teléfono"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={form.watch("formaContacto") === "MAIL" ? "ej: contacto@servicio.com" : "ej: +542804123456"}
                    {...field}
                    className="border-primary/20 focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {submitSuccess && (
            <Alert variant="default" className="bg-green-600 text-white text-center text-bold">
              <AlertDescription className="text-center">{submitSuccess}</AlertDescription>
            </Alert>
          )}
          {submitError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
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
                Publicar servicio
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}