// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import FooterOffWhite from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blossom – Le livre",
  description: "Site officiel Blossom – livre, posters et cartes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-[100svh] antialiased">
        {/* Contenu au-dessus du calque fixe (les pages gèrent le parallax) */}
        <div className="relative z-10 flex min-h-[100svh] flex-col overflow-x-hidden">
          <main className="flex-1">{children}</main>

          {/* Footer sur fond blanc cassé (recouvre le parallax) */}
          <FooterOffWhite />
        </div>
      </body>
    </html>
  );
}