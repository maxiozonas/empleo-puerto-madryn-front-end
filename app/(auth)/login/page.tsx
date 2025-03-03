"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    signIn("google", { callbackUrl: "/" }); 
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Iniciar sesión</h1>
        <p className="text-center text-muted-foreground mb-8">
          Inicia sesión con tu cuenta de Google para continuar
        </p>
        <Button
          onClick={handleLogin}
          className="w-full"
        >
          Iniciar sesión con Google
        </Button>
      </div>
    </div>
  );
}