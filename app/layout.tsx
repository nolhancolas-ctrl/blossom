// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

import SplashScreen from "@/components/visual/SplashScreen"; 
import Footer from "@/components/layout/Footer"; 
import ViewportHeightSetter from "@/components/visual/ViewportHeightSetter";

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

        {/* Splash screen */}
        <SplashScreen holdMs={400} fadeMs={1200} />

        {/* Contenu */}
        <div className="relative z-10 flex min-h-[100svh] flex-col overflow-x-hidden">
          <main className="page-main flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}