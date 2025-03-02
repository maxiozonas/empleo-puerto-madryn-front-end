"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { UserNav } from "./user-nav";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();

  const handlePublicarEmpleo = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/publicar-empleo");
    }
  };


  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
          EmpleosPuertoMadryn
        </Link>

        {/* Versión Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Button className="bg-primary hover:bg-primary/90" onClick={handlePublicarEmpleo}>
            Publicar empleo
          </Button>
          <UserNav isAuthenticated={isAuthenticated} />
        </div>

        {/* Versión Mobile */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Menú</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-8">
              <Button
                className="bg-primary hover:bg-primary/90 w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  handlePublicarEmpleo();
                }}
              >
                Publicar empleo
              </Button>

              {!isAuthenticated ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsMenuOpen(false);
                    signIn("google", { callbackUrl: "/" });
                  }}
                >
                  Iniciar sesión
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/mis-publicaciones">Mis Publicaciones</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/favoritos">Mis Favoritos</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                  >
                    Cerrar sesión
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}