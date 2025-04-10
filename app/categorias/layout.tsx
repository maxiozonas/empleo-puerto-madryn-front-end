import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorías de Empleos en Puerto Madryn | Madryn Empleos",
  description: "Explora categorías de empleo en Puerto Madryn: turismo, pesca, tecnología y más. Encuentra tu próximo trabajo con Madryn Empleos.",
  keywords: ["categorías empleo Puerto Madryn", "trabajos por sector Patagonia"],
};

export default function CategoriasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}