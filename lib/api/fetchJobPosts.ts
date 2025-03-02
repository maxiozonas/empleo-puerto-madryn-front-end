import { JobPosting } from "../types/iJobPosting";

export async function fetchJobPosts(): Promise<JobPosting[]> {
    try {
      const response = await fetch("http://localhost:8080/api/ofertas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("La respuesta del servidor no es un array válido");
      }
      return data as JobPosting[];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error desconocido al cargar las ofertas");
    }
  }