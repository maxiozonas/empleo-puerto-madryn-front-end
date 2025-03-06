"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export function useAuthCheck() {
  const { data: session, status } = useSession();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window === "undefined" || status === "loading" || status === "unauthenticated" || !session?.backendToken) {
      return;
    }

    const checkToken = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/auth/validate-token`, {
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

    
    checkToken();
    const interval = setInterval(checkToken, 5 * 60 * 1000);

    
    return () => clearInterval(interval);
  }, [session, status]); 
}