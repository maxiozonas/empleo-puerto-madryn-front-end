// components/header/DesktopHeader.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Ship } from "lucide-react";
import { UserNav } from "./User-nav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function DesktopHeader() {
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
    <>
      <Link
        href="/"
        className="flex items-center text-2xl font-bold text-primary hover:text-primary/90 transition-colors"
      >
        <Image src="/lib/logoPage.png" alt="EmpleosMadryn" width={128} height={128} className="h-16 w-16" />
        <span className="bg-clip-text">EmpleosMadryn</span>
      </Link>

      <div className="hidden md:flex flex-1 items-center justify-center gap-6">
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

      <div className="hidden md:flex items-center gap-4">
        <Button className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300" onClick={handlePublicarEmpleo}>
          <Ship className="mr-2 h-4 w-4" />
          Publicar
        </Button>
        <UserNav />
      </div>
    </>
  );
}