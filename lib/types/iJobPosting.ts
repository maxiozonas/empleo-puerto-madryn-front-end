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
  formaPostulacion: "MAIL" | "LINK";
  contactoPostulacion?: string | null; 
  categoria: {
    id: string;
    nombre: string;
  };
  logoUrl?: string | null;
}