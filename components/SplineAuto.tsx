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

  /** Contrôles externes */
  scale?: number;            // si fourni, on n'auto-calcule plus
  renderScale?: number;      // 0.5..1 — réduit la résolution WebGL, upscale visuel (perf)

  containerHeight?: CSSLen;  // force la hauteur du conteneur

  /** Espacement (géré depuis la page) */
  paddingTop?: CSSLen;
  paddingBottom?: CSSLen;

  /** Apparence & comportement */
  className?: string;
  style?: React.CSSProperties;
  bg?: string;
  radius?: string;
  interactive?: boolean;

  /** Décor (fusion : une seule image floutée) */
  decorSrc?: string;
  decorScale?: number;
  decorBlurPx?: number;      // intensité de flou du décor fusionné
  decorMaxSizeVmin?: number; // limite responsive
  decorMaxSizePx?: number;   // limite absolue
};

export default function SplineAuto({

  src,
  designW = 1200,
  designH = 700,

  scale,
  renderScale = 0.6, // 1 = pleine résolution ; ex: 0.8 sur desktop si ça rame

  containerHeight,

  paddingTop = 0,
  paddingBottom = 0,

  className = "",
  style,
  bg = "transparent",
  radius = "24px",
  interactive = false,

  decorSrc,
  decorScale = 1.4,
  decorBlurPx = 0.2,         // flou global (fusion)
  decorMaxSizeVmin = 90,
  decorMaxSizePx = 1200,
}: Props) {
  const embedUrl = useMemo(() => toEmbedUrl(src), [src]);

  const outerRef = useRef<HTMLDivElement | null>(null);
  const [autoScale, setAutoScale] = useState(1);

  // Auto-scale uniquement si 'scale' n'est pas fourni.
  // Recalcule UNIQUEMENT quand la largeur viewport/host change ou quand le breakpoint mobile↔desktop change.
  useEffect(() => {
    if (typeof scale === "number") return; // contrôle externe actif
    if (!outerRef.current) return;

    const mq = window.matchMedia("(max-width: 768px)");
    let last = {
      iw: 0,                                  // window.innerWidth précédent
      w: 0,                                   // largeur du host précédente
      mobile: mq.matches,                     // état du breakpoint
    };

    const recompute = () => {
      const el = outerRef.current!;
      const iw = window.innerWidth || 0;
      const w = el.clientWidth || iw;
      const mobile = mq.matches;

      const widthChanged =
        Math.abs(w - last.w) > 0.5 || Math.abs(iw - last.iw) > 0.5;
      const bpChanged = mobile !== last.mobile;

      if (!widthChanged && !bpChanged) return;

      last = { iw, w, mobile };

      const vh = window.innerHeight || 0;
      // Mobile: on borne la hauteur à ~60% de l'écran ; Desktop: fit largeur
      const s = mobile ? (vh * 0.6) / designH : w / designW;
      setAutoScale((prev) => (Math.abs((s || 1) - prev) > 1e-3 ? (s || 1) : prev));
    };

    window.addEventListener("resize", recompute, { passive: true });
    mq.addEventListener?.("change", recompute);

    // premier calcul
    recompute();

    return () => {
      window.removeEventListener("resize", recompute);
      mq.removeEventListener?.("change", recompute);
    };
  }, [scale, designW, designH]);

  const effScale = typeof scale === "number" && scale > 0 ? scale : autoScale;

  // Taille affichée (visuelle)
  const displayW = Math.max(1, Math.round(designW * effScale));
  const displayH = Math.max(1, Math.round(designH * effScale));

  // Taille rendue (WebGL) — plus petite pour soulager le GPU, puis upscale CSS
  const pr = Math.max(0.5, Math.min(1, renderScale || 1)); // borne 0.5..1
  const renderW = Math.max(1, Math.round(displayW * pr));
  const renderH = Math.max(1, Math.round(displayH * pr));
  const upscale = 1 / pr; // ex. pr=0.8 → upscale=1.25

  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        // Hauteur réelle dans le flux (pour que padding/top/bottom soient visibles)
        height: containerHeight ?? displayH,
        paddingTop,
        paddingBottom,

        background: bg,
        borderRadius: radius,
        overflow: "hidden",
        isolation: "isolate",

        // Limite la propagation des invalidations (perf)
        contain: "layout paint size style",
        backfaceVisibility: "hidden",

        ...style,
      }}
    >
      {/* === Décor fusionné : une seule image floutée et légèrement opaque === */}
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
              filter: `blur(${decorBlurPx}px)`, // flou global
              opacity: 0.9,                      // opacité demandée
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
          left: `50.8%`,
          transform: `translateX(-50%) scale(${upscale})`, // upscale visuel (rend moins de pixels WebGL)
          transformOrigin: "top center",
          width: `${renderW}px`,  // rendu WebGL "réduit"
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
          loading="lazy" // laisse le navigateur init le contexte au bon moment
          allow="autoplay; fullscreen; xr-spatial-tracking; clipboard-read; clipboard-write"
          allowFullScreen
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