import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre nosotros",
};

export default function SobreNosotrosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}