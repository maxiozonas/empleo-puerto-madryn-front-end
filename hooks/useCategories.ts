import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useCategorias() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    console.log("Session data:", session);

    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/categorias", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }
        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("No se pudieron cargar las categorías");
      }
    };

    fetchCategorias();
  }, [status, router, session]);

  return { categorias, error};
}