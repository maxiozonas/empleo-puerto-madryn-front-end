import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Madryn Empleos",
  description: "Conoce al equipo detrás de Madryn Empleos, una plataforma creada por Máximo Ozonas y Juan Ignacio Rodríguez Mariani para conectar talento y empleo en Puerto Madryn, Chubut.",
  keywords: ["sobre nosotros Madryn Empleos", "equipo Puerto Madryn", "empleo Patagonia"],
};

export default function SobreNosotrosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}