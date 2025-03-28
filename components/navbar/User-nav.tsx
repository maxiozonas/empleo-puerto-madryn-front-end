"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function UserNav() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (!isAuthenticated) {
    return (
      <div>
        <Button className="flex items-center gap-4 hover:bg-primary/10 border-2 border-primary/30 rounded-md" onClick={() => signIn("google")}>
          Iniciar sesión
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="hflex items-center gap-4 hover:bg-primary/10 border-2 border-primary/30 rounded-md"
        >
          <span className="flex items-center gap-2">
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
            <span className="text-sm font-medium truncate max-w-[100px]">
              {session.user?.name?.split(' ')[0] || "Usuario"}
            </span>
          </span>
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
  );
}
