import { Categoria } from "../types/iCategoria";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchRandomCategoriaImage(id: string): Promise<string> {
    try {
        const response = await fetch(`${apiUrl}/api/categorias/imagenes/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            return "/lib/logo.jpeg";
        }
        const data = await response.text();
        return data;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Error desconocido al cargar las categorías");
    }
}


export async function fetchCategorias(): Promise<Categoria[]> {
    try {
        const response = await fetch(`${apiUrl}/api/categorias`, {
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
        return data as Categoria[];
    } catch (err) {

        throw new Error(err instanceof Error ? err.message : "Error desconocido al cargar las categorías");
    }
}

export async function fetchaAllCategoriasImages(id: string, token: string): Promise<string[]> {
    try {
        const response = await fetch(`${apiUrl}/api/categorias/imagenes/all/${id}`, {
            method: "GET",
            headers: {
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
        return data as string[];
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Error desconocido al cargar las categorías");
    }
}

export async function fetchCategoriaImages(id: string, token: string): Promise<string> {
    try {
        const response = await fetch(`${apiUrl}/api/categorias/imagenes/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
              },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        return data as string;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Error desconocido al cargar la categoría");
    }
}

export async function createCategoriaImage(id: string, imageUrl: string, token: string): Promise<string> {
    try {
        const response = await fetch(`${apiUrl}/api/categorias/imagenes/${id}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body:imageUrl as string,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        return data as string;
    } catch (error) {
        throw error instanceof Error 
            ? error
            : new Error(error instanceof Error ? error.message : "Error desconocido al crear la imagen de la categoría");
    }
}

export async function deleteCategoriaImage(id: string, imageUrl: string, token: string): Promise<string> {
    try {
        const response = await fetch(`${apiUrl}/api/categorias/imagenes/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
              },
            body: imageUrl as string,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        return data as string;
    } catch (error) {
        throw error instanceof Error 
            ? error
            : new Error(error instanceof Error ? error.message : "Error desconocido al eliminar la imagen de la categoría");
    }
}

