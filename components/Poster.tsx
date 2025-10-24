"use client";
import React from "react";

type PosterSectionProps = {
  leftSrc: string;
  rightSrc: string;
  title?: string;
  ctaHref?: string;
  className?: string;
  interactive?: boolean;
};

export default function PosterSection({
  leftSrc,
  rightSrc,
  title = "If you cannot take care of a plant, print one :)",
  ctaHref = "/posters",
  className = "",
  interactive = false,
}: PosterSectionProps) {
  return (
    <section
      className={`mx-auto max-w-6xl px-2 sm:px-4 mb-24 sm:mb-32 ${className}`}
      aria-labelledby="poster-section-title"
    >
      {/* === Titre === */}
      <h2
        id="poster-section-title"
        className="text-center text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-slate-800"
      >
        {title}
      </h2>

      {/* === Grille des deux affiches === */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 relative px-[20px]">
        <Poster3D src={leftSrc} title="3D Poster – Left" interactive={interactive} />
        <Poster3D src={rightSrc} title="3D Poster – Right" interactive={interactive} />
      </div>

      {/* === CTA “See everything” === */}
      <div className="mt-10 flex items-center justify-center">
        <a
          href={ctaHref}
          className="group glass-button glass-button-text relative h-12 sm:h-14 w-[clamp(4rem,10vw,8rem)]
                    flex items-center justify-center text-black transition-all duration-500"
          aria-label="See all posters"
        >
          <span className="relative z-10 font-light tracking-wide text-center">
            See everything
          </span>
        </a>
      </div>
      
    </section>
  );
}

/**
 * Poster3D – carte Spline 3D immersive
 * - flou doux et responsive
 * - iframe centrée optiquement (-1% X / -3% Y)
 * - étendue visuelle augmentée (104% / 120%)
 */
function Poster3D({
  src,
  title,
  interactive = false,
}: {
  src: string;
  title?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        bg-white/10 shadow-sm
        backdrop-blur-none md:backdrop-blur-[4px] lg:backdrop-blur-[8px]
        transition-all duration-700 px-[20px]
      `}
    >
      {/* Ratio 4:5 */}
      <div
        className="relative w-full [clip-path:inset(0_20px_60px_20px)]"
        style={{ paddingTop: "125%" }}
      >
        <iframe
          src={src}
          title={title || "Spline 3D poster"}
          className="absolute inset-0 w-[104%] h-[120%]"
          style={{
            border: 0,
            pointerEvents: interactive ? "auto" : "none",
            objectFit: "cover",
            transform: "translateX(-1%) translateY(-3%)",
          }}
          allow="autoplay; fullscreen; xr-spatial-tracking; clipboard-read; clipboard-write"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Liseré subtil */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/20" />
    </div>
  );
}

/* === Animations Apple-style === */
const style = `
@keyframes reflection {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;
if (typeof document !== "undefined" && !document.getElementById("poster-apple-style")) {
  const s = document.createElement("style");
  s.id = "poster-apple-style";
  s.textContent = style;
  document.head.appendChild(s);
}