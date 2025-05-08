"use client";

import { useParams } from "next/navigation";
import { useCategorias, useCategoriaImages } from "@/lib/hooks/useCategorias";
import VolverButton from "@/components/ui/volver";
import Link from "next/link"; 
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useAuthCheck } from "@/lib/hooks/useAuthCheck";
import { useRouter } from "next/navigation"; 
import { useEffect } from "react";

export default function CategoryPage() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const { data: categories } = useCategorias();
  const { data: images } = useCategoriaImages(id as string, session?.backendToken as string);
  const router = useRouter();

  useAuthCheck();

  useEffect(() => {
    console.log("Session status:", status);
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

  const categoryName = categories?.find((cat) => cat.id === id)?.nombre || "Categoría";

  return (
    <div className="container min-h-screen mx-auto py-6 px-4">
      <VolverButton />
      <Button
        variant="outline"
        className="absolute right-8 border-primary text-primary hover:text-primary hover:bg-primary/10 border-2 border-primary/30 rounded-md transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
        onClick={() => router.push(`/admin/imagenes/${id}/agregar`)}
      >
        Agregar imagen
      </Button>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary text-center mb-2 uppercase">{categoryName}</h1>
        <p className="text-muted-foreground text-center mb-2">Imágenes de {categoryName}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images?.map((imagen, index) => (
            <Link key={index} href={`${imagen}`}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full hover:bg-gray-100 transition-colors">
                {imagen}
              </CardContent>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}