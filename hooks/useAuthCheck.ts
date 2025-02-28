"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export function useAuthCheck() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated" || !session?.backendToken) {
      return;
    }

    const checkToken = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/validate-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.backendToken}`,
          },
        });

        if (!response.ok) {
          console.log("Token ha expirado, cerrando sesión...");
          await signOut({ redirect: true, callbackUrl: "/login" });
        }
      } catch (error) {
        console.error("Error validating token:", error);
        await signOut({ redirect: true, callbackUrl: "/login" });
      }
    };

    // Verificar inmediatamente y luego cada 5 minutos
    checkToken();
    const interval = setInterval(checkToken, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, [session, status]);
}