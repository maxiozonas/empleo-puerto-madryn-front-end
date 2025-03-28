"use client";

import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/navbar/Header";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/home-page/Footer";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 sm:py-2 lg:py-4">
              {children}
              <Footer />
            </main>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}