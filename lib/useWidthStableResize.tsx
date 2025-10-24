// lib/useWidthStableResize.ts
"use client";
import { useEffect, useRef, useState } from "react";

export function useWidthStableResize(nodeRef: React.RefObject<HTMLElement | null>) {
  const lastW = useRef<number>(-1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const el = nodeRef.current || document.documentElement;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      const w = Math.round(cr.width);
      if (Math.abs(w - lastW.current) >= 1) {
        lastW.current = w;
        setTick((n) => n + 1);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [nodeRef]);

  return tick; // change seulement si la largeur change réellement
}