import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { AppLoader } from "@/components/layout/app-loader";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GCS — Vos expéditions, de bout en bout",
    template: "%s | GCS",
  },
  description:
    "GCS simplifie la gestion de vos expéditions, de la demande de devis au suivi des livraisons, avec une meilleure visibilité sur chaque étape.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AppLoader />
        {children}
      </body>
    </html>
  );
}
