import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis favoritos",
};

export default function MisFavoritosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}