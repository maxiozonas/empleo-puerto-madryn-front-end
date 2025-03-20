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
import { Loader2, Anchor, ArrowLeft } from "lucide-react";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createMessage } from "@/lib/api/contactar";

const formSchema = z
  .object({
    titulo: z.string().nonempty("Debes ingresar un nombre"),
    empresaConsultora: z.string().nonempty("Debes ingresar un apellido"),
    emailContacto: z.string().email("Debes ingresar un email válido"),
    descripcion: z.string().nonempty("Debes ingresar un mensaje"),
  })
  .refine((data) => data.descripcion.length <= 500, {
    message: "El mensaje no puede superar los 500 caracteres",}
  );

type FormData = z.infer<typeof formSchema>;

export default function ContactUs() {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  type CreateMessageData = {
    name: string;
    lastName: string;
    email: string;
    message: string;
  };

  const createMessageMutation = useMutation({
    mutationFn: ({ data, token }: { data: CreateMessageData; token: string }) => createMessage(data, token),
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
      
    },
  });

  useAuthCheck();

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);
    console.log("Form data:", data);
    try {
      console.log("Session data:", session);
      console.log("User ID:", session?.user?.id);
      
      const createData: CreateMessageData = {
        name: data.titulo,
        lastName: data.empresaConsultora,
        email: data.emailContacto,
        message: data.descripcion,
      };

      console.log("Create data:", createData);

      await createMessageMutation.mutateAsync({
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
        <h1 className="text-3xl font-bold text-center text-primary">Contactanos</h1>
        <p className="text-center text-muted-foreground">
        Estamos aquí para ayudarte. Si tienes alguna duda, inconveniente o una idea para mejorar nuestra plataforma, ¡no dudes en escribirnos! Tu opinión es muy importante para nosotros.
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
            name="empresaConsultora"
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
              name="emailContacto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="contacto@ejemplo.com"
                      {...field}
                      value={field.value ?? ""}
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
          <Button type="submit" className="w-full bg-ocean-gradient hover:bg-primary/90" disabled={isSubmitting}>
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
    </div>
  );
}