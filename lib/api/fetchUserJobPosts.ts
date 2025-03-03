import { JobPosting } from "../types/iJobPosting";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchUserJobPosts(token: string): Promise<JobPosting[]> {
  try {
    const response = await fetch(`${apiUrl}/api/ofertas/mis-avisos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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
    throw new Error(err instanceof Error ? err.message : "Error desconocido al cargar las publicaciones");
  }
}