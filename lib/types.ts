export interface JobPosting {
  id: string;
  titulo: string;
  descripcion: string;
  usuarioPublicador: {
    email: string;
  };
  empresaConsultora: string;
  fechaPublicacion: string;
  fechaCierre?: string | null;
  formaPostulacion: string;
  contactoPostulacion?: string | null;
  categoria: {
    nombre: string;
  };
}