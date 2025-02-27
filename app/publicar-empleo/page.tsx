"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

type FormData = {
  titulo: string;
  descripcion: string;
  empresaConsultora: string;
  categoria: string;
  formaPostulacion: string;
  emailContacto: string;
  linkPostulacion: string;
  fechaCierre: string;
};

export default function PublicarEmpleoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormData>({
    defaultValues: {
      titulo: "",
      descripcion: "",
      empresaConsultora: "",
      categoria: "",
      formaPostulacion: "MAIL",
      emailContacto: "",
      linkPostulacion: "",
      fechaCierre: "",
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    console.log("Session data:", session);

    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/categorias", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }
        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("No se pudieron cargar las categorías");
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, [status, router, session]);

  if (status === "loading" || loading) {
    return <div>Cargando...</div>;
  }

  const onSubmit = async (data: FormData) => {
    setError(null);
    if (!session || !session.user.id) {
      setError("Usuario no autenticado o ID no disponible");
      return;
    }

    
    const fechaCierreISO = data.fechaCierre ? new Date(`${data.fechaCierre}T23:59:59`).toISOString() : null;

    const requestBody = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      usuario: { id: session.user.id },
      empresaConsultora: data.empresaConsultora,
      fechaPublicacion: new Date().toISOString(),
      fechaCierre: fechaCierreISO, 
      formaPostulacion: data.formaPostulacion,
      emailContacto: data.formaPostulacion === "MAIL" ? data.emailContacto : null,
      linkPostulacion: data.formaPostulacion === "LINK" ? data.linkPostulacion : null,
      categoria: { id: data.categoria },
    };
    console.log("onSubmit triggered with data:", JSON.stringify(requestBody, null, 2));
    try {
      const response = await fetch("http://localhost:8080/api/ofertas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.backendToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      console.log("Submission successful, redirecting to /");
      router.push("/");
    } catch (err) {
      console.error("Error submitting job:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Publicar empleo</h1>
        <p className="text-muted-foreground">
          Complete el formulario para publicar una nueva oferta de empleo
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    className="min-h-[200px]"
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    defaultValue={field.value}
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
                    <Input placeholder="contacto@empresa.com" {...field} />
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
                    <Input placeholder="https://..." {...field} />
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
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-[#00BA88] hover:bg-[#00A67A]"
          >
            Publicar empleo
          </Button>
        </form>
      </Form>
    </div>
  );
}