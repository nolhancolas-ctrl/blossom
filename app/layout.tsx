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
    <html lang="fr">
      <body className="min-h-[100svh] antialiased">
        {/* Fond parallax (auto small/big) */}
        <ParallaxBg />

        {/* Contenu */}
        <div className="relative z-10 flex min-h-[100svh] flex-col overflow-x-hidden">
          {/* Main */}
          <main className="flex-1">{children}</main>

          {/* Footer marqué pour la fin du parallax */}
          <footer data-site-footer>
            <FooterSketch bgUrl="/background_big.jpg" email="hello@blossom.example" />
          </footer>
        </div>
      </body>
    </html>
  );
}