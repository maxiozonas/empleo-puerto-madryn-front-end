import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
};

export default function ContactanosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}