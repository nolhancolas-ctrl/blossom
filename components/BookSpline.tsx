// components/BookSpline.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";

export type BookSplineProps = {
  src: string;
  designW?: number;
  designH?: number;
  renderScale?: number; // 0.5..1 (résolution WebGL)
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  decorSrc?: string;
  decorScale?: number;        // multiplicateur visuel (optionnel)
  decorBlurPx?: number;
  decorMaxSizePx?: number;    // plafond absolu du décor
  /** Largeur du décor = ratio * displayW (selon bucket d’aspect) */
  decorWidthRatioDesktop?: number; // défaut 0.55
  decorWidthRatioSquare?: number;  // défaut 0.70 (≈ moyenne)
  decorWidthRatioMobile?: number;  // défaut 0.95 (plus généreux)
};

export default function BookSpline({
  src,
  designW = 1200,
  designH = 700,
  renderScale = 0.9,
  className = "",
  style,
  interactive = false,
  decorSrc,
  decorScale = 1.0,
  decorBlurPx = 0.2,
  decorMaxSizePx = 1200,
  decorWidthRatioDesktop = 0.55,
  decorWidthRatioSquare = 0.70,
  decorWidthRatioMobile = 0.95,
}: BookSplineProps) {
  const embedUrl = useMemo(() => toEmbedUrl(src), [src]);

  const hostRef = useRef<HTMLDivElement | null>(null);

  /** scale unique pour tout le composant (livre + décor) */
  const [scale, setScale] = useState(1);

  // On capture une seule fois la "small viewport height" approximative (VH₀)
  const vh0Ref = useRef<number>(0);
  useEffect(() => {
    if (!vh0Ref.current) {
      // On capture la hauteur dispo au montage et on ne la re-touche plus (évite le wobble mobile)
      vh0Ref.current = window.innerHeight || 0;
    }
  }, []);

  useEffect(() => {
    // Buckets d’aspect : desktop (>1), square (~1), mobile tall (≤1)
    const mqSquareLo = window.matchMedia("(min-aspect-ratio: 1/1)");
    const mqSquareHi = window.matchMedia("(max-aspect-ratio: 1/1)");

    const compute = () => {
      const w = hostRef.current?.clientWidth ?? window.innerWidth;
      const ar = (window.innerWidth || 1) / (window.innerHeight || 1); // aspect courant
      const widthFit = w / designW; // scale desktop

      // scale mobile basée sur "60% de l'écran" mais figée à VH₀
      const mobileFit = (Math.max(1, vh0Ref.current) * 0.60) / designH;

      // interpolation douce autour de 1:1 pour éviter le jump
      let target: number;
      if (ar > 1.05) {
        // Desktop “paysage”
        target = widthFit;
      } else if (ar < 0.95) {
        // Mobile “tall”
        target = mobileFit;
      } else {
        // Zone ~1:1 → moyenne pondérée entre desktop et mobile
        const t = (ar - 0.95) / (1.05 - 0.95); // 0..1
        target = mobileFit * (1 - t) + widthFit * t;
      }

      // clamp de sécurité
      const s = Math.max(0.1, Math.min(3, target));
      setScale(s);
    };

    const ro = new ResizeObserver(() => {
      // On ne recalcule que si la largeur change vraiment (évite recompute en scroll mobile)
      compute();
    });

    const el = hostRef.current;
    if (el) ro.observe(el);

    // On suit surtout les changements d’orientation; le resize “scroll” est ignoré par ro si width stable
    window.addEventListener("orientationchange", compute);
    window.addEventListener("resize", compute, { passive: true });

    compute();

    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", compute);
      window.removeEventListener("resize", compute);
    };
  }, [designW, designH]);

  // === Dimensions affichées (livre) vs rendues (WebGL) ===
  const displayW = Math.max(1, Math.round(designW * scale));
  const displayH = Math.max(1, Math.round(designH * scale));

  const pr = Math.max(0.5, Math.min(1, renderScale || 1));
  const renderW = Math.max(1, Math.round(displayW * pr));
  const renderH = Math.max(1, Math.round(displayH * pr));
  const upscale = 1 / pr;

  // === Décor : suit displayW, avec ratio selon bucket d’aspect ===
  const ar = (typeof window !== "undefined")
    ? (window.innerWidth || 1) / (window.innerHeight || 1)
    : 1.2;
  const decorRatio =
    ar > 1.05 ? decorWidthRatioDesktop
      : ar < 0.95 ? decorWidthRatioMobile
      : decorWidthRatioSquare;

  const decorWidthPx = Math.min(
    decorMaxSizePx,
    Math.max(180, Math.round(displayW * decorRatio))
  );

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
          // hauteurs visuelles du “cadre” (ne pilotent pas la scale)
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
        {/* === Décor stabilisé (suit la même scale que le livre) === */}
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
                width: `${decorWidthPx}px`,
                height: "auto",
                transform: `scale(${decorScale})`, // optionnel, constant
                transformOrigin: "center",
                objectFit: "contain",
                objectPosition: "center",
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
            left: "50.8%",
            transform: `translateX(-50%) scale(${upscale})`,
            transformOrigin: "top center",
            width: `${renderW}px`,
            height: `${renderH}px`,
            pointerEvents: interactive ? "auto" : "none",
            willChange: "transform",
            zIndex: 2,
          }}
        >
          <iframe
            src={embedUrl}
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