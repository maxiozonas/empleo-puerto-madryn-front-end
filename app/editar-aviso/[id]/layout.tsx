import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Oferta Laboral | Madryn Empleos",
  description: "Edita tu oferta laboral en Puerto Madryn, Chubut, con Madryn Empleos. Actualiza los detalles y conecta con talento local en la Patagonia Argentina.",
  keywords: ["editar empleo Puerto Madryn", "actualizar oferta Patagonia"],
};

export default function EditarAvisoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}