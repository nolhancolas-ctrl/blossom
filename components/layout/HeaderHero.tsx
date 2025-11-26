// components/layout/HeaderHero.tsx
"use client";

import Image from "next/image";
import Navbar from "./Navbar";

export default function HeaderHero() {
  return (
    <header
      className="
        relative w-full 
        z-[5000]      /* assez haut pour passer au-dessus du parallax */
        overflow-hidden
      "
    >
      {/* NAVBAR OVERLAY */}
      <div
        className="
          absolute top-4 right-4 
          z-[9999]
        "
      >
        <Navbar />
      </div>

      {/* DESKTOP IMAGE */}
      <div className="hidden sm:block w-full overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <Image
          src="/header_wide.jpg"
          alt="Blossom header wide"
          width={5876}
          height={896}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* MOBILE IMAGE */}
      <div className="block sm:hidden w-full overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <Image
          src="/header_small.jpg"
          alt="Blossom header small"
          width={5876}
          height={445}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
    </header>
  );
}