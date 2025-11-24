"use client";
import { useEffect, useRef, useState } from "react";

/**
 * 🌸 ParallaxBg — version corrigée
 * - Parfaite continuité du bas vers le haut
 * - Aucun jump sur mobile
 * - Ratio stable même si le contenu change
 */
export default function ParallaxBg({
  small = "/background_small.jpg",
  big = "/background_big.jpg",
}: {
  small?: string;
  big?: string;
}) {
  const [src, setSrc] = useState(big);
  const [offset, setOffset] = useState(0);
  const [ratio, setRatio] = useState(1);

  const imgRef = useRef<HTMLImageElement>(null);

  /* -------------------------------------------------------
   * 1) Choose small/big depending on aspect ratio
   * ------------------------------------------------------ */
  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 1/1)");
    const update = () => setSrc(mq.matches ? small : big);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [small, big]);

  /* -------------------------------------------------------
   * 2) Compute image travel distance (delta) & scroll span
   * ------------------------------------------------------ */
  const computeRatio = () => {
    const img = imgRef.current;
    if (!img) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight; // visible viewport height
    const bodyH = document.documentElement.scrollHeight; // more stable than body.scrollHeight

    const natRatio =
      (img.naturalHeight || 1) / (img.naturalWidth || 1);

    const imgH = vw * natRatio; // rendered height
    const delta = Math.max(0, imgH - vh); // how much image must move

    const scrollSpan = Math.max(1, bodyH - vh); // usable scroll

    setRatio(delta / scrollSpan);
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (img.complete) computeRatio();
    else img.addEventListener("load", computeRatio);

    window.addEventListener("resize", computeRatio);
    window.addEventListener("orientationchange", computeRatio);

    return () => {
      img.removeEventListener("load", computeRatio);
      window.removeEventListener("resize", computeRatio);
      window.removeEventListener("orientationchange", computeRatio);
    };
  }, [src]);

  /* -------------------------------------------------------
   * 3) Scroll → translate based on ratio
   * ------------------------------------------------------ */
  useEffect(() => {
    const updateOffset = () => {
      const y = window.scrollY || 0;
      setOffset(y * ratio);
    };
    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });
    return () => window.removeEventListener("scroll", updateOffset);
  }, [ratio]);

  /* -------------------------------------------------------
   * 4) Render bottom-aligned parallax image
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
          transform: `translateY(${offset}px)`,
          willChange: "transform",
        }}
      >
        <img
          ref={imgRef}
          src={src}
          alt=""
          style={{
            position: "absolute",
            bottom: 0, // start perfectly bottom-aligned
            left: 0,
            width: "100%",
            height: "auto",
            objectFit: "cover",
            objectPosition: "center bottom",
          }}
          fetchPriority="high"
        />
      </div>
    </div>
  );
}