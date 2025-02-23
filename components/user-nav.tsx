"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react"; // Importa signOut

export function UserNav({ isAuthenticated }: { isAuthenticated: boolean }) {
    if (!isAuthenticated) {
        return (
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/registro">Registrarse</Link>
                </Button>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                    <Link href="/mis-publicaciones">Mis Publicaciones</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/favoritos">Mis Favoritos</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}