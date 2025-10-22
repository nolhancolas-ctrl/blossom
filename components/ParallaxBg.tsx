// components/ParallaxBg.tsx
"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Parallax non fixe, linéaire :
 * - largeur = 100vw (aucun zoom/crop ; ratio respecté)
 * - translation verticale proportionnelle au scroll global (linéaire)
 * - small sur mobile, big sur desktop (≥ 1024px)
 */
export default function ParallaxBg({ src }: { src: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Sélection auto de l'image (mobile-first)
  const [chosenSrc, setChosenSrc] = useState<string>("/background_small.jpg");

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const apply = () => setChosenSrc(mql.matches ? "/background_big.jpg" : "/background_small.jpg");
    apply();
    if (mql.addEventListener) {
      mql.addEventListener("change", apply);
      return () => mql.removeEventListener("change", apply);
    } else {
      // Safari < 14 fallback
      // @ts-ignore
      mql.addListener(apply);
      return () => {
        // @ts-ignore
        mql.removeListener(apply);
      };
    }
  }, []);

  // Dimensions intrinsèques de l'image sélectionnée
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    let raf = 0;

    // Précharge pour récupérer naturalWidth/Height
    const preload = new Image();
    preload.src = chosenSrc;
    preload.decoding = "async";
    preload.onload = () => {
      setNat({ w: preload.naturalWidth || 1, h: preload.naturalHeight || 1 });
      raf = requestAnimationFrame(update);
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { if (!raf) raf = requestAnimationFrame(update); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // premier tick (utile si cache)
    raf = requestAnimationFrame(update);

    function update() {
      raf = 0;
      const wrap = wrapRef.current;
      const el = imgRef.current;
      if (!wrap || !el || !nat) return;

      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || window.scrollY || 0;
      const vh = window.innerHeight || 0;
      const vw = window.innerWidth || 0;
      const docH = doc.scrollHeight;

      // Hauteur affichée (ratio respecté), aucun zoom forcé
      const displayH = (vw / nat.w) * nat.h;
      const overflow = Math.max(0, displayH - vh); // portion défilable visuelle

      // Progression de scroll 0..1 (LINÉAIRE)
      const maxScroll = Math.max(1, docH - vh);
      const p = Math.min(1, Math.max(0, scrollTop / maxScroll));

      // Translation linéaire : 0 (haut) -> -overflow (bas)
      const y = -overflow * p;

      // Applique
      el.style.transform = `translate3d(0, ${y}px, 0)`;
      wrap.style.width = `${vw}px`;
      wrap.style.height = `${vh}px`;
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [chosenSrc, nat]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        willChange: "transform",
        overflow: "hidden",
      }}
    >
      <img
        ref={imgRef}
        src={chosenSrc}
        alt=""
        onLoad={(e) => {
          // Sécurité : dimensions si l'image vient du cache
          const el = e.currentTarget;
          if (!nat) setNat({ w: el.naturalWidth || 1, h: el.naturalHeight || 1 });
        }}
        style={{
          width: "100vw",
          height: "auto",
          display: "block",
          willChange: "transform",
          transform: "translate3d(0, 0, 0)",
        }}
      />
    </div>
  );
}