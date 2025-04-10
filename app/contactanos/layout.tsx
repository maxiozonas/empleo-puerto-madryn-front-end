import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contáctanos | Madryn Empleos",
  description: "Contacta a Madryn Empleos para consultas sobre empleos en Puerto Madryn, Chubut. Envía tus dudas o sugerencias y te responderemos pronto.",
};

export default function ContactanosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}