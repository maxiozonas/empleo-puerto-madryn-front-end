import { JobPosting } from "../types/iJobPosting";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchJobPostById(id: string): Promise<JobPosting> {
  try {
    const response = await fetch(`${apiUrl}/api/ofertas/${id}`, {
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
    if (typeof data !== "object" || data === null) {
      throw new Error("La respuesta del servidor no es un objeto válido");
    }
    return data as JobPosting;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Error desconocido al cargar la oferta");
  }
}