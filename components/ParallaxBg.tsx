"use client";
import { useEffect, useRef, useState } from "react";
import { mx_bilerp_0 } from "three/src/nodes/materialx/lib/mx_noise.js";

/**
 * 🌸 ParallaxBg — auto-fit 1:1 (sans header)
 * - L'image se déroule exactement du bas au haut sur tout le scroll.
 * - Aucune dépendance au header : calque plein écran (top:0).
 */
export default function ParallaxBg({
  small = "/background_small.jpg",
  big = "/background_big.jpg",
}: {
  small?: string;
  big?: string;
}) {
  const [src, setSrc] = useState(big);
  const [offset, setOffset] = useState(0);     // déplacement en px
  const [ratio, setRatio] = useState(1);       // intensité auto
  const imgRef = useRef<HTMLImageElement>(null);

  // Choix de l’image selon le ratio d’écran
  useEffect(() => {
    const mql = window.matchMedia("(max-aspect-ratio: 1/1)");
    const update = () => setSrc(mql.matches ? small : big);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [small, big]);

  // Calcule le ratio body/background (auto-fit parfait)
  useEffect(() => {
    const computeRatio = () => {
      const bodyH = document.body.scrollHeight;
      const visibleH = window.innerHeight;
      const vw = window.innerWidth;
      const imgEl = imgRef.current;
      if (!imgEl) return;

      const natRatio = (imgEl.naturalHeight || 1) / (imgEl.naturalWidth || 1);
      const imgH = vw * natRatio;                  // hauteur affichée (width:100vw)
      const delta = Math.max(0, imgH - visibleH);  // distance totale à parcourir

      const scrollSpan = Math.max(1, bodyH - visibleH);
      setRatio(delta / scrollSpan);                // intensité = delta / scroll
    };

    const imgEl = imgRef.current;
    if (imgEl?.complete) computeRatio();
    else imgEl?.addEventListener("load", computeRatio);

    window.addEventListener("resize", computeRatio);
    window.addEventListener("load", computeRatio);
    return () => {
      window.removeEventListener("resize", computeRatio);
      window.removeEventListener("load", computeRatio);
      imgEl?.removeEventListener("load", computeRatio);
    };
  }, [src]);

  // Défilement : l’image monte proportionnellement au scroll
  useEffect(() => {
    const onScroll = () => {
      const y = (window.scrollY || 0) * ratio;
      setOffset(y);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ratio]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,           // le header/contenu au-dessus (z-10+)
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Seul ce wrapper bouge */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${offset}px)`, // haut de l'image atteint le haut en bas de page
          willChange: "transform",
        }}
      >
        <img
          ref={imgRef}
          src={src}
          alt=""
          style={{
            position: "absolute",
            bottom: 0,         // démarre collé en bas du viewport
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