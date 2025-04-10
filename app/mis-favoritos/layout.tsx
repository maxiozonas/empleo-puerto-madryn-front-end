import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis Favoritos | Madryn Empleos",
  description: "Gestiona tus favoritos en Puerto Madryn, Chubut, con Madryn Empleos.",
  keywords: ["mis favoritos Puerto Madryn", "gestionar favoritos Patagonia"],
};

export default function MisFavoritosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}