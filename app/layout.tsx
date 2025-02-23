import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body className={inter.className}>
                {/* Envuelve toda la aplicación con Providers */}
                <Providers>
                    <Header />
                    <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 sm:py-8 lg:py-12">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}