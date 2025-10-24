"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import PosterSection from "@/components/Poster";
import BookSpline from "@/components/BookSpline";
import ParallaxBg from "@/components/ParallaxBg";
import MailingSection from "@/components/MailingSection";

const Countdown3D = dynamic(() => import("@/components/Countdown3D"), { ssr: false });

export default function Home() {
  const launch = "2025-12-01T10:00:00+09:00";

  return (
    <>

      {/* === HEADER SECTION === */}
      <section className="site-section site-header-section relative z-10">
        {/* Header large (desktop) */}
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

        {/* Header mobile */}
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

      {/* === PARALLAX FIXE === */}
      <ParallaxBg
        small="/background_small.jpg"
        big="/background_big.jpg"
      />

      {/* === MAIN CONTENT === */}
      <div className="relative z-10">
        {/* === LIVRE 3D === */}
        <section className="site-section">
          <BookSpline
            src="https://my.spline.design/blossombookanimated-RABoYJaWjZ6evsgSlU4VgfI4/"
            decorSrc="/dorure.webp"
            designW={1200}
            designH={700}
            renderScale={0.6}
          />
        </section>

        {/* === COMPTEUR === */}
        <section className="site-section text-center">
          <div className="grid place-items-center mt-4">
            <Countdown3D target={launch} size="lg" />
          </div>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-slate-800 mb-6 text-center">
             Until Blossom Blooms
          </h2>

        </section>

        {/* === MAILING SECTION === */}
        <section className="site-section">
          <MailingSection />
        </section>

        {/* === POSTERS === */}
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