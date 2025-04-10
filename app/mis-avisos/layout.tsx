import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis Avisos | Madryn Empleos",
  description: "Gestiona tus ofertas laborales en Puerto Madryn, Chubut, con Madryn Empleos. Edita o elimina tus avisos y conecta con talento local en la Patagonia Argentina.",
  keywords: ["mis avisos Puerto Madryn", "gestionar ofertas Patagonia"],
};

export default function MisAvisosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}