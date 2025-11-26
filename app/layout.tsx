// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SplashScreen from "@/components/visual/SplashScreen"; 
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Blossom – Le livre",
  description: "Site officiel Blossom – livre, posters et cartes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-[100svh] antialiased">

        {/* Stable viewport height — only once */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var vh = window.innerHeight;
                document.documentElement.style.setProperty('--vhpx', vh + 'px');
              })();
            `,
          }}
        />

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