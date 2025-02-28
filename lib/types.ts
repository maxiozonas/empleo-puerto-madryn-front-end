export interface JobPosting {
  id: string;
  titulo: string;
  descripcion: string;
  usuarioPublicador: { email: string };
  empresaConsultora: string;
  fechaPublicacion: string;
  fechaCierre?: string;
  formaPostulacion: string;
  contactoPostulacion?: string;
  categoria: { id: string; nombre: string }; 
}