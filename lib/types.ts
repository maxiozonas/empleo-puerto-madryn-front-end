export interface JobPosting {
    id: string;
    titulo: string;
    descripcion: string;
    usuarioPublicador: {
      nombre: string;
      email: string;
    };
    empresaConsultora: string;
    fechaPublicacion: string;
    fechaCierre: string;
    formaPostulacion: string;
    contactoPostulacion: string;
    categoria: {
      nombre: string;
    };
  }