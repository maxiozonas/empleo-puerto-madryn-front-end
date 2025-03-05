"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Anchor, Ship } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserNav } from "./user-nav";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();

  const handlePublicarEmpleo = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/nuevo-aviso");
    }
  };

  return (
    <header className="border-b bg-white from-primary/10 to-secondary/20 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/90 transition-colors"
        >
          <Anchor className="h-6 w-6" />
          <span className="bg-clip-text text-transparent bg-ocean-gradient">EmpleosMadryn</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Button
            asChild
            className="text-primary hover:underline transition-colors"
          >
            <Link href="/avisos">Avisos</Link>
          </Button>
          <Button
            asChild
            className="text-primary hover:underline transition-colors"
          >
            <Link href="/categorias">Categorías</Link>
          </Button>
          <Button className="bg-ocean-gradient hover:bg-primary/90" onClick={handlePublicarEmpleo}>
            <Ship className="mr-2 h-4 w-4" />
            Publicar
          </Button>
          <UserNav />
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] bg-gradient-to-b from-background to-secondary/10"
          >
            <SheetHeader>
              <SheetTitle className="text-primary">Menú</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-8">
              <Button
                asChild
                className="w-full justify-start text-primary hover:text-primary/90"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/avisos");
                }}
              >
                <Link href="/avisos">Avisos</Link>
              </Button>
              <Button
                asChild
                className="w-full justify-start text-primary hover:text-primary/90"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/categorias");
                }}
              >
                <Link href="/categorias">Categorías</Link>
              </Button>
              <Button
                className="bg-ocean-gradient hover:bg-primary/90 w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  handlePublicarEmpleo();
                }}
              >
                <Ship className="mr-2 h-4 w-4" />
                Publicar
              </Button>

              {!isAuthenticated ? (
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  onClick={() => {
                    setIsMenuOpen(false);
                    signIn("google", { callbackUrl: "/" });
                  }}
                >
                  Iniciar sesión
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/mis-avisos">Mis Avisos</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/favoritos">Mis Favoritos</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
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