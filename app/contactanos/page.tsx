"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Anchor, ArrowLeft } from "lucide-react";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createMessage } from "@/lib/api/contactar";

const formSchema = z
  .object({
    nombre: z.string()
      .min(1, { message: "El nombre es obligatorio" })
      .max(30, { message: "El nombre no puede superar los 30 caracteres" })
      .trim()
      .refine((val) => val.length > 0 && val.trim().length > 0, {
        message: "El nombre no puede ser solo espacios",
      })
      .refine((val) => !/[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,-]/.test(val), {
        message: "El nombre no puede contener caracteres especiales raros",
      }),
    apellido: z.string()
      .min(1, { message: "El apellido es obligatorio" })
      .max(30, { message: "El apellido no puede superar los 30 caracteres" })
      .trim()
      .refine((val) => val.length > 0 && val.trim().length > 0, {
        message: "El apellido no puede ser solo espacios",
      })
      .refine((val) => !/[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,-]/.test(val), {
        message: "El apellido no puede contener caracteres especiales raros",
      }),
    email: z.string()
      .email({ message: "Email inválido" })
      .min(1, { message: "El email es obligatorio" })
      .max(50, { message: "El email no puede superar los 50 caracteres" }),
    mensaje: z.string()
      .min(1, { message: "El mensaje es obligatorio" })
      .max(5000, { message: "El mensaje no puede superar los 5000 caracteres" })
      .trim()
      .refine((val) => val.length > 0 && val.trim().length > 0, {
        message: "El mensaje no puede ser solo espacios",
      }),
  });

type FormData = z.infer<typeof formSchema>;

export default function ContactUs() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  type CreateMessageData = {
    nombre: string;
    apellido: string;
    email: string;
    mensaje: string;
  }

  const createMessageMutation = useMutation({
    mutationFn: (data: CreateMessageData) => createMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
      setSubmitSuccess("¡Mensaje enviado con éxito!");
      setTimeout(() => router.push("/"), 2000);
    },
    onError: (err) => {
      setSubmitError(err instanceof Error ? err.message : "Error desconocido al enviar el mensaje");
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      mensaje: "",
    },
  });

  useAuthCheck();

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);
    try {
      const createData: CreateMessageData = {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        mensaje: data.mensaje,
      };

      await createMessageMutation.mutateAsync(createData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <section className="container mx-auto py-6 px-4">
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
          <h1 className="text-3xl font-bold text-center text-primary">Contactanos</h1>
          <p className="text-center text-muted-foreground line-clamp-3">
            Estamos aquí para ayudarte. Si tienes alguna duda, inconveniente o una idea para mejorar nuestra plataforma, ¡no dudes en escribirnos!
          </p>
        </header>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-2xl mx-auto space-y-6 bg-gradient-to-b from-white to-secondary/10 p-6 rounded-lg border border-secondary/30 shadow-sm"
          >
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ej: Pedro"
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
              name="apellido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Apellido</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ej: Pérez"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="contacto@ejemplo.com"
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
              name="mensaje"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Mensaje</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el mensaje que quieras enviarnos"
                      className="min-h-[100px] border-primary/20 focus-visible:ring-primary"
                      {...field}
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
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Anchor className="mr-2 h-4 w-4" />
                  Enviar
                </>
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-8 text-center text-muted-foreground text-[0.8rem]">
          <p>
            Sino, puedes contactarnos a través de nuestro correo electrónico:
          </p>
          <p className="font-bold">
            empleospuertomadryn@gmail.com
          </p>
        </div>
    </section>
  );
}