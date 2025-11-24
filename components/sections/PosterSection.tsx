// components/sections/PosterSection.tsx
"use client";

import PageSection from "@/components/layout/PageSection";
import Button from "@/components/ui/Button";

type Props = {
  leftSrc: string;
  rightSrc: string;
  title: string;
  ctaHref?: string;
  interactive?: boolean;
};

export default function PosterSection({
  leftSrc,
  rightSrc,
  title,
  ctaHref = "/poster",
  interactive = false,
}: Props) {
  // Dimensions "design" des posters (fixes)
  const POSTER_W = 350;
  const POSTER_H = 400;
  const SAFE_PAD = 10; // marge interne pour ne pas clipper
  const CARD_W = POSTER_W + SAFE_PAD * 2;

  return (
    <PageSection>
      {/* 📦 Carte extérieure — même logique que MailingSection */}
      <div
        className="
          w-full max-w-2xl mx-auto
          bg-white/10 md:bg-white/10
          backdrop-blur-none md:backdrop-blur-md
          border border-white/15 md:border-white/20
          shadow-[0_6px_24px_rgba(0,0,0,0.06)]
          md:shadow-[0_8px_40px_rgba(0,0,0,0.08)]
          rounded-2xl md:rounded-3xl
          px-6 py-10 md:px-14 md:py-16
          text-center transition-all duration-500
        "
      >
        {/* === TITRE (non scalé) === */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-slate-800 mb-6">
          {title}
        </h2>

        {/* === GRILLE DES POSTERS (taille FIXE, seulement layout qui change) === */}
        <div
          className="
            w-full mb-8
            grid gap-4
            grid-cols-1 md:grid-cols-2
            items-center justify-items-center
          "
          style={{
            transform: "scale(0.85)",
            transformOrigin: "top center",
          }}
        >
          <PosterCard
            src={leftSrc}
            w={CARD_W}
            h={POSTER_H}
            interactive={interactive}
          />
          <PosterCard
            src={rightSrc}
            w={CARD_W}
            h={POSTER_H}
            interactive={interactive}
          />
        </div>

        {/* === CTA (non scalé) === */}
        <Button as="a" href={ctaHref} variant="primary">
          See everything
        </Button>
      </div>
    </PageSection>
  );
}

/* ==========================================================================
   POSTER CARD — taille fixe + oversize de l'iframe pour cacher le logo Spline
   ========================================================================== */

type PosterCardProps = {
  src: string;
  w: number;      // largeur totale de la carte (incl. SAFE_PAD)
  h: number;      // hauteur fixe de la carte
  interactive?: boolean;
};

function PosterCard({ src, w, h, interactive = false }: PosterCardProps) {
  const OVERSIZE_W_PCT = 108; // zoom léger en largeur
  const OVERSIZE_H_PCT = 122; // zoom léger en hauteur

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        width: `${w}px`,
        height: `${h}px`,
      }}
    >
      {/* Wrapper oversize qui étend la surface Spline pour couper le bas (logo) */}
      <iframe
        src={src}
        title="Spline 3D poster"
        style={{
          position: "absolute",
          inset: 0,
          width: `${OVERSIZE_W_PCT}%`,
          height: `${OVERSIZE_H_PCT}%`,
          border: 0,
          pointerEvents: interactive ? "auto" : "none",
          objectFit: "cover",
          transform: "translate(-7%, 0%)", // petit décalage vers le haut pour cacher le logo
        }}
        allow="autoplay; fullscreen"
        allowFullScreen
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}