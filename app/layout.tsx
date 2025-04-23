import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Madryn Empleos - Ofertas laborales en Puerto Madryn",
    template: "%s | Madryn Empleos",
  },
  description: "Encuentra empleo en Puerto Madryn, Chubut, Patagonia Argentina. Madryn Empleos ofrece ofertas laborales actualizadas en una ciudad costera reconocida por su belleza natural.",
  icons: {
    icon: "/public/logo.ico",
  },
  keywords: ["Madryn Empleos, empleos Puerto Madryn, trabajos puerto madryn,ofertas laborales Madryn, trabajo Madryn, empleo Madryn, empleo Patagonia, trabajo Patagonia, empleos Patagonia, trabajos Patagonia, ofertas laborales Patagonia, trabajos Patagonia, empleo Argentina, trabajo Argentina, empleos Argentina, trabajos Argentina, ofertas laborales Argentina"],
  authors: [{ name: "Madryn Empleos, Maximo Ozonas, Juan Ignacio Rodriguez Mariani" }],
  creator: "Maximo Ozonas, Juan Ignacio Rodriguez Mariani",
  publisher: "Madryn Empleos",
  openGraph: {
    title: "Madryn Empleos - Ofertas laborales en Puerto Madryn",
    description: "Encuentra empleo en Puerto Madryn, Chubut, Patagonia Argentina. Madryn Empleos ofrece ofertas laborales actualizadas en una ciudad costera reconocida por su belleza natural.",
    url: "https://www.madrynempleos.com",
    siteName: "Madryn Empleos",
    images: [
      {
        url: "https://www.madrynempleos.com/lib/logo.jpeg",
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
        <meta name="google-adsense-account" content="ca-pub-5932421257314184" />
      </head>
      <body className={inter.className}>
        {/* Scripts de Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-58EP2GP6X3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-58EP2GP6X3');
          `}
        </Script>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}