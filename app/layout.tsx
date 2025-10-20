
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blossom – Le livre",
  description: "Site officiel Blossom – livre, posters et cartes."
};

import FooterSketch from "@/components/FooterSketch";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-dvh">
        <div className="flex min-h-dvh flex-col">
          {/* Header ici */}

          {/* Le background ne couvre que le contenu principal */}
          <main className="flex-1 bg-[url('/blossom_background.jpg')] bg-no-repeat bg-center bg-cover">
            {children}
          </main>

          {/* Le footer arrive ensuite avec son dégradé flouté */}
          <FooterSketch bgUrl="/blossom_background.jpg" email="hello@blossom.example" />
        </div>
      </body>
    </html>
  );
}
