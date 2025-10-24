import "./globals.css";
import type { Metadata } from "next";
import SplashScreen from "@/components/SplashScreen";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blossom – Le livre",
  description: "Site officiel Blossom – livre, posters et cartes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-[100svh] antialiased">
        {/* Splash 2s + fade (peu coûteux) */}
        <SplashScreen durationMs={2000} />

        {/* Contenu du site */}
        <div className="relative z-10 flex min-h-[100svh] flex-col overflow-x-hidden">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}