import { Category } from "../types/iCategory";

export async function fetchCategories(): Promise<Category[]> {
    try {
      const response = await fetch("http://localhost:8080/api/categorias", {
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
      return data as Category[];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error desconocido al cargar las categorías");
    }
  }