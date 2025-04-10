import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ofertas Laborales en Puerto Madryn | Madryn Empleos",
  description: "Explora empleos en Puerto Madryn, Chubut. Encuentra oportunidades en turismo, pesca, industria y más con Madryn Empleos.",
  keywords: ["empleos Puerto Madryn", "ofertas laborales Patagonia", "trabajo Chubut"],
};

export default function AvisosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}