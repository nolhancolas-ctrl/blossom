// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SplashScreen from "@/components/visual/SplashScreen";
import Footer from "@/components/layout/Footer";
import HeaderHero from "@/components/layout/HeaderHero";
import { LangProvider } from "@/hooks/useLang";

export const metadata: Metadata = {
  title: "Blossom – Le Livre",
  description: "Site officiel Blossom",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-[100svh] antialiased">
        
        {/* Stable viewport height */}
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
        
        {/* visibleAdd CSS Paint Worklet for title mask (required for text-only shine */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('paintWorklet' in CSS) {
                CSS.paintWorklet.addModule('/title-mask.js');
              }
            `,
          }}
        />

        <LangProvider>
          
          {/* NAV + HEADER always visible */}
          <HeaderHero />

          {/* Splash screen */}
          <SplashScreen holdMs={400} fadeMs={1200} />

          {/* Contenu */}
          <div className="relative z-10 flex min-h-[100svh] flex-col overflow-x-hidden">
            <main className="page-main flex-1">{children}</main>
            <Footer />
          </div>

        </LangProvider>
      </body>
    </html>
  );
}