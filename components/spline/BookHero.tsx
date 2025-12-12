"use client";
import { useEffect, useRef, useState } from "react";
import SplineEmbed from "./SplineEmbed";

/**
 * BookHero
 * --------
 * Gère :
 * - le scale responsive (mobile / tablette / desktop)
 * - le host container (h-55vhpx / h-76vhpx / h-94vhpx)
 * - le décor (dorure)
 * - le crop oversize
 */
export type BookHeroProps = {
  src: string;
  // DESIGN DIMENSIONS
  designW?: number;
  designH?: number;
  // DECOR
  decorSrc?: string;
  decorScale?: number;
  decorBlurPx?: number;
  decorMaxSizePx?: number;
  decorWidthRatioDesktop?: number;
  decorWidthRatioSquare?: number;
  decorWidthRatioMobile?: number;
  // SCALE & LAYOUT
  desktopScalePct?: number;
  maxScaleDesktop?: number;
  maxScaleMobile?: number;
  centerOffsetPct?: number;
  // CROP
  extraSideCropPx?: number;
  oversizePct?: number;
  // QUALITY
  qualityPctDesktop?: number;
  qualityPctMobile?: number;
  disableDecorBlurOnDesktop?: boolean;
  // GENERAL
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function BookHero({
  src,
  designW = 1200,
  designH = 700,
  // decor
  decorSrc,
  decorBlurPx = 0.1,
  decorMaxSizePx = 1200,
  decorWidthRatioDesktop = 0.55,
  decorWidthRatioSquare = 0.4,
  decorWidthRatioMobile = 0.4,
  // scale (🔁 ajustés pour un livre plus grand)
  desktopScalePct = 1.05,
  maxScaleDesktop = 1.25,  
  maxScaleMobile = 0.78,   
  centerOffsetPct = 0.48,
  // oversize cropping
  extraSideCropPx = 600,
  oversizePct = 1.6,
  // quality
  qualityPctDesktop = 0.6,
  qualityPctMobile = 1.0,
  disableDecorBlurOnDesktop = true,
  interactive = false,
  className = "",
  style,
}: BookHeroProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // On “fige” la hauteur de référence au premier render (utile pour mobile)
  const vh0Ref = useRef<number>(0);
  useEffect(() => {
    if (!vh0Ref.current) vh0Ref.current = window.innerHeight || 0;
  }, []);

  /* ---------------------------- Responsive scale ---------------------------- */
  useEffect(() => {
    let lastInnerW = window.innerWidth;
    let raf = 0;

    const computeNow = () => {
      raf = 0;

      const hostW = hostRef.current?.clientWidth ?? window.innerWidth;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const ar = vw / vh; // aspect ratio écran

      const widthFit = hostW / designW;
      const widthFitDesktopReduced = widthFit * desktopScalePct;

      // 🔁 Mobile : on utilise plus de hauteur qu’avant (0.75 au lieu de 0.6)
      const mobileFit = (vh0Ref.current * 0.65) / designH;

      let target: number;
      if (ar > 1.05) {
        // écran plutôt “paysage”
        target = widthFitDesktopReduced;
      } else if (ar < 0.95) {
        // écran plutôt “portrait” (smartphone)
        target = mobileFit;
      } else {
        // zone intermédiaire (carrée) → interpolation
        const t = (ar - 0.95) / (1.05 - 0.95);
        target = mobileFit * (1 - t) + widthFitDesktopReduced * t;
      }

      // 🔁 Boost léger pour les écrans moyens (tablette / 13")
      const isTabletLike = vw >= 768 && vw < 1200;
      if (isTabletLike) {
        target *= 1.06; // +6% de taille sur ces écrans
      }

      const cap = ar > 1.05 ? maxScaleDesktop : maxScaleMobile;
      const s = Math.max(0.1, Math.min(cap, target));
      setScale((prev) => (Math.abs(prev - s) > 1e-4 ? s : prev));
    };

    const compute = () => {
      if (!raf) raf = requestAnimationFrame(computeNow);
    };

    const ro = new ResizeObserver(() => compute());
    const el = hostRef.current;
    if (el) ro.observe(el);

    const onResizeWidthOnly = () => {
      const wNow = window.innerWidth;
      if (Math.abs(wNow - lastInnerW) >= 1) {
        lastInnerW = wNow;
        compute();
      }
    };

    compute();
    window.addEventListener("orientationchange", compute);
    window.addEventListener("resize", onResizeWidthOnly);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("orientationchange", compute);
      window.removeEventListener("resize", onResizeWidthOnly);
    };
  }, [designW, designH, desktopScalePct, maxScaleDesktop, maxScaleMobile]);

  /* ---------------------------- Dynamic QUALITY ---------------------------- */
  const [qualityPct, setQualityPct] = useState(qualityPctDesktop);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023.98px)");
    const apply = () =>
      setQualityPct(mql.matches ? qualityPctMobile : qualityPctDesktop);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [qualityPctDesktop, qualityPctMobile]);

  const q = Math.max(0.3, Math.min(1, qualityPct));

  /* ------------------------------- Oversize crop ------------------------------- */
  const oversizeCSS = `max(calc(100% + ${
    extraSideCropPx * 2
  }px), ${oversizePct * 100}%)`;
  const bookInnerScale = 0.8;

  /* ------------------------------- Decor sizing ------------------------------- */
  const displayW = Math.round(designW * scale);

  const ar =
    typeof window !== "undefined"
      ? window.innerWidth / (window.innerHeight || 1)
      : 1.2;

  const decorRatio =
    ar > 1.05
      ? decorWidthRatioDesktop
      : ar < 0.95
      ? decorWidthRatioMobile
      : decorWidthRatioSquare;

  const decorWidthPx = Math.min(
    decorMaxSizePx,
    Math.max(180, Math.round(displayW * decorRatio))
  );

  const effectiveDecorBlur =
    disableDecorBlurOnDesktop &&
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches
      ? 0
      : decorBlurPx;

  return (
    <section
      className={[
        "relative z-0 w-full flex flex-col items-center justify-center overflow-hidden",
        className,
      ].join(" ")}
      style={style}
    >
      <div
        ref={hostRef}
        className="relative z-0 flex justify-center pointer-events-none w-full h-55vhpx md:h-76vhpx lg:h-94vhpx"
        style={{
          overflow: "hidden",
          position: "relative",
          contain: "layout paint size style",
          backfaceVisibility: "hidden",
          isolation: "isolate",
        }}
      >
        {/* DECOR */}
        {decorSrc && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
              zIndex: 0,
              transform: "translateY(7%)",
            }}
          >
            <img
              src={decorSrc}
              style={{
                width: decorWidthPx,
                height: "auto",
                transform: `scale(${ar > 1.05 ? 2.2 : 1.5})`,
                objectFit: "contain",
                objectPosition: "center",
                filter: effectiveDecorBlur
                  ? `blur(${effectiveDecorBlur}px)`
                  : "none",
                opacity: 0.9,
              }}
            />
          </div>
        )}

        {/* EMBED (via new component) */}
        <SplineEmbed
          src={src}
          q={q}
          oversizeCSS={oversizeCSS}
          bookInnerScale={bookInnerScale}
          centerOffsetPct={centerOffsetPct}
          interactive={interactive}
          iframeScaleClass="bs-mobile-shift"
        />
      </div>
    </section>
  );
}