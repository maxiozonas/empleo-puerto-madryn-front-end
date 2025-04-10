"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {

  const handleLogin = () => {
    signIn("google", { callbackUrl: "/" }); 
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-center mb-6">Iniciar sesión</h1>
        <p className="text-center text-muted-foreground mb-8">
          Inicia sesión con tu cuenta de Google para continuar
        </p>
        <Button
          onClick={handleLogin}
          className="bg-ocean-gradient hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300"
        >
          <FaGoogle className="mr-2 h-4 w-4"/>
          Iniciar sesión con Google
        </Button>
      </div>
    </div>
  );
}