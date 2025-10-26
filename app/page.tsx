// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import PosterSection from "@/components/Poster";
import BookSpline from "@/components/BookSpline";
import ParallaxBg from "@/components/ParallaxBg";
import MailingSection from "@/components/MailingSection";

const Countdown3D = dynamic(() => import("@/components/Countdown3D"), { ssr: false });

export default function Home() {
  const [showBook, setShowBook] = useState(false);

  // Préparation du livre juste avant la fin du splash (voir SplashScreen: prepareLeadMs)
  useEffect(() => {
    const prepare = () => setShowBook(true);
    window.addEventListener("splash:prepare", prepare, { once: true });
    // filet si l’event n’arrive pas
    const id = window.setTimeout(() => setShowBook(true), 8000);
    return () => {
      window.removeEventListener("splash:prepare", prepare);
      window.clearTimeout(id);
    };
  }, []);

  const launch = "2026-03-26T10:00:00+09:00";

  return (
    <>
      {/* === HEADER SECTION (au-dessus du parallax) === */}
      <section className="site-section site-header-section relative z-10">
        {/* Desktop */}
        <header
          data-site-header
          className="hidden sm:block w-screen overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
        >
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
        <header
          data-site-header
          className="block sm:hidden w-screen overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
        >
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

      {/* === PARALLAX (derrière tout le reste) === */}
      <ParallaxBg small="/background_small.jpg" big="/background_big.jpg" />

      {/* === MAIN CONTENT (au-dessus du parallax) === */}
      <div className="relative z-10">
        {/* LIVRE 3D */}
        <section className="site-section">
          {showBook && (
            <BookSpline
              src="https://my.spline.design/blossombookanimated-RABoYJaWjZ6evsgSlU4VgfI4/"
              decorSrc="/dorure.webp"
              desktopScalePct={0.55}
              maxScaleDesktop={0.68}
              maxScaleMobile={0.85}
            />
          )}
        </section>

        {/* COMPTEUR */}
        <section className="text-center">
          <div className="grid place-items-center mt-4">
            <Countdown3D target={launch} size="lg" />
          </div>
        </section>

        {/* MAILING */}
        <section className="site-section">
          <MailingSection />
        </section>

        {/* POSTERS */}
        <section className="site-section">
          <PosterSection
            leftSrc="https://my.spline.design/postercalathea-moCyI7RjYjeYDAemgq7igMGk/"
            rightSrc="https://my.spline.design/posterstrelitzia-nESCAFDnDYjmeiSdHTA4tqkc/"
            title="If you cannot take care of a plant, print one :)"
            ctaHref="/shop"
          />
        </section>
      </div>
    </>
  );
}