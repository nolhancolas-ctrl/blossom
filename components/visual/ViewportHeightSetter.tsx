// components/visual/ViewportHeightSetter.tsx
"use client";

import { useEffect } from "react";

export default function ViewportHeightSetter() {
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty("--vhpx", `${window.innerHeight}px`);
    };

    setVH();
    window.addEventListener("resize", setVH, { passive: true });
    window.addEventListener("orientationchange", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  return null;
}