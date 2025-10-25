// components/PosterSection.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

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
  // ——— Gabarit de section (un peu plus large que Mailing)
  const MAX_W_CLASS = "max-w-2xl";
  const PAD_CLASS = "px-14 sm:px-10";

  // ——— “Design” posters
  const POSTER_W = 350;
  const POSTER_H = 400;
  const GAP_DESIGN = 10;

  // ✅ marge de sécurité latérale (anti-clipping)
  const SAFE_PAD = 20; // 20px de chaque côté (augmente si besoin)
  const POSTER_W_VISIBLE = POSTER_W + SAFE_PAD * 2;

  const ROW_SHIFT_X_PX = -130; // small left bias (tweak: -8..-16)

  const outerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let raf = 0;
    const mqMd = window.matchMedia("(min-width: 768px)");

    const compute = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const hostW = outerRef.current?.clientWidth ?? window.innerWidth;
        const twoCols = mqMd.matches;
        const cols = twoCols ? 2 : 1;
        const totalDesignW = cols * POSTER_W_VISIBLE + (cols - 1) * GAP_DESIGN;
        const s = Math.max(0.5, Math.min(1.25, hostW / totalDesignW));
        setScale((prev) => (Math.abs(prev - s) > 1e-3 ? s : prev));
      });
    };

    compute();
    const ro = new ResizeObserver(compute);
    const el = outerRef.current;
    if (el) ro.observe(el);
    mqMd.addEventListener("change", compute);
    window.addEventListener("resize", compute, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      mqMd.removeEventListener("change", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const s = useMemo(() => (Number.isFinite(scale) && scale > 0 ? scale : 1), [scale]);

  return (
    <section
      className={[
        "relative z-10 w-full",
        "mx-auto",
        MAX_W_CLASS,
        PAD_CLASS,
        "rounded-2xl md:rounded-3xl",
        "bg-white/10 md:bg-white/10",
        "backdrop-blur-none md:backdrop-blur-md",
        "border border-white/15 md:border-white/20",
        "shadow-[0_6px_24px_rgba(0,0,0,0.06)] md:shadow-[0_8px_40px_rgba(0,0,0,0.08)]",
        "py-10 sm:py-12",
        className,
      ].join(" ")}
      aria-labelledby="poster-section-title"
    >
      <h2
        id="poster-section-title"
        className="text-3xl md:text-4xl font-medium tracking-tight text-slate-800 mb-4 text-center"
      >
        {title}
      </h2>

      <p className="max-w-2xl mx-auto text-center text-slate-700/90 text-[0.98rem] md:text-[1.05rem] leading-relaxed mb-3 md:mb-4">        Lush botanical posters rendered in Spline — crisp, dimensional and print-ready vibes.
        A calm way to bring nature into your space.
      </p>

      {/* Zone qui porte le scale */}
      <div ref={outerRef} className="w-full">
        <div
          className="mx-auto"
          style={{
            width: "fit-content",
            // before: transform: `scale(${s})`,
            transform: `translateX(${ROW_SHIFT_X_PX}px) scale(${s})`,
            transformOrigin: "center top",
          }}
        >
          {/* grille “design” */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 relative"
            style={{
              gap: `${GAP_DESIGN}px`,
              width: `calc(${POSTER_W_VISIBLE * 2 + GAP_DESIGN}px)`,
              maxWidth: "100%",
              paddingInline: 20,
            }}
          >
            <PosterCard
              w={POSTER_W}
              h={POSTER_H}
              safePad={SAFE_PAD}
              src={leftSrc}
              interactive={interactive}
            />
            <PosterCard
              w={POSTER_W}
              h={POSTER_H}
              safePad={SAFE_PAD}
              src={rightSrc}
              interactive={interactive}
            />
          </div>
        </div>
      </div>

      {/* CTA noir (style Mailing) */}
      <div className="flex items-center justify-center">
        <a
          href={ctaHref}
          className="relative inline-flex items-center justify-center h-12 sm:h-14 px-8 sm:px-10
                     rounded-xl border border-black/20 bg-black text-white font-medium
                     shadow-[0_2px_12px_rgba(0,0,0,0.15)] overflow-hidden group
                     transition-transform duration-300 hover:scale-[1.04] hover:shadow-[0_4px_25px_rgba(0,0,0,0.25)]"
          aria-label="See all posters"
        >
          <span className="relative z-10">See everything</span>
          <span
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent
                       opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-x-full group-hover:translate-x-full"
            style={{ animation: "buttonShine 2.5s ease-in-out infinite" }}
          />
        </a>
      </div>
    </section>
  );
}

/** PosterCard : conteneur élargi (SAFE_PAD) + clip-path latéral supprimé + offset réaliste */
function PosterCard({
  w,
  h,
  safePad = 20,
  src,
  title,
  interactive,
}: {
  w: number;
  h: number;
  safePad?: number;
  src: string;
  title?: string;
  interactive?: boolean;
}) {
  // 🔧 Paramètres de l’oversize & du décentrage (ajuste si besoin)
  const OVERSIZE_W_PCT = 108;  // largeur de l'iframe (%) — ex 108%
  const OVERSIZE_H_PCT = 122;  // hauteur de l'iframe (%) — ex 122%
  const SHIFT_X_PCT = 0;      // décentrage horizontal (%) — ex -2% (à gauche)
  const SHIFT_Y_PCT = 0;      // décentrage vertical (%) — ex -8% (vers le haut)

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        width: `${w + safePad * 2}px`,
        height: `${h}px`,
      }}
    >
      {/* ✅ on enlève le clip-path latéral : on ne coupe plus 14px à droite/gauche */}
      <div className="absolute inset-0 "
           style={{
                // garde un léger “masque” interne, mais la boîte externe est plus large désormais
                clipPath: "inset(0px 0px 0px 0px)",
           }}
      >
        <iframe
          src={src}
          title={title || "Spline 3D poster"}
          style={{
            position: "absolute",
            inset: 0,
            width: `${OVERSIZE_W_PCT}%`,
            height: `${OVERSIZE_H_PCT}%`,
            border: 0,
            pointerEvents: interactive ? "auto" : "none",
            objectFit: "cover",
          }}
          allow="autoplay; fullscreen"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}