// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ParallaxBg from "@/components/visual/ParallaxBg";
import BookHero from "@/components/spline/BookHero";
import MailingSection from "@/components/sections/MailingSection";
import DescriptionSection from "@/components/sections/DescriptionSection";
import PosterSection from "@/components/sections/PosterSection";
import PageSection from "@/components/layout/PageSection";

const CountdownSection = dynamic(
  () => import("@/components/sections/CountdownSection"),
  { ssr: false }
);

export default function Home() {
  const [showBook, setShowBook] = useState(false);

  useEffect(() => {
    const prepare = () => setShowBook(true);
    window.addEventListener("splash:prepare", prepare, { once: true });

    const id = window.setTimeout(() => setShowBook(true), 8000);
    return () => {
      window.removeEventListener("splash:prepare", prepare);
      window.clearTimeout(id);
    };
  }, []);

  return (
    <>
      <ParallaxBg small="/background_small.jpg" big="/background_big.jpg" />

      <div className="relative z-10">
        
        {/* Book */}
        <PageSection variant="hero">
          {showBook && (
            <BookHero
              src="https://my.spline.design/blossombookanimated-RABoYJaWjZ6evsgSlU4VgfI4/"
              decorSrc="/dorure.webp"
            />
          )}
        </PageSection>

        {/* Countdown */}
        <section className="site-section">
          <CountdownSection
            target="2026-03-26T10:00:00+09:00"
            size="lg"
          />
        </section>

        <MailingSection />
        <DescriptionSection />

        <PosterSection
          title={{
            en: "If you cannot take care of a plant, print one! 🌼",
            fr: "Si tu ne peux pas t’occuper d’une plante, imprime-en une ! 🌼"
          }}
          ctaHref="/shop"
        />
      </div>
    </>
  );
}