// components/BookSpline.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";

export type BookSplineProps = {
  /** URL Spline (ex: my.spline.design/...) */
  src: string;
  /** Dimensions “design” (base de calcul pour l’échelle par largeur) */
  designW?: number; // px
  designH?: number; // px
  /** Qualité de rendu WebGL (0.5..1) → réduit la résolution puis upscale CSS */
  renderScale?: number;
  /** Apparence & comportement */
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  /** Décor (image unique floutée) */
  decorSrc?: string;
  decorScale?: number;
  decorBlurPx?: number;
  decorMaxSizeVmin?: number;
  decorMaxSizePx?: number;
};

/**
 * BookSpline
 * - Scale **stable** basé uniquement sur la largeur (fit largeur).
 * - Pipeline rendu : renderScale (WebGL) + upscale CSS (perf).
 * - Le démarrage d'animation est géré **dans Spline** (ex: délai 2.5s).
 */
export default function BookSpline({
  src,
  designW = 1200,
  designH = 700,
  renderScale = 0.9,
  className = "",
  style,
  interactive = false,
  decorSrc,
  decorScale = 1.4,
  decorBlurPx = 0.2,
  decorMaxSizeVmin = 90,
  decorMaxSizePx = 1200,
}: BookSplineProps) {
  const embedUrl = useMemo(() => toEmbedUrl(src), [src]);

  // === Scale “width-only” (stable, pas de dépendance au vh mobile) ===
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const compute = () => {
      const w = hostRef.current?.clientWidth ?? window.innerWidth;
      const fitByW = w / designW;
      setScale(Math.max(0.1, fitByW));
    };
    const ro = new ResizeObserver(compute);
    const el = hostRef.current;
    if (el) ro.observe(el);
    window.addEventListener("resize", compute, { passive: true });
    compute();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [designW]);

  // === Dimensions “affichées” vs “rendues” (WebGL) ===
  const displayW = Math.max(1, Math.round(designW * scale));
  const displayH = Math.max(1, Math.round(designH * scale));
  const pr = Math.max(0.5, Math.min(1, renderScale || 1)); // borne 0.5..1
  const renderW = Math.max(1, Math.round(displayW * pr));
  const renderH = Math.max(1, Math.round(displayH * pr));
  const upscale = 1 / pr; // ex. 0.8 → 1.25

  return (
    <section
      className={[
        "relative z-0 w-full flex flex-col items-center justify-center",
        "mt-4 md:mt-12",
        "py-2 md:py-6 lg:py-10",
        "overflow-hidden",
        className,
      ].join(" ")}
      style={style}
    >
      <div
        ref={hostRef}
        className={[
          "relative z-0 flex justify-center pointer-events-none",
          // même gabarit visuel/clip qu’avant
          "h-[55svh] md:h-[76dvh] lg:h-[94dvh] w-full",
          "lg:[clip-path:inset(0_250px_0_250px)]",
        ].join(" ")}
        style={{
          position: "relative",
          width: "100%",
          isolation: "isolate",
          contain: "layout paint size style",
          backfaceVisibility: "hidden",
        }}
      >
        {/* === Décor flouté optionnel === */}
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
            }}
          >
            <img
              src={decorSrc}
              alt="Décor doré Blossom"
              style={{
                transform: `scale(${decorScale})`,
                transformOrigin: "center",
                objectFit: "contain",
                objectPosition: "center",
                maxWidth: `min(${decorMaxSizeVmin}vmin, ${decorMaxSizePx}px)`,
                maxHeight: `min(${decorMaxSizeVmin}vmin, ${decorMaxSizePx}px)`,
                filter: `blur(${decorBlurPx}px)`,
                opacity: 0.9,
                position: "relative",
                display: "block",
              }}
            />
          </div>
        )}

        {/* === Surface Spline centrée + upscale visuel === */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50.8%", // léger offset conservé
            transform: `translateX(-50%) scale(${upscale})`,
            transformOrigin: "top center",
            width: `${renderW}px`,  // rendu WebGL réduit
            height: `${renderH}px`,
            pointerEvents: interactive ? "auto" : "none",
            willChange: "transform",
            zIndex: 2,
          }}
        >
          <iframe
            src={embedUrl} // ← charge tout de suite
            title="Spline 3D"
            style={{
              width: "100%",
              height: "100%",
              border: 0,
              display: "block",
              pointerEvents: interactive ? "auto" : "none",
            }}
            loading="eager"
            allow="autoplay; fullscreen; xr-spatial-tracking; clipboard-read; clipboard-write"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

/** Normalise l’URL Spline et injecte des paramètres utiles si absents */
function toEmbedUrl(u: string) {
  try {
    const url = new URL(u);
    if (!url.searchParams.has("ui")) url.searchParams.set("ui", "0");
    if (!url.searchParams.has("autostart")) url.searchParams.set("autostart", "1"); // l’animation démarre, mais tu ajoutes 2.5s de délai DANS Spline
    if (!url.searchParams.has("transparent")) url.searchParams.set("transparent", "1");
    return url.toString();
  } catch {
    return u;
  }
}