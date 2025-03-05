import { JobPosting } from "../types/iJobPosting";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchJobPostById(id: string): Promise<JobPosting> {
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
}

export async function fetchJobPosts(): Promise<JobPosting[]> {
    const response = await fetch(`${apiUrl}/api/ofertas`, {
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
}

export async function fetchUserJobPosts(token: string): Promise<JobPosting[]> {
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
}

export async function updateJobOffer(
    data: {
      id: string;
      titulo: string;
      descripcion: string;
      usuarioId: string;
      empresaConsultora: string;
      fechaCierre: string | null;
      formaPostulacion: string;
      emailContacto: string | null;
      linkPostulacion: string | null;
      categoriaId: string;
    },
    token: string
  ): Promise<JobPosting> {
    const requestBody = {
      id: data.id,
      titulo: data.titulo,
      descripcion: data.descripcion,
      usuario: { id: data.usuarioId },
      empresaConsultora: data.empresaConsultora,
      fechaPublicacion: new Date().toISOString(),
      fechaCierre: data.fechaCierre,
      formaPostulacion: data.formaPostulacion as "MAIL" | "LINK",
      emailContacto: data.formaPostulacion === "MAIL" ? data.emailContacto : null,
      linkPostulacion: data.formaPostulacion === "LINK" ? data.linkPostulacion : null,
      categoria: { id: data.categoriaId },
    };
  
    const response = await fetch(`${apiUrl}/api/ofertas/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  
    const dataResponse = await response.json();
    return dataResponse as JobPosting;
  }

export async function createJobOffer(
    data: {
      titulo: string;
      descripcion: string;
      usuarioId: string;
      empresaConsultora: string;
      fechaCierre: string | null;
      formaPostulacion: string;
      emailContacto: string | null;
      linkPostulacion: string | null;
      categoriaId: string;
    },
    token: string
  ): Promise<JobPosting> {
    const requestBody = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      usuario: { id: data.usuarioId },
      empresaConsultora: data.empresaConsultora,
      fechaPublicacion: new Date().toISOString(),
      fechaCierre: data.fechaCierre, 
      formaPostulacion: data.formaPostulacion as "MAIL" | "LINK",
      emailContacto: data.formaPostulacion === "MAIL" ? data.emailContacto : null,
      linkPostulacion: data.formaPostulacion === "LINK" ? data.linkPostulacion : null,
      categoria: { id: data.categoriaId },
    };
  
    const response = await fetch(`${apiUrl}/api/ofertas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  
    const dataResponse = await response.json();
    return dataResponse as JobPosting;
  }