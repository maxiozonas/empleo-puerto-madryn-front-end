import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorias",
};

export default function CategoriasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}