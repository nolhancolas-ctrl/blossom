// components/SplineAuto.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  /** URL Spline (my.spline.design/...) */
  src: string;

  /** Zone “design” (sert de base au calcul responsive) */
  designW?: number; // px
  designH?: number; // px

  /** Classes utilitaires appliquées au conteneur externe */
  className?: string;

  /** Style visuel du conteneur */
  bg?: string;
  radius?: string;

  /** Interaction Spline (false = pointer-events: none) */
  interactive?: boolean;

  /** --- Dorure (facultatif) --- */
  decorSrc?: string;       // ex: "/dorure.webp"
  decorScale?: number;     // 1.6 = 160%
  decorMaskInner?: number; // % net avant fondu (0..100) ex: 80
  decorEdgeBlurPx?: number;// flou bords (ex: 2)
  decorMaxSizeVmin?: number; // limite responsive (ex: 90 → 90vmin)
  decorMaxSizePx?: number;   // limite absolue (ex: 1200)
};

export default function SplineAuto({
  src,
  designW = 1200,
  designH = 700,
  className = "",
  bg = "transparent",
  radius = "24px",
  interactive = false,

  // Dorure – valeurs par défaut
  decorSrc,
  decorScale = 1.6,
  decorMaskInner = 80,
  decorEdgeBlurPx = 2,
  decorMaxSizeVmin = 90,
  decorMaxSizePx = 1200,
}: Props) {
  const embedUrl = useMemo(() => toEmbedUrl(src), [src]);
  const outerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // Calcule un scale responsive :
  // - Desktop: scale selon largeur disponible
  // - Mobile: hauteur = 60% de la hauteur d’écran (pour éviter un 3D trop haut)
  useEffect(() => {
    if (!outerRef.current) return;

    const compute = (containerW: number) => {
      const vh = window.innerHeight || 0;
      const hFit = (vh * 0.6) / designH; // mobile: 60% de l'écran
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      return isMobile ? hFit : containerW / designW;
    };

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width ?? outerRef.current?.clientWidth ?? designW;
      setScale(compute(w));
    });

    ro.observe(outerRef.current);

    const onResize = () => {
      if (!outerRef.current) return;
      setScale(compute(outerRef.current.clientWidth));
    };
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [designW, designH]);

  // Dimensions réelles après scale
  const scaledW = Math.round(designW * scale);
  const scaledH = Math.round(designH * scale);

  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        width: "100%",
        height: `${scaledH}px`, // hauteur du flux (évite les jumps)
        background: bg,
        borderRadius: radius,
        overflow: "clip",
        position: "relative",
        isolation: "isolate",
        zIndex:0,
      }}
    >
      {/* === DÉCOR DORÉ (optionnel) — centré en largeur & hauteur === */}
      {decorSrc && (
        <div
          aria-hidden
          className="pointer-events-none select-none"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)", // centre parfait
            zIndex: 0,
          }}
        >
          {/* Couche floutée (halo doré diffus) */}
          <img
            src={decorSrc}
            alt=""
            style={{
              transform: `scale(${decorScale})`,
              transformOrigin: "center",
              objectFit: "contain",
              objectPosition: "center",
              maxWidth: `min(${decorMaxSizeVmin}vmin, ${decorMaxSizePx}px)`,
              maxHeight: `min(${decorMaxSizeVmin}vmin, ${decorMaxSizePx}px)`,
              filter: "blur(12px) brightness(1.1)", // 🌟 flou total et léger renforcement de la lumière
              opacity: 0.85, // rend le halo plus doux
              display: "block",
              position: "absolute",
              inset: 0,
              margin: "auto",
              zIndex: 0,
            }}
          />
          
          {/* Couche nette au-dessus (traits intacts) */}
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
              opacity: 1,
              display: "block",
              position: "relative",
              zIndex: 1,
            }}
          />
        </div>
      )}

      {/* === SURFACE Spline — centrée HORIZONTALEMENT === */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: `${scaledW}px`,
          height: `${scaledH}px`,
          willChange: "width, height, transform",
          zIndex: 2, // ✅ reste sous le reste du contenu
          pointerEvents: "none", // ✅ bloque toute capture d’interaction
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
            pointerEvents: "none", // ✅ sûr à 100%
            position: "relative",
            zIndex: 0,
          }}
          allow="autoplay; fullscreen; xr-spatial-tracking; clipboard-read; clipboard-write"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

/** Normalise l’URL Spline et injecte des paramètres utiles si absents */
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