import { ServicioUsuario} from "../types/iServicioUsuario";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchServiceById(id: string): Promise<ServicioUsuario> {
  const response = await fetch(`${apiUrl}/api/servicios/${id}`, {
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

  return data as ServicioUsuario;
}

export async function fetchServices(): Promise<ServicioUsuario[]> {
  const response = await fetch(`${apiUrl}/api/servicios`, {
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

  return data as ServicioUsuario[];
}

export async function fetchUserServices(token: string): Promise<ServicioUsuario[]> {
  const response = await fetch(`${apiUrl}/api/servicios/mis-servicios`, {
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

  return data as ServicioUsuario[];
}

export async function updateService(
  data: {
    id: string;
    titulo: string;
    descripcion: string;
    usuarioId: string;
    categoriaId: string;
    formaContacto: string;
    contacto: string;
    imagen?: File | null;
    imagenUrl?: string | null;
    habilitado: boolean;
  },
  token: string
): Promise<ServicioUsuario> {
  const formData = new FormData();

  const servicioData = {
    id: data.id,
    titulo: data.titulo,
    descripcion: data.descripcion,
    usuario: { id: data.usuarioId },
    categoria: { id: data.categoriaId },
    fechaPublicacion: new Date().toISOString(),
    formaContacto: data.formaContacto as "MAIL" | "PHONE",
    contacto: data.contacto,
    habilitado: data.habilitado,
  };

  formData.append("servicio", JSON.stringify(servicioData));

  if (data.imagen) {
    formData.append("imagen", data.imagen);
  }

  formData.append("imagenUrl", data.imagenUrl ?? "null");

  const response = await fetch(`${apiUrl}/api/servicios/${data.id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  const dataResponse = await response.json();
  return dataResponse as ServicioUsuario;
}

export async function createService(
  data: {
    titulo: string;
    descripcion: string;
    usuarioId: string;
    categoriaId: string;
    formaContacto: string;
    contacto: string;
    imagen?: File | null;
  },
  token: string
): Promise<ServicioUsuario> {
  const formData = new FormData();

  const servicioData = {
    titulo: data.titulo,
    descripcion: data.descripcion,
    usuario: { id: data.usuarioId },
    categoria: { id: data.categoriaId },
    fechaPublicacion: new Date().toISOString(),
    formaContacto: data.formaContacto as "MAIL" | "PHONE",
    contacto: data.contacto,
  };

  console.log("Datos enviados al backend:", servicioData);

  formData.append("servicio", JSON.stringify(servicioData));

  if (data.imagen) {
    formData.append("imagen", data.imagen);
  }

  const response = await fetch(`${apiUrl}/api/servicios`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  const dataResponse = await response.json();
  return dataResponse as ServicioUsuario;
}

export async function deleteService(id: string, token: string): Promise<void> {
  const response = await fetch(`${apiUrl}/api/servicios/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
}

export async function enableServiceAdmin(id: string, token: string) {
  const url = `${apiUrl}/api/admin/servicios/habilitar/${id}`;
  console.log("Enviando POST a:", url);

  try {
    const response = await fetch(url, {
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
    console.error("Error en enableServiceAdmin:", error);
    throw error;
  }
}

export async function deleteServiceAdmin(id: string, token: string) {
  const url = `${apiUrl}/api/admin/servicios/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
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
    console.error("Error en deleteServiceAdmin:", error);
    throw error;
  }
}