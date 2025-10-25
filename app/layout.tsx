// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SplashScreen from "@/components/SplashScreen"; // (client)
import Footer from "@/components/Footer";             // (peut être server ou client)
import ViewportHeightSetter from "@/components/ViewportHeightSetter"; // (client)

export const metadata: Metadata = {
  title: "Blossom – Le livre",
  description: "Site officiel Blossom – livre, posters et cartes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-[100svh] antialiased">
        
        {/* Fix mobile VH stable */}
        <ViewportHeightSetter />

        {/* Splash 2s + fade */}
        <SplashScreen holdMs={2500} fadeMs={900} />        {/* Contenu */}

        <div className="relative z-10 flex min-h-[100svh] flex-col overflow-x-hidden">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}