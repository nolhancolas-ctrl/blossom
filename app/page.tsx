// app/page.tsx
"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import PosterSection from "@/components/Poster";
import BookSpline from "@/components/BookSpline";
import ParallaxBg from "@/components/ParallaxBg";

const Countdown3D = dynamic(() => import("@/components/Countdown3D"), { ssr: false });

export default function Home() {
  const launch = "2025-12-01T10:00:00+09:00";

  return (
    <>
      {/* === SECTION HEADER (au-dessus du parallax) === */}
      <section className="relative z-10">
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

      {/* === PARALLAX (fixe, juste après le header, derrière tout) === */}
      <ParallaxBg small="/background_small.jpg" big="/background_big.jpg" />

      {/* === CONTENU AU-DESSUS DU PARALLAX === */}
      <div className="relative z-10">
        {/* LIVRE 3D */}
        <BookSpline
          src="https://my.spline.design/blossombookanimated-RABoYJaWjZ6evsgSlU4VgfI4/"
          decorSrc="/dorure.webp"
          designW={1200}
          designH={700}
          renderScale={0.6}
        />

        {/* COMPTEUR */}
        <section
          className="w-full flex flex-col items-center justify-center
                     mt-6 md:mt-8 lg:mt-10
                     py-[clamp(0px,0.8vw,12px)]
                     [@media(max-aspect-ratio:1/1)]:py-0"
        >
          <div className="grid place-items-center">
            <Countdown3D target={launch} size="lg" />
          </div>
        </section>

        {/* SECTION INSCRIPTION EMAIL */}
        <section className="w-full flex flex-col items-center justify-center mt-20 pb-20 text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-6 text-slate-700 font-[Cormorant_Garamond]">
            Wanna know when the book is available?
          </h2>
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md rounded-full px-3 py-2 shadow-md border border-slate-300/40">
            <input
              type="email"
              placeholder="e.mail"
              className="bg-transparent text-slate-700 placeholder-slate-400 px-4 py-2 rounded-full outline-none font-light w-56 sm:w-72"
            />
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-400 text-slate-600 bg-white/60 backdrop-blur-sm shadow-sm hover:bg-[#f8f5f1] hover:scale-105 hover:shadow-lg hover:border-slate-600 transition-all duration-300">
              ▶
            </button>
          </div>
        </section>

        {/* POSTERS */}
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