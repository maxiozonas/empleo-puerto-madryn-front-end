import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidad",
};

export default function PoliticaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}