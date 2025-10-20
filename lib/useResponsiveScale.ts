"use client";

import { useEffect, useRef, useState } from "react";

export function useResponsiveScale(
  designW: number,
  designH: number,
  startScaleAtAspect = 1 // 1 = seuil “carré”
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [boxH, setBoxH] = useState(designH);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const h = entry.contentRect.height || entry.target.clientHeight || designH;
      const aspect = w / Math.max(h, 1);

      // Tant que c’est paysage (aspect >= 1), pas de réduction
      if (aspect >= startScaleAtAspect) {
        setScale(1);
        setBoxH(designH);
        return;
      }

      // En carré/portrait → on scale pour tenir dans w ET h
      const s = Math.min(1, w / designW, h / designH);
      setScale(s);
      setBoxH(Math.round(designH * s));
    });

    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [designW, designH, startScaleAtAspect]);

  return { ref, scale, boxH };
}