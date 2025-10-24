// components/ParallaxBg.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { JSX } from "react/jsx-runtime";

/** Parallax linéaire : mobile -> /background_small.jpg, desktop -> /background_big.jpg
 *  Aligne le haut du fond sous le header et termine pile au début du footer.
 */
export default function ParallaxBg(
  { small = "/background_small.jpg", big = "/background_big.jpg" }:
  { small?: string; big?: string } = {}
): JSX.Element {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef  = useRef<HTMLImageElement | null>(null);

  // Choix auto de la source
  const [chosenSrc, setChosenSrc] = useState<string>(small);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const apply = () => setChosenSrc(mql.matches ? big : small);
    apply();
    mql.addEventListener?.("change", apply);
    return () => mql.removeEventListener?.("change", apply);
  }, [small, big]);

  useEffect(() => {
    let raf = 0;

    // Précharge pour connaître naturalWidth/Height
    const preload = new Image();
    preload.src = chosenSrc;
    preload.decoding = "async";
    preload.onload = () => {
      setNat({ w: preload.naturalWidth || 1, h: preload.naturalHeight || 1 });
      raf = requestAnimationFrame(update);
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onLoad   = () => { if (!raf) raf = requestAnimationFrame(update); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onLoad);

    function getHeaderHeightPx(): number {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-site-header]"));
      let h = 0;
      for (const el of nodes) {
        const rect = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        if (rect.height > 0 && cs.display !== "none" && cs.visibility !== "hidden") {
          h = Math.max(h, rect.height);
        }
      }
      return h;
    }
    function getFooterHeightPx(): number {
      const el = document.querySelector<HTMLElement>("[data-site-footer]");
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      return rect.height >= 0 && cs.display !== "none" && cs.visibility !== "hidden"
        ? rect.height : 0;
    }

    function update() {
      raf = 0;
      const wrap = wrapRef.current;
      const img  = imgRef.current;
      if (!wrap || !img || !nat) return;

      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || window.scrollY || 0;
      const vh = window.innerHeight || 0;
      const vw = window.innerWidth  || 0;
      const docH = doc.scrollHeight;

      const displayH = (vw / nat.w) * nat.h;          // hauteur affichée (ratio respecté)
      const overflow = Math.max(0, displayH - vh);     // part défilable visuelle

      const headerH = getHeaderHeightPx();             // top aligné sous le header
      const footerH = getFooterHeightPx();             // fin au début du footer

      // plage utile = jusqu’au haut du footer
      const maxScroll = Math.max(1, (docH - footerH) - vh);
      const p = Math.min(1, Math.max(0, scrollTop / maxScroll)); // linéaire 0..1

      const yTop = headerH;
      const yBottom = -overflow;
      const y = yTop + (yBottom - yTop) * p;

      img.style.transform = `translate3d(0, ${y}px, 0)`;
      wrap.style.width = `${vw}px`;
      wrap.style.height = `${vh}px`;
    }

    // premier tick (utile si cache)
    raf = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [chosenSrc, nat]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ transform: "translateZ(0)" }}
    >
      <img
        ref={imgRef}
        src={chosenSrc}
        alt=""
        onLoad={(e) => {
          if (!nat) {
            const el = e.currentTarget;
            setNat({ w: el.naturalWidth || 1, h: el.naturalHeight || 1 });
          }
        }}
        style={{
          width: "100vw",
          height: "auto",
          display: "block",
          willChange: "transform",
          transform: "translate3d(0,0,0)",
        }}
      />
    </div>
  );
}