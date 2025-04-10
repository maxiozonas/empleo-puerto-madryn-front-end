import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publicar Empleo en Puerto Madryn | Madryn Empleos",
  description: "Publica una oferta laboral en Puerto Madryn, Chubut, con Madryn Empleos. Conecta tu empresa con talento local en la Patagonia Argentina.",
  keywords: ["publicar empleo Puerto Madryn", "ofertas laborales Patagonia"],
};

export default function NuevoAvisoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}