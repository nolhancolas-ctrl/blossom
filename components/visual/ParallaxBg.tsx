"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/hooks/useLang";

export default function ParallaxBg({
  small = "/background_small.jpg",
  big = "/background_big.jpg",
}: {
  small?: string;
  big?: string;
}) {
  const { lang } = useLang();

  const [src, setSrc] = useState(small);
  const [offset, setOffset] = useState(0);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const metricsRef = useRef({
    delta: 0,
  });

  const scrollMaxRef = useRef<number | null>(null);

  /* --------------------------------------------------------
   * 0) Choose small / big
   * ------------------------------------------------------ */
  useEffect(() => {
    const mql = window.matchMedia("(max-aspect-ratio: 1/1)");
    const update = () => setSrc(mql.matches ? small : big);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [small, big]);

  /* --------------------------------------------------------
   * 1) Compute metrics ONCE (scrollMax frozen)
   * ------------------------------------------------------ */
  const compute = () => {
    const img = imgRef.current;
    if (!img) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const natRatio = (img.naturalHeight || 1) / (img.naturalWidth || 1);
    const imgH = vw * natRatio;

    const delta = Math.max(0, imgH - vh);
    metricsRef.current.delta = delta;

    // Freeze scrollMax if not defined
    if (scrollMaxRef.current === null) {
      scrollMaxRef.current = Math.max(
        1,
        document.documentElement.scrollHeight - vh
      );
    }

    const y = window.scrollY;
    const t = Math.max(
      0,
      Math.min(1, y / scrollMaxRef.current)
    );
    setOffset(delta * t);
  };

  /* --------------------------------------------------------
   * 2) Setup
   * ------------------------------------------------------ */
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (img.complete) compute();
    else img.addEventListener("load", compute);

    window.addEventListener("resize", () => {
      scrollMaxRef.current = null; // recalc
      compute();
    });

    window.addEventListener("orientationchange", () => {
      scrollMaxRef.current = null;
      compute();
    });

    // recalcul après changement de langue (DOM modifié)
    setTimeout(() => {
      scrollMaxRef.current = null;
      compute();
    }, 150);

    return () => {
      img?.removeEventListener("load", compute);
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, [src, lang]);

  /* --------------------------------------------------------
   * 3) Scroll listener
   * ------------------------------------------------------ */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (scrollMaxRef.current === null) return;

      const { delta } = metricsRef.current;
      const t = Math.max(0, Math.min(1, y / scrollMaxRef.current));

      setOffset(delta * t);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --------------------------------------------------------
   * 4) Render
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
            bottom: 0,
            width: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}