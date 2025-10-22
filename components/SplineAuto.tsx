// components/SplineAuto.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type CSSLen = number | string;

type Props = {
  /** URL Spline (my.spline.design/...) */
  src: string;

  /** Dimensions "design" (base de calcul) */
  designW?: number; // px
  designH?: number; // px

  /** Contrôle externe (optionnel) */
  scale?: number;                 // ✅ si fourni, SplineAuto n'auto-calcule pas
  containerHeight?: CSSLen;       // ✅ force la hauteur du conteneur si tu préfères
  offsetXPercent?: number;        // ✅ +15 décale à droite / -15 à gauche

  /** Espacement géré depuis la page (optionnel) */
  paddingTop?: CSSLen;            // ex: 0 | "8px" | "1rem"
  paddingBottom?: CSSLen;

  /** Apparence & comportement */
  className?: string;
  style?: React.CSSProperties;
  bg?: string;
  radius?: string;
  interactive?: boolean;

  /** Dorure (facultatif) */
  decorSrc?: string;
  decorScale?: number;
  decorMaxSizeVmin?: number;
  decorMaxSizePx?: number;
};

export default function SplineAuto({
  src,
  designW = 1200,
  designH = 700,

  // contrôle externe
  scale,
  containerHeight,
  offsetXPercent = 0,

  // padding externe
  paddingTop = 0,
  paddingBottom = 0,

  className = "",
  style,
  bg = "transparent",
  radius = "24px",
  interactive = false,

  decorSrc,
  decorScale = 1.6,
  decorMaxSizeVmin = 90,
  decorMaxSizePx = 1200,
}: Props) {
  const embedUrl = useMemo(() => toEmbedUrl(src), [src]);

  const outerRef = useRef<HTMLDivElement | null>(null);
  const [autoScale, setAutoScale] = useState(1);

  // ⚙️ Auto-scale (utilisé SEULEMENT si prop scale n'est pas fournie)
  useEffect(() => {
    if (typeof scale === "number") return; // contrôle externe actif → on ne calcule rien
    if (!outerRef.current) return;

    const compute = () => {
      const w = outerRef.current?.clientWidth ?? 0;
      const vh = window.innerHeight || 0;
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const s = isMobile ? (vh * 0.6) / designH : w / designW; // même logique qu'avant
      setAutoScale(s > 0 ? s : 1);
    };

    const ro = new ResizeObserver(compute);
    ro.observe(outerRef.current);
    window.addEventListener("resize", compute);
    compute();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [scale, designW, designH]);

  const effScale = typeof scale === "number" && scale > 0 ? scale : autoScale;
  const frameW = Math.round(designW * effScale);
  const frameH = Math.round(designH * effScale);

  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        // Hauteur du bloc dans le flux (pour que le padding soit visible)
        height: containerHeight ?? frameH,
        paddingTop,
        paddingBottom,

        background: bg,
        borderRadius: radius,
        overflow: "hidden",
        isolation: "isolate",
        ...style,
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
          }}
        >
          <img
            src={decorSrc}
            alt=""
            style={{
              transform: `scale(${decorScale})`,
              objectFit: "contain",
              maxWidth: `min(${decorMaxSizeVmin}vmin, ${decorMaxSizePx}px)`,
              maxHeight: `min(${decorMaxSizeVmin}vmin, ${decorMaxSizePx}px)`,
              filter: "blur(12px) brightness(1.1)",
              opacity: 0.85,
              position: "absolute",
            }}
          />
          <img
            src={decorSrc}
            alt="Décor doré Blossom"
            style={{
              transform: `scale(${decorScale})`,
              objectFit: "contain",
              maxWidth: `min(${decorMaxSizeVmin}vmin, ${decorMaxSizePx}px)`,
              maxHeight: `min(${decorMaxSizeVmin}vmin, ${decorMaxSizePx}px)`,
              position: "relative",
              zIndex: 1,
            }}
          />
        </div>
      )}

      {/* === Surface Spline centrée + offset horizontal === */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `calc(50% + ${offsetXPercent}%)`,
          transform: "translateX(-50%)",
          width: frameW,
          height: frameH,
          pointerEvents: interactive ? "auto" : "none",
          willChange: "transform",
          zIndex: 2,
        }}
      >
        <iframe
          src={embedUrl}
          title="Spline 3D"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
            pointerEvents: interactive ? "auto" : "none",
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