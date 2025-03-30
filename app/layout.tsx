import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Madryn Empleos - Ofertas laborales en Puerto Madryn",
    template: "%s | Madryn Empleos",
  },
  description: "Explora las mejores ofertas laborales en Puerto Madryn. Encuentra empleos actualizados y oportunidades en Madryn Empleos.",
  keywords: ["Madryn Empleos, empleos Puerto Madryn, ofertas laborales Madryn, trabajo Madryn"],
  authors: [{ name: "Madryn Empleos" }],
  creator: "Maximo Ozonas, Juan Ignacio Rodriguez Mariani",
  publisher: "Madryn Empleos",
  openGraph: {
    title: "Madryn Empleos - Ofertas laborales en Puerto Madryn",
    description: "Explora las mejores ofertas laborales en Puerto Madryn. Encuentra empleos actualizados y oportunidades en Madryn Empleos.",
    url: "https://www.madrynempleos.com",
    siteName: "Madryn Empleos",
    images: [
      {
        url: "https://www.madrynempleos.com/lib/logoPage.png",
        width: 800,
        height: 600,
        alt: "Madryn Empleos",
      },
    ],
    locale: "es-AR",
    type: "website",
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="google-site-verification" content="TU_CÓDIGO_AQUÍ" />
      </head>
      <body className={inter.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}