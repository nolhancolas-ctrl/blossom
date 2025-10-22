// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import FooterSketch from "@/components/FooterSketch";
import ParallaxBg from "@/components/ParallaxBg";

export const metadata: Metadata = {
  title: "Blossom – Le livre",
  description: "Site officiel Blossom – livre, posters et cartes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      {/* Papier = fallback si l'image tarde */}
      <body className="bg-[#f8f5f1] min-h-[100svh] antialiased">
        {/* FOND PARALLAX (non 'background-attachment: fixed') */}
        <ParallaxBg src="/blossom_background.jpg" />

        {/* CONTENU */}
        <div className="relative z-10 flex min-h-[100svh] flex-col overflow-x-hidden">
          {/* <Header /> si besoin */}
          <main className="flex-1">{children}</main>
          <FooterSketch
            bgUrl="/blossom_background.jpg"
            email="hello@blossom.example"
          />
        </div>
      </body>
    </html>
  );
}