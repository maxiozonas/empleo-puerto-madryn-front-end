import { Oferta } from "@/lib/types/iOferta";

interface Favorite {
  ofertaEmpleo: Oferta;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export async function addFavorite(ofertaId: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${apiUrl}/api/favoritos/${ofertaId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  } catch (error) {

    throw error;
  }
}


export async function removeFavorite(ofertaId: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${apiUrl}/api/favoritos/${ofertaId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  } catch (error) {

    throw error;
  }
}


export async function fetchUserFavorites(token: string): Promise<Favorite[]> {
  try {
    const response = await fetch(`${apiUrl}/api/favoritos`, {
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
    return data;
  } catch (error) {

    throw error;
  }
}


export async function checkIsFavorite(ofertaId: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/api/favoritos/${ofertaId}/is-favorite`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return response.json();
  } catch (error) {

    throw error;
  }
}