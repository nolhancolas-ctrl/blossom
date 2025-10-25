// components/BookSpline.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";

export type BookSplineProps = {
  src: string;
  designW?: number;
  designH?: number;
  /** Taille de rendu du viewer (n’influence PAS l’iframe, gardé pour compat) */
  renderScale?: number;
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;

  // Décor
  decorSrc?: string;
  decorScale?: number;
  decorBlurPx?: number;          // 0.1 par défaut (mobile ok)
  decorMaxSizePx?: number;
  decorWidthRatioDesktop?: number;
  decorWidthRatioSquare?: number;
  decorWidthRatioMobile?: number;

  // Taille du livre en desktop (multiplicatif, clamp externe garde la main)
  desktopScalePct?: number;      // 0.8 = -20%

  // Crop dur (chaque côté)
  extraSideCropPx?: number;      // 200px → +400px de largeur interne

  /** (legacy) – on ignore désormais ce flag mais on le laisse pour compat */
  detachWhenOffscreen?: boolean;

  /** Désactiver automatiquement le blur du décor en desktop (≥1024px) */
  disableDecorBlurOnDesktop?: boolean;
};

export default function BookSpline({
  src,
  designW = 1200,
  designH = 700,

  // Tes valeurs actuelles
  renderScale = 0.4,
  decorScale = 1.5,
  decorBlurPx = 0.1,
  decorMaxSizePx = 1200,
  decorWidthRatioDesktop = 0.55,
  decorWidthRatioSquare = 0.4,
  decorWidthRatioMobile = 0.4,
  desktopScalePct = 0.8,
  extraSideCropPx = 200,
  // NOTE: on conserve la prop pour compat mais elle n’est plus utilisée
  detachWhenOffscreen = true,
  disableDecorBlurOnDesktop = true,

  className = "",
  style,
  interactive = false,
  decorSrc,
}: BookSplineProps) {
  const embedUrl = useMemo(() => toEmbedUrl(src), [src]);

  const hostRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Scale unique & stable (width-only + bucket 1:1), sans wobble mobile
  const [scale, setScale] = useState(1);
  const vh0Ref = useRef<number>(0);
  useEffect(() => {
    if (!vh0Ref.current) vh0Ref.current = window.innerHeight || 0;
  }, []);

  // Recalc scale UNIQUEMENT si la largeur varie (ou orientation)
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
        const t = (ar - 0.95) / (1.05 - 0.95); // 0..1
        target = mobileFit * (1 - t) + widthFitDesktopReduced * t;
      }

      const s = Math.max(0.1, Math.min(3, target));
      setScale((prev) => (Math.abs(prev - s) > 1e-4 ? s : prev));
    };

    const compute = () => { if (!raf) raf = requestAnimationFrame(computeNow); };

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width || 0;
      // micro-seuil pour ignorer les micro-jitters
      if (Math.abs(w) > 0.5) compute();
    });

    const el = hostRef.current;
    if (el) ro.observe(el);

    const onOrientation = () => compute();
    const onResizeWidthOnly = () => {
      const wNow = window.innerWidth;
      if (Math.abs(wNow - lastInnerW) >= 1) {
        lastInnerW = wNow;
        compute();
      }
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
  }, [designW, designH, desktopScalePct]);

  // Dimensions affichées
  const displayW = Math.round(designW * scale);
  const displayH = Math.round(designH * scale);

  // Décor responsive (lié à displayW)
  const ar =
    typeof window !== "undefined"
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

  // Blur décor optionnel en desktop
  const effectiveDecorBlur =
    disableDecorBlurOnDesktop &&
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches
      ? 0
      : decorBlurPx;

  // Largeur intérieure élargie, crop dur via overflow (même rendu visuel que chez toi)
  const oversizeCSS = `calc(100% + ${extraSideCropPx * 2}px)`;

  return (
    <section
      className={[
        "relative z-0 w-full flex flex-col items-center justify-center overflow-hidden m-clamp",
        className,
      ].join(" ")}
      style={style}
    >
      {/* Host : taille imposée par le clamp, masque les bords */}
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
          overflow: "hidden", // crop dur
        }}
      >
        {/* Décor (statique) */}
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
                transform: `scale(${decorScale})`,
                transformOrigin: "center",
                objectFit: "contain",
                objectPosition: "center",
                filter: effectiveDecorBlur ? `blur(${effectiveDecorBlur}px)` : "none",
                opacity: 0.9,
              }}
            />
          </div>
        )}

        {/* Surface Spline élargie localement, centrée, croppée par le host */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "48%", // ton recentrage fin
            transform: "translateX(-50%)",
            transformOrigin: "top center",
            width: oversizeCSS,     // +400px mais sans agrandir le layout du host
            height: "100%",
            pointerEvents: interactive ? "auto" : "none",
            zIndex: 2,
          }}
        >
          <iframe
            ref={iframeRef}
            // ✅ Toujours monté, plus de about:blank
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
    </section>
  );
}

function toEmbedUrl(u: string) {
  try {
    const url = new URL(u);
    if (!url.searchParams.has("ui")) url.searchParams.set("ui", "0");
    if (!url.searchParams.has("autostart")) url.searchParams.set("autostart", "1"); // tu gères le délai d’anim dans Spline
    if (!url.searchParams.has("transparent")) url.searchParams.set("transparent", "1");
    return url.toString();
  } catch {
    return u;
  }
}