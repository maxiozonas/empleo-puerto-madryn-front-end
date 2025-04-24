import { useMutation } from "@tanstack/react-query";
import { createMessage } from "../api/contactar";

export function useCreateMessage() {
  return useMutation({
    mutationFn: (data: {
      nombre: string;
      apellido: string;
      email: string;
      mensaje: string;
    }) => createMessage(data),
    onError: (error) => {
      console.error("Error al enviar mensaje de contacto:", error);
    }
  });
}
