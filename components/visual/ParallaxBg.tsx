"use client";
import { useEffect, useRef, useState } from "react";

/**
 * 🌸 ParallaxBg (version finale)
 *
 * ✔ Utilise small/big selon aspect-ratio
 * ✔ Aucun saut sur mobile (hauteur stable via --vhpx)
 * ✔ Bas du fond collé au bas de l’écran au scroll=0
 * ✔ Haut du fond collé au haut de l’écran au scroll max
 * ✔ Fond monte quand on scroll →
 */

export default function ParallaxBg({
  small = "/background_small.jpg",
  big = "/background_big.jpg",
}: {
  small?: string;
  big?: string;
}) {
  const [src, setSrc] = useState(small);
  const [offset, setOffset] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const metricsRef = useRef({
    delta: 0,     // distance totale à parcourir
    scrollMax: 1, // scroll total "utile"
  });

  /** -------------------------------------------------------
   * 0) Sélection dynamique small/big selon aspect ratio
   * ------------------------------------------------------ */
  useEffect(() => {
    const mql = window.matchMedia("(max-aspect-ratio: 1/1)");
    const update = () => {
      setSrc(mql.matches ? small : big);
    };
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [small, big]);

  /** -------------------------------------------------------
   * 1) Calcule la hauteur image vs hauteur viewport stable
   * ------------------------------------------------------ */
  const recomputeMetrics = () => {
    const img = imgRef.current;
    if (!img || typeof window === "undefined") return;

    const vw = window.innerWidth || 1;
    const vhStable = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--vhpx")
    ) || window.innerHeight;

    const natRatio =
      (img.naturalHeight || 1) / (img.naturalWidth || 1);

    const imgH = vw * natRatio;        // rendu final
    const delta = Math.max(0, imgH - vhStable);

    const docH = document.documentElement.scrollHeight;
    const scrollMax = Math.max(1, docH - vhStable);

    metricsRef.current = { delta, scrollMax };

    // recalcul de l'offset courant
    const y = window.scrollY || 0;
    const t = Math.max(0, Math.min(1, y / scrollMax));
    setOffset(-delta * t);
  };

  /** -------------------------------------------------------
   * 2) Setup sur load + resize
   * ------------------------------------------------------ */
  useEffect(() => {
    const img = imgRef.current;

    if (img) {
      if (img.complete) recomputeMetrics();
      else img.addEventListener("load", recomputeMetrics);
    }

    window.addEventListener("resize", recomputeMetrics);
    window.addEventListener("orientationchange", recomputeMetrics);

    // recalcul différé après layout
    const id = setTimeout(recomputeMetrics, 500);

    return () => {
      img?.removeEventListener("load", recomputeMetrics);
      window.removeEventListener("resize", recomputeMetrics);
      window.removeEventListener("orientationchange", recomputeMetrics);
      clearTimeout(id);
    };
  }, [src]);

  /** -------------------------------------------------------
   * 3) Scroll → on fait monter le fond
   * ------------------------------------------------------ */
  useEffect(() => {
    const onScroll = () => {
      const { delta, scrollMax } = metricsRef.current;
      const y = window.scrollY || 0;
      const t = Math.max(0, Math.min(1, y / scrollMax));
      setOffset(-delta * t); // <— fond MONTE quand on scroll
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** -------------------------------------------------------
   * 4) Rendu
   * ------------------------------------------------------ */
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${-offset}px)`,
          willChange: "transform",
        }}
      >
        <img
          ref={imgRef}
          src={src}
          alt=""
          style={{
            position: "absolute",
            bottom: 0,  // scroll=0 → bas collé
            left: 0,
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "cover",
            objectPosition: "center bottom",
          }}
          fetchPriority="high"
        />
      </div>
    </div>
  );
}