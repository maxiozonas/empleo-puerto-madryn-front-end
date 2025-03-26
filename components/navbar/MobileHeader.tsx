"use client";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Menu, Ship, ChevronDown } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-dropdown-menu";

export function MobileHeader({ isMenuOpen, setIsMenuOpen }: { isMenuOpen: boolean; setIsMenuOpen: (open: boolean) => void }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();

  const handlePublicarEmpleo = () => {
    setIsMenuOpen(false);
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/nuevo-aviso");
    }
  };

  const UserNavMobile = () => {
    if (!isAuthenticated || !session?.user) return null;

    return (
      <div className="flex items-center justify-center gap-2 p-2 bg-secondary/10 rounded-lg mb-4 mt-4">
        {session.user.image ? (
          <Image
            src={session.user.image || "/placeholder.svg"}
            alt={session.user.name || "Perfil de usuario"}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm text-xl">{session.user.name?.split(" ")[0]?.[0] || "U"}</span>
          </div>
        )}
        <span className="text-sm font-medium truncate text-xl">{session.user.name?.split(" ")[0] || "Usuario"}</span>
      </div>
    );
  };

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      {isAuthenticated && session?.user ? (
        <Button
          size="lg"
          className="md:hidden flex items-center gap-2 px-3"
          onClick={() => setIsMenuOpen(true)}
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "Perfil de usuario"}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">{session.user.name?.split(" ")[0]?.[0] || "U"}</span>
            </div>
          )}
          <ChevronDown className="text-primary h-8 w-8 custom-chevron"/>
        </Button>
      ) : (
        <Button
          size="lg"
          className="md:hidden bg-ocean-gradient text-white p-3"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="h-8 w-8" />
        </Button>
      )}

      {/* Original Sheet Content */}
      <SheetContent side="top" className="w-full sm:w-[400px] bg-white rounded-lg custom-sheet">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <UserNavMobile />
        <div className="flex flex-col gap-4 mt-4">
          <Button
            asChild
            className="w-full text-primary"
            onClick={() => {
              setIsMenuOpen(false);
              router.push("/avisos");
            }}
          >
            <Link href="/avisos" className="text-xl font-semibold">Avisos</Link>
          </Button>
          <Button
            asChild
            className="w-full text-primary"
            onClick={() => {
              setIsMenuOpen(false);
              router.push("/categorias");
            }}
          >
            <Link href="/categorias" className="text-xl font-semibold">Categorías</Link>
          </Button>
          <Button
            asChild
            className="w-full text-primary"
            onClick={() => {
              setIsMenuOpen(false);
              router.push("/contactanos");  
            }}
          >
            <Link href="/contactanos" className="text-xl font-semibold">Contáctanos</Link>
          </Button>
          <Separator className="border-t-2 border-primary" />
          <Button
            className="bg-ocean-gradient text-white w-full text-xl font-semibold"
            onClick={handlePublicarEmpleo}
          >
            <Ship className="mr-2 h-4 w-4" />
            Publicar
          </Button>

          {!isAuthenticated ? (
            <Button
              className="w-full text-primary text-xl font-semibold"
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
                className="w-full text-primary text-xl font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/mis-avisos">Mis Avisos</Link>
              </Button>
              <Button
                asChild
                className="w-full  text-primary text-xl font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/mis-favoritos">Mis Favoritos</Link>
              </Button>
              <Button
                className="w-full text-destructive hover:text-destructive border-destructive/30 text-xl font-semibold"
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
  );
}