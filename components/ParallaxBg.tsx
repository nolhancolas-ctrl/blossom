// components/ParallaxBg.tsx
"use client";

import { ParallaxProvider, ParallaxBanner, ParallaxBannerLayer } from "react-scroll-parallax";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * ParallaxBg
 * - Calque fixe plein écran derrière le contenu.
 * - Colle son haut juste sous le header visible (desktop/mobile).
 * - Image choisie selon aspect-ratio : < 1:1 -> small, sinon big.
 * - À utiliser DANS la page (pas dans le layout), placé juste après le header.
 */
export default function ParallaxBg({
  small = "/background_small.jpg",
  big = "/background_big.jpg",
  speed = -20,
}: {
  small?: string;
  big?: string;
  speed?: number;
}) {
  const [headerBottom, setHeaderBottom] = useState(0);

  useEffect(() => {
    const measure = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-site-header]"));
      let b = 0;
      for (const n of nodes) {
        const r = n.getBoundingClientRect();
        const cs = getComputedStyle(n);
        if (r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden") {
          b = Math.max(b, r.bottom);
        }
      }
      setHeaderBottom(Math.max(0, Math.min(b, window.innerHeight || 0)));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const offsetStyle = useMemo(() => ({ transform: `translateY(${headerBottom}px)` }), [headerBottom]);

  return (
    <ParallaxProvider>
      <ParallaxBanner
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          height: "100vh",
          zIndex: 0,            // derrière le header/contenu (z-10) et footer (z-20)
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <ParallaxBannerLayer speed={speed}>
          <div style={offsetStyle}>
            <picture>
              <source media="(max-aspect-ratio: 1/1)" srcSet={small} />
              <img
                src={big}
                alt=""
                style={{
                  width: "100vw",
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                  objectPosition: "center top",
                }}
                fetchPriority="high"
              />
            </picture>
          </div>
        </ParallaxBannerLayer>
      </ParallaxBanner>
    </ParallaxProvider>
  );
}