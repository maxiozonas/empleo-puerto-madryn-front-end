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
  description: "Encuentra empleo en Puerto Madryn, Chubut, Patagonia Argentina. Madryn Empleos ofrece ofertas laborales actualizadas en una ciudad costera reconocida por su belleza natural.",
  icons: {
    icon: "/logo.png",
  },
  keywords: ["Madryn Empleos, empleos Puerto Madryn, trabajos puerto madryn,ofertas laborales Madryn, trabajo Madryn, empleo Madryn, empleo Patagonia, trabajo Patagonia, empleos Patagonia, trabajos Patagonia, ofertas laborales Patagonia, trabajos Patagonia, empleo Argentina, trabajo Argentina, empleos Argentina, trabajos Argentina, ofertas laborales Argentina"],
  authors: [{ name: "Madryn Empleos" }],
  creator: "Maximo Ozonas, Juan Ignacio Rodriguez Mariani",
  publisher: "Madryn Empleos",
  openGraph: {
    title: "Madryn Empleos - Ofertas laborales en Puerto Madryn",
    description: "Encuentra empleo en Puerto Madryn, Chubut, Patagonia Argentina. Madryn Empleos ofrece ofertas laborales actualizadas en una ciudad costera reconocida por su belleza natural.",
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