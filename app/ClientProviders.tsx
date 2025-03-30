"use client";

import type React from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/navbar/Header";
import Footer from "@/components/home-page/Footer";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 sm:py-2 lg:py-4">
          {children}
          <Footer />
          <Analytics />
        </main>
      </QueryClientProvider>
    </SessionProvider>
  );
}