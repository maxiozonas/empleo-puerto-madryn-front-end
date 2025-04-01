export interface ServicioUsuario {
  id: string;
  titulo: string;
  descripcion: string;
  usuarioOferente: {
    email: string;
    nombre?: string;
  };
  categoria: {
    id: string;
    nombre: string;
  };
  fechaPublicacion: string;
  formaContacto: "MAIL" | "PHONE";
  contacto: string;
  imagenUrl?: string;
  habilitado: boolean;
}