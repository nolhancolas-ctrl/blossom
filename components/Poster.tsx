// components/Poster.tsx
import React from "react";

type PosterSectionProps = {
  leftSrc: string;   // URL Spline (my.spline.design/...)
  rightSrc: string;  // URL Spline (my.spline.design/...)
  title?: string;
  ctaHref?: string;
  className?: string;
  interactive?: boolean; // true si tu veux laisser l'iframe cliquable
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
      className={`mx-auto max-w-6xl px-4 sm:px-6 mb-24 sm:mb-32 ${className}`}
      aria-labelledby="poster-section-title"
    >
      {/* Titre */}
      <h2
        id="poster-section-title"
        className="text-center text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-slate-800"
      >
        {title}
      </h2>

      {/* Grille des 2 posters (côte à côte desktop, empilés mobile) */}
      <div className="mt-5 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <Poster3D
          src={leftSrc}
          title="3D Poster – Left"
          interactive={interactive}
        />
        <Poster3D
          src={rightSrc}
          title="3D Poster – Right"
          interactive={interactive}
        />
      </div>

      {/* CTA type champ d'email */}
      <div className="mt-6 sm:mt-8 flex items-center justify-center">
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/80 shadow-sm px-4 sm:px-5 py-2 sm:py-2.5 hover:shadow-md transition hover:bg-white/90 text-[13px] sm:text-[14px] font-normal text-slate-800 tracking-wide"
          aria-label="See all posters"
        >
          See everything
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-black/10">
            →
          </span>
        </a>
      </div>
    </section>
  );
}

/** Carte contenant l'embed Spline, avec ratio 4:5 et débordements propres */
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
    <div className="group relative overflow-hidden rounded-2xl bg-white/10 shadow-sm backdrop-blur-[4px]">
      {/* Conteneur ratio 4:5 (125%) pour un rendu “affiche” */}
      <div className="relative w-full" style={{ paddingTop: "125%" }}>
        <iframe
          src={src}
          title={title || "Spline 3D poster"}
          className="absolute inset-0 h-full w-full"
          style={{ border: 0, pointerEvents: interactive ? "auto" : "none" }}
          allow="autoplay; fullscreen; xr-spatial-tracking; clipboard-read; clipboard-write"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Liseré subtil type “carte” */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />

      {/* Hover léger (cohérent avec le footer) */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/0 via-black/0 to-black/0" />
    </div>
  );
}