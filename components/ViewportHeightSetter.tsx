// components/ViewportHeightSetter.tsx
"use client";
import { useEffect, useRef } from "react";

export default function ViewportHeightSetter() {
  const lastW = useRef<number>(-1);

  useEffect(() => {
    const setVH = () => {
      // update only when width changes or on explicit orientationchange
      const w = window.innerWidth;
      if (w !== lastW.current) {
        lastW.current = w;
        document.documentElement.style.setProperty("--vhpx", `${window.innerHeight}px`);
      }
    };

    // initial
    lastW.current = window.innerWidth;
    document.documentElement.style.setProperty("--vhpx", `${window.innerHeight}px`);

    const onResize = () => setVH();
    const onOrientation = () => {
      lastW.current = -1; // force update
      setVH();
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onOrientation);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
    };
  }, []);

  return null;
}