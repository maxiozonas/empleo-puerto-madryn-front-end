"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Ship, ChevronDown } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <div className="md:hidden flex items-center justify-between w-full">
        <Link
          href="/"
          className="flex items-center text-2xl font-bold text-primary hover:text-primary/90 transition-colors"
        >
          <Image src="/lib/logoPage.png" alt="EmpleosMadryn" width={40} height={40} />
          <span className="ml-2 text-lg">Madryn Empleos</span>
        </Link>

        {isAuthenticated && session?.user ? (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2 hover:bg-primary/10 border-2 border-primary/30 rounded-md"
            onClick={() => setIsMenuOpen(true)}
          >
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "Perfil de usuario"}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">{session.user.name?.split(" ")[0]?.[0] || "U"}</span>
              </div>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className=""
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6 text-primary" />
          </Button>
        )}
      </div>

      <SheetContent side="left" className="w-[300px] bg-gradient-to-b from-primary to-secondary text-white p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="flex items-center justify-between p-4 border-b border-white/10">
            <SheetTitle className="font-bold text-xl text-white">Madryn Empleos</SheetTitle>
          </SheetHeader>

          {isAuthenticated && session?.user && (
            <div className="flex items-center gap-2 p-4 bg-white/10">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Perfil de usuario"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Ship className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <p className="font-medium">{session.user.name?.split(" ")[0] || "Usuario"}</p>
                <p className="text-sm text-white/70">{session.user.email}</p>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-auto py-4">
            <div className="py-2">
              {[
                { name: "Inicio", path: "/" },
                { name: "Avisos", path: "/avisos" },
                { name: "Categorías", path: "/categorias" },
                { name: "Contáctanos", path: "/contactanos" },
              ].map((item) => (
                <Link 
                  key={item.name} 
                  href={item.path}
                  className="flex items-center px-4 py-3 hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">{item.name}</span>
                </Link>
              ))}
            </div>

            {isAuthenticated && process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").includes(session?.user.email as string) && (
              <div className="border-t border-white/10 my-2 pt-2">
                <p className="px-4 py-2 text-white/70 text-sm">Administrar</p>
                <Link
                  href="/admin"
                  className="flex items-center px-4 py-3 hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">Administrar</span>
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <div className="border-t border-white/10 my-2 pt-2">
                <p className="px-4 py-2 text-white/70 text-sm">Mi cuenta</p>
                <Link 
                  href="/mis-avisos" 
                  className="flex items-center px-4 py-3 hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">Mis avisos</span>
                </Link>
                <Link 
                  href="/mis-favoritos" 
                  className="flex items-center px-4 py-3 hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">Mis favoritos</span>
                </Link>
              </div>
            )}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Button 
              className="w-full bg-white text-primary hover:bg-white/90 mb-2"
              onClick={handlePublicarEmpleo}
            >
              <Ship className="mr-2 h-4 w-4" />
              Publicar Empleo
            </Button>

            {!isAuthenticated ? (
              <Button 
                className="w-full bg-transparent border border-white text-white hover:bg-white/10"
                onClick={() => {
                  setIsMenuOpen(false);
                  signIn("google", { callbackUrl: "/" });
                }}
              >
                Iniciar sesión
              </Button>
            ) : (
              <Button 
                className="w-full bg-transparent border border-white text-white hover:bg-white/10"
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                }}
              >
                Cerrar sesión
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}