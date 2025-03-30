import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avisos",
};

export default function AvisosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}