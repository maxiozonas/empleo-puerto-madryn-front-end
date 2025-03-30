import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Madryn Empleos",
    template: "%s | Madryn Empleos",
  },
  description: "Encuentra tu próximo trabajo en Madryn Empleos",
  keywords: ["empleos", "trabajo", "madryn", "avisos", "oportunidades"],
  authors: [{ name: "Madryn Empleos" }],
  creator: "Maximo Ozonas, Juan Ignacio Rodriguez Mariani",
  publisher: "Madryn Empleos"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}