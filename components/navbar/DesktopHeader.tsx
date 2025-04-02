"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Ship, ChevronDown } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DesktopHeader() {
  const { data: session, status } = useSession();
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
    <div className="hidden md:flex items-center w-full justify-between">
      <div className="flex items-center">
        <Link
          href="/"
          className="flex items-center text-2xl font-bold  text-primary hover:text-primary/90 transition-colors"
        >
          <Image src="/lib/logoPage.png" alt="EmpleosMadryn" width={100} height={100} />
          <span className="bg-clip-text text-lg md:text-xl">Madryn Empleos</span>
        </Link>

        <div className="flex flex-1 items-center justify-center gap-5 ml-5">
          <Button asChild className="text-muted-foreground hover:text-primary">
            <Link href="/avisos">Avisos</Link>
          </Button>
          <Button asChild className="text-muted-foreground hover:text-primary">
            <Link href="/categorias">Categorías</Link>
          </Button>
          <Button asChild className="text-muted-foreground hover:text-primary">
            <Link href="/contactanos">Contáctanos</Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
      {isAuthenticated && process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").includes(session?.user.email as string) && (
            <Button asChild className="text-muted-foreground hover:text-primary">
              <Link href="/admin">Administrar</Link>
            </Button>
          )}
        <Button
          className="bg-ocean-gradient hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300"
          onClick={handlePublicarEmpleo}
        >
          <Ship className="mr-2 h-4 w-4" />
          Publicar
        </Button>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 hover:bg-primary/20 hover:text-back border-2 border-primary/30 rounded-md">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Perfil de usuario"}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {session.user.name?.split(' ')[0]?.[0] || "U"}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium">{session.user?.name?.split(' ')[0] || "Usuario"}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem asChild>
                <Link href="/mis-avisos">Mis avisos</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/mis-favoritos">Mis Favoritos</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            className="border-primary text-primary hover:text-primary hover:bg-primary/10 border-2 border-primary/30 rounded-md"
            onClick={() => signIn("google")}
          >
            Iniciar sesión
          </Button>
        )}
      </div>
    </div>
  );
}