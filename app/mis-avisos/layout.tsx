import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis Avisos",
};

export default function MisAvisosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}