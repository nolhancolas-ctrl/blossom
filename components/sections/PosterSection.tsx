// components/sections/PosterSection.tsx
"use client";

import PageSection from "@/components/layout/PageSection";
import Button from "@/components/ui/Button";
import { useLang } from "@/hooks/useLang";

type Props = {
  leftSrc: string;
  rightSrc: string;
  title: {
    en: string;
    fr: string;
  };
  ctaHref?: string;
  interactive?: boolean;
};

export default function PosterSection({
  leftSrc,
  rightSrc,
  title,
  ctaHref = "/shop/collection",
  interactive = false,
}: Props) {
  const { lang } = useLang(); // fr or en

  // Traductions locales
  const translations = {
    fr: {
      description: [
        "Disponible en tirages papier de haute qualité ou en posters métal via Displate, avec leur système d’accroche magnétique.",
        "Et en plus, pour celles-ci, pas besoin d’avoir la main verte. 😉"
      ],
      cta: "Voir tout"
    },
    en: {
      description: [
        "Printed either on thick art paper or as metal posters via Displate, ready to hang with their magnetic system.",
        "And unlike real plants, they survive even without a green thumb. 😉"
      ],
      cta: "See everything"
    }
  };

  const t = translations[lang];

  // Dimensions "design" des posters (fixes)
  const POSTER_W = 350;
  const POSTER_H = 400;
  const SAFE_PAD = 10;
  const CARD_W = POSTER_W + SAFE_PAD * 2;

  return (
    <PageSection>
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
          transition-all duration-500
          text-center
        "
      >
        {/* === TITRE === */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-slate-800 mb-6">
          {title[lang]}
        </h2>

        {/* === GRILLE DES POSTERS === */}
        <div
          className="
            w-full mt-[-20px] mb-[-20px]
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

        {/* === DESCRIPTION TRADUITE (plusieurs lignes) === */}
        <div className="text-slate-700/90 text-[0.95rem] sm:text-[1rem] mb-8 leading-relaxed max-w-xl mx-auto text-center-justify">
          {Array.isArray(t.description)
            ? t.description.map((line, i) => (
                <p key={i} className="mb-3 last:mb-0">
                  {line}
                </p>
              ))
            : <p>{t.description}</p>
          }
        </div>

        {/* === CTA === */}
        <Button as="a" href={ctaHref} variant="primary">
          {t.cta}
        </Button>
      </div>
    </PageSection>
  );
}

/* ==========================================================================
   POSTER CARD — oversize iframe pour cacher le logo Spline
   ========================================================================== */
type PosterCardProps = {
  src: string;
  w: number;
  h: number;
  interactive?: boolean;
};

function PosterCard({ src, w, h, interactive = false }: PosterCardProps) {
  const OVERSIZE_W_PCT = 108;
  const OVERSIZE_H_PCT = 122;

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        width: `${w}px`,
        height: `${h}px`,
      }}
    >
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
          transform: "translate(-7%, 0%)",
        }}
        allow="autoplay; fullscreen"
        allowFullScreen
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}