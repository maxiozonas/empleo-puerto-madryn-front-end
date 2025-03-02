export async function useCreateJobOffer(
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
) {
  const requestBody = {
    titulo: data.titulo,
    descripcion: data.descripcion,
    usuario: { id: data.usuarioId },
    empresaConsultora: data.empresaConsultora,
    fechaPublicacion: new Date().toISOString(),
    fechaCierre: data.fechaCierre ? new Date(`${data.fechaCierre}T23:59:59`).toISOString() : null,
    formaPostulacion: data.formaPostulacion as "MAIL" | "LINK",
    emailContacto: data.formaPostulacion === "MAIL" ? data.emailContacto : null,
    linkPostulacion: data.formaPostulacion === "LINK" ? data.linkPostulacion : null,
    categoria: { id: data.categoriaId },
  };

  const response = await fetch("http://localhost:8080/api/ofertas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}