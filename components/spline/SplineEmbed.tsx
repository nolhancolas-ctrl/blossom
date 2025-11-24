"use client";

import { useMemo, useRef } from "react";

/**
 * SplineEmbed
 * -----------
 * Pure embed component.
 * Handles:
 * - Quality scaling (downscale internal resolution)
 * - Oversize cropping (wide iframe to hide Spline edges)
 * - Optional interactive pointer events
 * - Clean Spline URL normalization
 * - Internal shrink (bookInnerScale) for composition fidelity
 */

export type SplineEmbedProps = {
  src: string;
  q: number;                     // quality factor (0.3–1)
  oversizeCSS: string;           // computed oversize max-width
  bookInnerScale: number;        // internal scale (0.8)
  centerOffsetPct: number;       // horizontal offset for centering
  interactive: boolean;
  iframeScaleClass?: string;     // optional extra class (ex: "bs-mobile-shift")
};

export default function SplineEmbed({
  src,
  q,
  oversizeCSS,
  bookInnerScale,
  centerOffsetPct,
  interactive,
  iframeScaleClass = "",
}: SplineEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Normalise Spline URL
  const embedUrl = useMemo(() => toEmbedUrl(src), [src]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: `${centerOffsetPct * 100}%`,
        transform: "translateX(-50%)",
        transformOrigin: "top center",
        width: oversizeCSS,     // massive oversize to hide Spline edges
        height: "100%",
        pointerEvents: interactive ? "auto" : "none",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      {/* QUALITY WRAPPER */}
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
        {/* Internal resolution downscaled */}
        <div
          style={{ width: `${q * 100}%`, height: `${q * 100}%` }}
          className={iframeScaleClass}
        >
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
  );
}

/* Normalize Spline URL */
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