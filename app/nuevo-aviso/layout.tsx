import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo Aviso",
};

export default function NuevoAvisoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}