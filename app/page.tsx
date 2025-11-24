// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import ParallaxBg from "@/components/visual/ParallaxBg";
import BookHero from "@/components/spline/BookHero";
import MailingSection from "@/components/sections/MailingSection";
import PosterSection from "@/components/sections/PosterSection";
import PageSection from "@/components/layout/PageSection";
const CountdownSection = dynamic(() => import("@/components/sections/CountdownSection"), { ssr: false });

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

  const launch = "2026-03-26T10:00:00+09:00";

  return (
    <>
      {/* Header image */}
      <section className="site-section site-header-section relative z-10">
        {/* Desktop */}
        <header className="hidden sm:block w-screen overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <Image
            src="/header_wide.jpg"
            alt="Blossom header wide"
            width={5876}
            height={896}
            className="w-full h-auto object-cover"
            priority
          />
        </header>
        {/* Mobile */}
        <header className="block sm:hidden w-screen overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <Image
            src="/header_small.jpg"
            alt="Blossom header small"
            width={5876}
            height={445}
            className="w-full h-auto object-cover"
            priority
          />
        </header>
      </section>

      {/* Parallax background (fixed under everything) */}
      <ParallaxBg small="/background_small.jpg" big="/background_big.jpg" />

      {/* Main content */}
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
        
        {/* Mailing */}
        <MailingSection />

        {/* Posters */}
        <PosterSection
          leftSrc="https://my.spline.design/postercalathea-moCyI7RjYjeYDAemgq7igMGk/"
          rightSrc="https://my.spline.design/posterstrelitzia-nESCAFDnDYjmeiSdHTA4tqkc/"
          title="If you cannot take care of a plant, print one :)"
          ctaHref="/shop"
        />
      </div>
    </>
  );
}