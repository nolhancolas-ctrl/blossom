"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useResponsiveScale } from "@/lib/useResponsiveScale";

/* ---------- Types & constantes ---------- */
type Countdown3DProps = {
  target: Date | string | number;
  size?: "sm" | "md" | "lg";
  designW?: number;
  designH?: number; // hauteur de la "zone design" (carte + texte)
  className?: string;
  onComplete?: () => void;
};

const SIZES = {
  sm: { digitH: 44, font: "text-2xl", gap: 12 },
  md: { digitH: 64, font: "text-4xl", gap: 16 },
  lg: { digitH: 88, font: "text-6xl", gap: 18 },
} as const;
type SizeKey = keyof typeof SIZES;

/* hauteur réservée pour la ligne de texte sous le compteur (dans la zone design) */
const TEXT_BLOCK_H = 40;

/* ---------- Utils ---------- */
function getRemaining(targetMs: number) {
  const now = Date.now();
  const diff = Math.max(0, Math.floor((targetMs - now) / 1000));
  const hrs = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  const secs = diff % 60;
  return { diff, hrs, mins, secs };
}

/* ---------- Rouleaux de chiffres ---------- */
function DigitReel({ value, height }: { value: number; height: number }) {
  const prev = useRef<number>(value);
  const [y, setY] = useState<number>(-(value + 10) * height); // deck 10..19
  const [isClient, setIsClient] = useState(false);
  const sequence = useMemo(() => Array.from({ length: 20 }, (_, i) => i % 10), []);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;
    let delta = value - prev.current;
    if (delta < 0) delta += 10; // wrap 9->0
    const targetY = -(value + 10) * height;
    setY(targetY);
    prev.current = value;
  }, [value, height, isClient]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl shadow-inner [perspective:800px] bg-white"
      style={{ height }}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />
      <motion.div
        initial={{ y }}
        animate={{ y }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
        className="absolute left-0 right-0 [transform-style:preserve-3d]"
      >
        {sequence.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-center font-mono font-extrabold text-slate-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]"
            style={{ height }}
          >
            <span className="[transform:rotateX(10deg)]">{d}</span>
          </div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5 shadow-[inset_0_10px_20px_-8px_rgba(0,0,0,0.08),inset_0_-10px_20px_-8px_rgba(0,0,0,0.06)] rounded-xl" />
    </div>
  );
}

function TwoDigits({ num, height }: { num: number; height: number }) {
  const tens = Math.floor(num / 10) % 10;
  const ones = num % 10;
  return (
    <div className="grid grid-cols-2 gap-1" style={{ width: height * 1.4 }}>
      <DigitReel value={tens} height={height} />
      <DigitReel value={ones} height={height} />
    </div>
  );
}

export default function Countdown3D({
  target,
  size = "md",
  className = "",
  designW = 800,
  designH = 260,
  onComplete,
}: 

  Countdown3DProps) {
    const dims = SIZES[(size as SizeKey) ?? "md"] ?? SIZES.md;
    const targetMs = useMemo(() => new Date(target).getTime(), [target]);
    const { ref, scale, boxH } = useResponsiveScale(designW, designH, 1); // scale seulement à partir du format carré
    const [isClient, setIsClient] = useState(false);
    const [{ diff, hrs, mins, secs }, setRemaining] = useState(() => ({
      diff: -1,
      hrs: 0,
      mins: 0,
      secs: 0,
  }));

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const tick = () => {
      const rem = getRemaining(targetMs);
      setRemaining(rem);
      if (rem.diff === 0 && onComplete) onComplete?.();
    };
    
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isClient, targetMs, onComplete]);

return (
  <div
    ref={ref}
    className={`relative flex items-center justify-center w-full ${className}`}
    style={{
      height: `${boxH}px`, // hauteur extérieure suit le scale
      overflow: "visible",
    }}
  >
{/* Zone “design” centrée et scalée */}
<div
  className="relative flex flex-col items-center justify-center counter-scale"
  style={{
    width: `${designW}px`,
    height: `${designH}px`,
    position: "absolute",
    top: "50%",
    left: "50%",
    // ⬇️ on multiplie ton scale calculé par une variable responsive
    transform: `translate(-50%, -50%) scale(calc(var(--counter-scale, 1) * ${scale}))`,
    transformOrigin: "center",
    willChange: "transform",
  }}
>
      {/* Carte avec image de fond floutée (contenu net) */}
      <div
        className="relative isolate overflow-hidden rounded-2xl"
        style={{
          width: `auto%`,
          maxWidth: `${designW}px`,
          height: `auto`,
          boxSizing: "border-box",
        }}
      >
        {/* Calque d'arrière-plan flouté */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/background_countdown3D.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "blur(4px)",
          }}
        />

        {/* Contenu au premier plan */}
        <div
          className="relative z-10 flex items-center justify-center flex-wrap"
          style={{ gap: dims.gap, padding: "24px 20px" }}
        >
          {/* Bloc compteur */}
          <div className="flex flex-col items-center gap-2">
            <TwoDigits num={isClient ? hrs % 100 : 0} height={dims.digitH} />
            <span className="uppercase tracking-wider text-[10px] text-slate-600">
              Heures
            </span>
          </div>

          <div className={`${dims.font} text-slate-500 select-none px-1`}>:</div>

          <div className="flex flex-col items-center gap-2">
            <TwoDigits num={isClient ? mins : 0} height={dims.digitH} />
            <span className="uppercase tracking-wider text-[10px] text-slate-600">
              Minutes
            </span>
          </div>

          <div className={`${dims.font} text-slate-500 select-none px-1`}>:</div>

          <div className="flex flex-col items-center gap-2">
            <TwoDigits num={isClient ? secs : 0} height={dims.digitH} />
            <span className="uppercase tracking-wider text-[10px] text-slate-600">
              Secondes
            </span>
          </div>
        </div>
      </div>

      {/* Texte sous le compteur */}
      <p className="mt-3 text-sm text-slate-700 text-center">
        {diff > 0 ? "Temps restant avant le lancement" : "C’est l’heure !"}
      </p>
    </div>

    {/* Halo pastel discret */}
    <div className="pointer-events-none absolute -z-10 blur-3xl opacity-40 w-[380px] h-[140px] bg-[radial-gradient(ellipse_at_center,rgba(247,197,159,0.35),transparent_60%)]" />
  </div>
);
}