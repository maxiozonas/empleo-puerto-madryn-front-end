"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
            <Button onClick={() => signIn("google")}>Continuar con Google</Button>
        </div>
    );
}