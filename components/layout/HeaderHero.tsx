// components/layout/HeaderHero.tsx
"use client";

import Image from "next/image";

export default function HeaderHero() {
  return (
    <section className="site-section site-header-section relative z-10">
      {/* Desktop */}
      <div className="hidden sm:block w-screen overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <Image
          src="/header_wide.jpg"
          alt="Blossom header wide"
          width={5876}
          height={896}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* Mobile */}
      <div className="block sm:hidden w-screen overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <Image
          src="/header_small.jpg"
          alt="Blossom header small"
          width={5876}
          height={445}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
    </section>
  );
}