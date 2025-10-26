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
  ctaHref = "/poster",
  className = "",
  interactive = false,
}: PosterSectionProps) {
  // ——— Gabarit identique à Mailing
  const MAX_W_CLASS = "max-w-2xl";

  // ——— Design posters (non-scalés)
  const POSTER_W = 350;
  const POSTER_H = 400;
  const SAFE_PAD = 10;            // latéral dans la box (anti-clipping)
  const GAP_DESIGN = 10;          // gap entre colonnes
  const POSTER_W_VISIBLE = POSTER_W + SAFE_PAD * 2;

  // Hauteur “design” du bloc de posters (1 rangée de 2 posters)
  const GRID_DESIGN_H = POSTER_H;

  // Ton décalage horizontal desktop conservé
  // (tu peux remettre ta valeur précédente si besoin)
  // NB: on ne l’utilise pas tel quel, car tu avais déjà
  // `translateX(-55%)` dans ta version desktop “parfaite”.
  // Je garde donc exactement cette valeur dans le transform desktop.
  const ROW_SHIFT_X_PX = -80;

  // ——— Scale basé sur la largeur utile interne (respecte px-14 comme Mailing)
  const outerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // breakpoints pour adapter transform/hauteur
  const [isMobile, setIsMobile] = useState(false); // <768px

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767.98px)");
    const apply = () => setIsMobile(mqMobile.matches);
    apply();
    mqMobile.addEventListener("change", apply);
    return () => mqMobile.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    let raf = 0;
    const mqMd = window.matchMedia("(min-width: 768px)");
    const compute = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = outerRef.current;
        if (!el) return;
        // largeur interne utile = clientWidth - padding gauche/droite
        const cs = window.getComputedStyle(el);
        const pl = parseFloat(cs.paddingLeft || "0");
        const pr = parseFloat(cs.paddingRight || "0");
        const hostW = Math.max(0, el.clientWidth - pl - pr);
        const cols = mqMd.matches ? 2 : 1; // md+ = 2 colonnes, sinon 1
        const totalDesignW = cols * POSTER_W_VISIBLE + (cols - 1) * GAP_DESIGN;
        const s = Math.max(0.5, Math.min(1.25, hostW / totalDesignW));
        setScale((prev) => (Math.abs(prev - s) > 1e-3 ? s : prev));
      });
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (outerRef.current) ro.observe(outerRef.current);
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

  // === Transform responsive :
  // Desktop/tablette : ta valeur existante (centrage + biais -55%)
  // Mobile : translateX(-4%) (on l’exprime par calc(-50% - 4%))
  const transformStr = isMobile
    ? `translateY(-5%) translateX(-37%) scale(${s})`
    : `translateY(-10%) translateX(-55%) scale(${s})`;

  // Réserve de hauteur : doublée sur mobile (posters empilés)
  const reservedHeight = GRID_DESIGN_H * (isMobile ? 2 : 1) * s;

  return (
    <section
      className={[
        // wrapper extérieur — même logique de margins/paddings que Mailing
        "relative flex items-center justify-center",
        "px-14 sm:px-10",                         // marges latérales (mobile/desktop) comme Mailing
        "py-16 sm:py-24 mt-16 sm:mt-24 mb-16 sm:mb-24",
        "w-full transition-all duration-500",
        className,
      ].join(" ")}
    >
      <div
        ref={outerRef}
        className={[
          "w-full mx-auto",
          MAX_W_CLASS,
          // fond/flou et esthétiques (identiques Mailing)
          "bg-white/10 md:bg-white/10",
          "backdrop-blur-none md:backdrop-blur-md",
          "border border-white/15 md:border-white/20",
          "shadow-[0_6px_24px_rgba(0,0,0,0.06)] md:shadow-[0_8px_40px_rgba(0,0,0,0.08)]",
          "rounded-2xl md:rounded-3xl",
          "px-6 py-10 md:px-14 md:py-16",
          "transition-all duration-500 text-center",
        ].join(" ")}
      >
        {/* Titre */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-slate-800 mb-4 sm:mb-6 text-center">
          {title}
        </h2>

        {/* Sous-texte */}
        <p className="text-[0.95rem] sm:text-[1rem] md:text-[1.15rem] text-slate-700/90 leading-relaxed mb-8 sm:mb-10 text-center text-justify">
          Lush botanical posters rendered in Spline — crisp, dimensional and print-ready vibes.
          A calm way to bring nature into your space.
        </p>

        {/* === RÉSERVE DE HAUTEUR (desktop = 1×, mobile = 2×) ===*/}
        <div className="relative w-full" style={{ height: `${reservedHeight}px` }}>
          <div
            className="absolute left-1/2 top-0"
            style={{
              transform: transformStr,
              transformOrigin: "top center",
              width: "fit-content",
              willChange: "transform",
            }}
          >
            {/* Grille “design” (2 colonnes en md+, 1 colonne en mobile) */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 relative"
              style={{
                columnGap: `${GAP_DESIGN}px`,
                rowGap: "0px",
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

        {/* CTA — collé visuellement grâce à la vraie hauteur au-dessus */}
        <div className="flex items-center justify-center mt-3 sm:mt-4">
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
      </div>
    </section>
  );
}

/** ——— PosterCard ——— */
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
  const OVERSIZE_W_PCT = 108; // zoom léger pour cacher les bords Spline
  const OVERSIZE_H_PCT = 122;
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        width: `${w + safePad * 2}px`,
        height: `${h}px`,
      }}
    >
      <div className="absolute inset-0">
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