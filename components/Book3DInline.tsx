// components/Book3DInline.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// SplineAuto est client (ou rendu côté client)
const SplineAuto = dynamic(() => import("@/components/SplineAuto"), { ssr: false });

export default function Book3DInline() {
  const designW = 1200;
  const designH = 700;

  const hostRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () => {
      const w = hostRef.current?.clientWidth ?? window.innerWidth;
      const vh = window.innerHeight || 0;
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      const fitByW = w / designW;
      const fitByH = (vh * 0.6) / designH; // 60% d'écran en mobile
      setScale(isMobile ? Math.max(0.1, fitByH) : Math.max(0.1, fitByW));
    };

    const ro = new ResizeObserver(compute);
    const el = hostRef.current;
    if (el) ro.observe(el);
    window.addEventListener("resize", compute);
    compute();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <section
      className="relative z-0 w-full flex flex-col items-center justify-center
                 mt-4 md:mt-12
                 py-2 md:py-6 lg:py-10
                 overflow-hidden"
    >
        <div
        ref={hostRef}
        className="relative z-0 flex justify-center pointer-events-none
                    h-[55svh] md:h-[76dvh] lg:h-[94dvh] w-full
                    lg:[clip-path:inset(0_200px_0_200px)]"
        >
<SplineAuto
  src="https://my.spline.design/blossombookanimated-RABoYJaWjZ6evsgSlU4VgfI4/"
  decorSrc="/dorure.webp"
  designW={1200}
  designH={700}
  scale={scale}
  paddingTop={0}
  paddingBottom={0}
/>
      </div>
    </section>
  );
}