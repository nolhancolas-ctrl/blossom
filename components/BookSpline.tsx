// components/BookSpline.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Composant d’affichage du livre (embed Spline) avec :
 * - scale responsive (desktop = width-fit * desktopScalePct ; mobile = basé sur la hauteur initiale du viewport)
 * - centrage horizontal fin via centerOffsetPct (ex: 0.48)
 * - masque latéral “oversize” pour éviter de voir les bords de l’iframe
 * - qualité dynamique (downscale) selon le breakpoint
 * - décor optionnel centré derrière l’iframe
 */
export type BookSplineProps = {
  src: string;

  // Gabarit de la scène Spline (taille de design)
  designW?: number;
  designH?: number;

  // (non utilisé dans cette version mais conservé pour compat)
  renderScale?: number;

  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;

  // Décor optionnel (image en arrière-plan du livre)
  decorSrc?: string;
  decorScale?: number;
  decorBlurPx?: number;
  decorMaxSizePx?: number;
  decorWidthRatioDesktop?: number;
  decorWidthRatioSquare?: number;
  decorWidthRatioMobile?: number;

  // Taille / scale
  desktopScalePct?: number;

  /** ⇣ élargissement en pixels (chaque côté) — renforce le masquage latéral */
  extraSideCropPx?: number;

  /** ⇣ élargissement en pourcentage du host (sécurité si le crop px ne suffit pas) */
  oversizePct?: number;

  /** ⇣ réglage fin du recentrage horizontal (0.5 = centré parfait) */
  centerOffsetPct?: number;

  // Compat/perf & qualité
  detachWhenOffscreen?: boolean;           // (non utilisé ici, conservé pour compat)
  disableDecorBlurOnDesktop?: boolean;
  qualityPctDesktop?: number;
  qualityPctMobile?: number;
  maxScaleDesktop?: number;
  maxScaleMobile?: number;
};

export default function BookSpline({
  src,
  // dimensions “design” de la scène Spline
  designW = 1200,
  designH = 700,

  // déco
  renderScale = 0.4, // (non utilisé)
  decorScale = 1.5,
  decorBlurPx = 0.1,
  decorMaxSizePx = 1200,
  decorWidthRatioDesktop = 0.55,
  decorWidthRatioSquare = 0.4,
  decorWidthRatioMobile = 0.4,

  // scale
  desktopScalePct = 0.8,

  /* 🔧 masque latéral agressif par défaut (robuste contre les bords Spline) */
  extraSideCropPx = 600,
  oversizePct = 1.6,

  // décalage horizontal léger (garde ta compo d’origine)
  centerOffsetPct = 0.48,

  // perf & qualité
  detachWhenOffscreen = true, // (non utilisé)
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
  // URL Spline nettoyée (UI off, autoplay, transparence)
  const embedUrl = useMemo(() => toEmbedUrl(src), [src]);

  const hostRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  /** ===== Scale responsive =====
   * Desktop : widthFit * desktopScalePct (plafonné par maxScaleDesktop)
   * Mobile  : basé sur la hauteur initiale de viewport (vh0) * 0.6 / designH (plafonné par maxScaleMobile)
   * Zone quasi-carrée : interpolation douce entre mobileFit et desktopFit
   */
  const [scale, setScale] = useState(1);
  const vh0Ref = useRef<number>(0);

  // Mémorise la hauteur initiale du viewport (utile pour mobileFit)
  useEffect(() => {
    if (!vh0Ref.current) vh0Ref.current = window.innerHeight || 0;
  }, []);

  useEffect(() => {
    let lastInnerW = window.innerWidth;
    let raf = 0;

    const computeNow = () => {
      raf = 0;

      const hostW = hostRef.current?.clientWidth ?? window.innerWidth;
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const ar = vw / vh;

      // Desktop : s’adapte à la largeur dispo
      const widthFit = hostW / designW;
      const widthFitDesktopReduced = widthFit * Math.max(0.1, Math.min(1, desktopScalePct));

      // Mobile : s’appuie sur la hauteur initiale du viewport (stable)
      const mobileFit = (Math.max(1, vh0Ref.current) * 0.6) / designH;

      let target: number;
      if (ar > 1.05) {
        // ratio large ⇒ desktop
        target = widthFitDesktopReduced;
      } else if (ar < 0.95) {
        // ratio étroit ⇒ mobile
        target = mobileFit;
      } else {
        // zone carrée : interpolation entre mobile et desktop
        const t = (ar - 0.95) / (1.05 - 0.95);
        target = mobileFit * (1 - t) + widthFitDesktopReduced * t;
      }

      const cap = ar > 1.05 ? maxScaleDesktop : maxScaleMobile;
      const s = Math.max(0.1, Math.min(cap, target));
      setScale((prev) => (Math.abs(prev - s) > 1e-4 ? s : prev));
    };

    const compute = () => { if (!raf) raf = requestAnimationFrame(computeNow); };

    // Observe les variations de largeur du host (plus fiable que le window resize seul)
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width || 0;
      if (w > 0) compute();
    });

    const el = hostRef.current;
    if (el) ro.observe(el);

    const onOrientation = () => compute();

    // On ne recalcule que s’il y a un vrai changement de largeur
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

  /** ===== Qualité dynamique (downscale) =====
   * Desktop : affiche à qualityPctDesktop
   * Mobile  : qualityPctMobile
   */
  const [qualityPct, setQualityPct] = useState(qualityPctDesktop);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023.98px)");
    const apply = () => setQualityPct(mql.matches ? qualityPctMobile : qualityPctDesktop);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [qualityPctDesktop, qualityPctMobile]);
  const q = Math.max(0.3, Math.min(1, qualityPct));

  /** ===== Décor : dimensionné proportionnellement à la largeur affichée ===== */
  const displayW = Math.round(designW * scale);
  const ar =
    typeof window !== "undefined" ? (window.innerWidth || 1) / (window.innerHeight || 1) : 1.2;

  const decorRatio =
    ar > 1.05 ? decorWidthRatioDesktop
              : ar < 0.95 ? decorWidthRatioMobile
                          : decorWidthRatioSquare;

  const decorWidthPx = Math.min(
    decorMaxSizePx,
    Math.max(180, Math.round(displayW * decorRatio))
  );

  // Désactive le blur déco sur desktop si demandé
  const effectiveDecorBlur =
    disableDecorBlurOnDesktop &&
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches
      ? 0
      : decorBlurPx;

  /** ===== Masque latéral “oversize” : élargit l’iframe au-delà du host ===== */
  const oversizeCSS = `max(calc(100% + ${extraSideCropPx * 2}px), ${oversizePct * 100}%)`;

  /** ===== Shrink interne du livre (ta valeur préférée pour garder la compo) ===== */
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
          // Hauteurs responsives (via custom units css --vhpx dans ton projet)
          "h-55vhpx md:h-76vhpx lg:h-94vhpx",
        ].join(" ")}
        style={{
          position: "relative",
          isolation: "isolate",
          contain: "layout paint size style",
          backfaceVisibility: "hidden",
          overflow: "hidden", // masque dur des côtés
        }}
      >
        {/* === Décor (optionnel) === */}
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

        {/* === Surface Spline élargie, centrée horizontalement (top-center), cropée par le host === */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${centerOffsetPct * 100}%`, // ex: 48%
            transform: "translateX(-50%)",
            transformOrigin: "top center",
            width: oversizeCSS,     // très large pour éviter de voir les bords
            height: "100%",
            pointerEvents: interactive ? "auto" : "none",
            zIndex: 2,
          }}
        >
          {/* Wrapper qualité + shrink interne (garde la compo tout en baissant la qualité réelle) */}
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

/** Normalise l’URL Spline pour un embed clean (pas d’UI, autoplay, fond transparent) */
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