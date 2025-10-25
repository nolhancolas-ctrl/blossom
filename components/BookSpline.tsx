// components/BookSpline.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";

export type BookSplineProps = {
  src: string;
  designW?: number;
  designH?: number;
  renderScale?: number;
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  // Décor
  decorSrc?: string;
  decorScale?: number;
  decorBlurPx?: number;
  decorMaxSizePx?: number;
  decorWidthRatioDesktop?: number;
  decorWidthRatioSquare?: number;
  decorWidthRatioMobile?: number;
  // Taille/scale
  desktopScalePct?: number;
  /** ⇣ élargissement artificiel en pixels (chaque côté) — pour masquer + fort */
  extraSideCropPx?: number; // défaut ↑
  /** ⇣ élargissement artificiel en pourcentage du host (sécurité) */
  oversizePct?: number;     // défaut ↑
  /** ⇣ réglage fin du recentrage (0.5 = centré parfait) */
  centerOffsetPct?: number;
  // Compat/perf
  detachWhenOffscreen?: boolean;
  disableDecorBlurOnDesktop?: boolean;
  qualityPctDesktop?: number;
  qualityPctMobile?: number;
  maxScaleDesktop?: number;
  maxScaleMobile?: number;
};

export default function BookSpline({
  src,
  designW = 1200,
  designH = 700,
  renderScale = 0.4,
  decorScale = 1.5,
  decorBlurPx = 0.1,
  decorMaxSizePx = 1200,
  decorWidthRatioDesktop = 0.55,
  decorWidthRatioSquare = 0.4,
  decorWidthRatioMobile = 0.4,
  desktopScalePct = 0.8,
  /** 🔧 on masque beaucoup plus large par défaut */
  extraSideCropPx = 600,
  oversizePct = 1.6,
  centerOffsetPct = 0.48,
  detachWhenOffscreen = true,
  disableDecorBlurOnDesktop = true,
  qualityPctDesktop = 0.6,
  qualityPctMobile = 1.0,
  maxScaleDesktop = 0.9,
  maxScaleMobile = 0.88,
  className = "",
  style,
  interactive = false,
  decorSrc,
}: BookSplineProps) {
  const embedUrl = useMemo(() => toEmbedUrl(src), [src]);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Scale responsive (inchangé)
  const [scale, setScale] = useState(1);
  const vh0Ref = useRef<number>(0);
  useEffect(() => { if (!vh0Ref.current) vh0Ref.current = window.innerHeight || 0; }, []);

  useEffect(() => {
    let lastInnerW = window.innerWidth;
    let raf = 0;
    const computeNow = () => {
      raf = 0;
      const hostW = hostRef.current?.clientWidth ?? window.innerWidth;
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const ar = vw / vh;
      const widthFit = hostW / designW;
      const widthFitDesktopReduced = widthFit * Math.max(0.1, Math.min(1, desktopScalePct));
      const mobileFit = (Math.max(1, vh0Ref.current) * 0.6) / designH;
      let target: number;
      if (ar > 1.05) target = widthFitDesktopReduced;
      else if (ar < 0.95) target = mobileFit;
      else {
        const t = (ar - 0.95) / (1.05 - 0.95);
        target = mobileFit * (1 - t) + widthFitDesktopReduced * t;
      }
      const cap = ar > 1.05 ? maxScaleDesktop : maxScaleMobile;
      const s = Math.max(0.1, Math.min(cap, target));
      setScale((prev) => (Math.abs(prev - s) > 1e-4 ? s : prev));
    };
    const compute = () => { if (!raf) raf = requestAnimationFrame(computeNow); };
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width || 0;
      if (w > 0) compute();
    });
    const el = hostRef.current;
    if (el) ro.observe(el);
    const onOrientation = () => compute();
    const onResizeWidthOnly = () => {
      const wNow = window.innerWidth;
      if (Math.abs(wNow - lastInnerW) >= 1) { lastInnerW = wNow; compute(); }
    };
    compute();
    window.addEventListener("orientationchange", onOrientation);
    window.addEventListener("resize", onResizeWidthOnly, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("orientationchange", onOrientation);
      window.removeEventListener("resize", onResizeWidthOnly);
    };
  }, [designW, designH, desktopScalePct, maxScaleDesktop, maxScaleMobile]);

  // Qualité (downscale pur)
  const [qualityPct, setQualityPct] = useState(qualityPctDesktop);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023.98px)");
    const apply = () => setQualityPct(mql.matches ? qualityPctMobile : qualityPctDesktop);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [qualityPctDesktop, qualityPctMobile]);
  const q = Math.max(0.3, Math.min(1, qualityPct));

  // Décor
  const displayW = Math.round(designW * scale);
  const ar =
    typeof window !== "undefined" ? (window.innerWidth || 1) / (window.innerHeight || 1) : 1.2;
  const decorRatio =
    ar > 1.05 ? decorWidthRatioDesktop : ar < 0.95 ? decorWidthRatioMobile : decorWidthRatioSquare;
  const decorWidthPx = Math.min(decorMaxSizePx, Math.max(180, Math.round(displayW * decorRatio)));
  const effectiveDecorBlur =
    disableDecorBlurOnDesktop &&
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches
      ? 0
      : decorBlurPx;

  // ⚙️ Sur-élargissement + masque (le plus simple et robuste)
  const oversizeCSS = `max(calc(100% + ${extraSideCropPx * 2}px), ${oversizePct * 100}%)`;

  // Shrink interne du livre (ton choix précédent)
  const bookInnerScale = 0.8;

  return (
    <section
      className={[
        "relative z-0 w-full flex flex-col items-center justify-center overflow-hidden m-clamp",
        className,
      ].join(" ")}
      style={style}
    >
      <div
        ref={hostRef}
        className={[
          "relative z-0 flex justify-center pointer-events-none w-full",
          "h-55vhpx md:h-76vhpx lg:h-94vhpx",
        ].join(" ")}
        style={{
          position: "relative",
          isolation: "isolate",
          contain: "layout paint size style",
          backfaceVisibility: "hidden",
          overflow: "hidden", // ⬅️ masque dur des côtés
        }}
      >
        {/* Décor */}
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
              transform: "translateY(12%)",
            }}
          >
            <img
              src={decorSrc}
              alt="Décor doré Blossom"
              style={{
                width: `${decorWidthPx}px`,
                height: "auto",
                transform: `scale(${decorScale})`,
                objectFit: "contain",
                objectPosition: "center",
                filter: effectiveDecorBlur ? `blur(${effectiveDecorBlur}px)` : "none",
                opacity: 0.9,
              }}
            />
          </div>
        )}

        {/* Surface Spline élargie, centrée, cropée par le host */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${centerOffsetPct * 100}%`, // ex: 48%
            transform: "translateX(-50%)",
            transformOrigin: "top center",
            width: oversizeCSS,   // ⬅️ beaucoup plus large
            height: "100%",
            pointerEvents: interactive ? "auto" : "none",
            zIndex: 2,
          }}
        >
          {/* wrapper qualité + shrink livre */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              transform: `scale(${(1 / q) * bookInnerScale})`,
              transformOrigin: "top center",
              willChange: "transform",
            }}
          >
            <div style={{ width: `${q * 100}%`, height: `${q * 100}%` }}>
              <iframe
                ref={iframeRef}
                src={embedUrl}
                title="Spline 3D"
                style={{
                  width: "100%",
                  height: "100%",
                  border: 0,
                  display: "block",
                  pointerEvents: interactive ? "auto" : "none",
                  contain: "layout paint size style",
                }}
                loading="lazy"
                allow="autoplay; fullscreen"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function toEmbedUrl(u: string) {
  try {
    const url = new URL(u);
    if (!url.searchParams.has("ui")) url.searchParams.set("ui", "0");
    if (!url.searchParams.has("autostart")) url.searchParams.set("autostart", "1");
    if (!url.searchParams.has("transparent")) url.searchParams.set("transparent", "1");
    return url.toString();
  } catch {
    return u;
  }
}