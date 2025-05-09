"use client";

import { useParams } from "next/navigation";
import { useCategorias, useCategoriaImages, useDeleteImage, useCreateImage } from "@/lib/hooks/useCategorias";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, LucideCross } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogPortal, DialogOverlay } from "@radix-ui/react-dialog";

export default function CategoryPage() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const { data: categories, isLoading: CategoriasLoading } = useCategorias();
  const { data: images, isLoading: CategoriaImagesLoading } = useCategoriaImages(id as string, session?.backendToken as string);
  const categoria = categories?.find((cat) => cat.id === id);
  const deleteMutation = useDeleteImage();
  const createMutation = useCreateImage();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useAuthCheck();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (
    status === "authenticated" &&
    !process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").includes(session?.user.email as string)
  ) {
    router.push("/");
    return null;
  }

  const handleDeleteImage = (imageUrl: string) => {
    deleteMutation.mutate(
      {categoriaId: id as string, imageUrl: imageUrl, token: session?.backendToken as string },
      {
        onError: (err) => {
          console.error("Error al eliminar:", err);
          alert(err instanceof Error ? err.message : "Error desconocido al eliminar la imagen");
        },
      }
    );
  };

  const handleCreateImage = (imageUrl: string) => {
    createMutation.mutate(
      {categoriaId: id as string, imageUrl: imageUrl, token: session?.backendToken as string },
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const imageUrl = formData.get("imageUrl") as string;
    handleCreateImage(imageUrl);
  }

  const handleCancel = () => {
    setOpen(false);
  }


  if (CategoriasLoading || CategoriaImagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  const handleBack = () => {
    router.push("/admin/imagenes");
  }

  return (
    <section className="container min-h-screen mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
            <Button
                onClick={handleBack}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Volver</span>
            </Button>
        </div>
      <div className=" mb-10 flex flex-col items-center justify-center text-center">   
        <h1 className="text-3xl font-bold text-primary text-center mb-2">Imágenes para la categoría</h1>
        <p className="text-muted-foreground text-2xl font-semibold text-center mb-2">{categoria?.nombre}</p>
          
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="text-center border-primary text-primary hover:text-primary hover:bg-primary/10 border-2 border-primary/30 rounded-md transition-all duration-300 hover:shadow-lg hover:scale-105 transform max-w-44 mb-4"
            >
              Agregar imagen
            </Button>
          </DialogTrigger>

          <DialogPortal>
            <DialogOverlay className="fixed inset-0 bg-black/30 z-50" />
            <DialogContent className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-sm -translate-x-1/2 -translate-y-1/2 gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg">
              <DialogTitle className="text-center text-lg font-bold mb-2">Agregar Imagen</DialogTitle>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="URL de la imagen"
                  required
                  className="border rounded-md px-3 py-2"
                />
                <Button type="submit" className=" border-primary text-primary hover:text-primary hover:bg-primary/10 border-2 border-primary/30 rounded-md">
                  Agregar
                </Button>
                <Button type="button" onClick={handleCancel} className="absolute top-0 right-2 text-red-600 hover:text-primary">
                  <LucideCross className="mr-2" />
                </Button>
              </form>
            </DialogContent>
          </DialogPortal>
        </Dialog>
           
      </div>
    
      <div className="text-center mb-10">
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images?.map((imagen, index) => (
            <Card
            key={index}
            className={cn(
            "group relative flex flex-col overflow-hidden transition-all duration-300",
            "hover:shadow-xl hover:-translate-y-2 hover:bg-primary/5 border-secondary/30",
            "bg-gradient-to-b from-white to-secondary/10 min-w-[280px]"
            )}
          >
              <a href={`${imagen}`} target="_blank" rel="noopener noreferrer">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full hover:bg-gray-100 transition-colors">
                  <div className="flex mb-2 rounded-full p-3 group-hover:text-primary items-end justify-end">
                    <button className=" bg-red-500 text-white rounded-full p-1 w-8 h-8 mr-2 absolute right-0"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteImage(imagen); 
                      }}
                    >
                      <LucideCross />
                    </button>                    
                  </div>
                  {imagen}
                </CardContent>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}