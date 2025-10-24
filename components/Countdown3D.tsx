// components/Countdown3D.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useResponsiveScale } from "@/lib/useResponsiveScale";

type Countdown3DProps = {
  target?: Date | string | number; // défaut Tokyo: 2026-04-21
  size?: "sm" | "md" | "lg";
  designW?: number;
  designH?: number;
  className?: string;
  onComplete?: () => void;
};
const SIZES = {
  sm: { digitH: 44, font: "text-2xl", gap: 12 },
  md: { digitH: 64, font: "text-4xl", gap: 16 },
  lg: { digitH: 88, font: "text-6xl", gap: 18 },
} as const;
type SizeKey = keyof typeof SIZES;

/* --- calendrier: months/days/hours --- */
function diffMDH(target: Date) {
  const now = new Date();

  if (target.getTime() <= now.getTime()) {
    return { months: 0, days: 0, hours: 0, done: true };
  }

  // 1) différence brute en mois (année*12 + mois)
  const monthsTotalNow = now.getFullYear() * 12 + now.getMonth();
  const monthsTotalTgt = target.getFullYear() * 12 + target.getMonth();
  let months = monthsTotalTgt - monthsTotalNow;

  // 2) ancre = now + months (préserve jour & heure de "now")
  let anchor = new Date(now);
  anchor.setMonth(anchor.getMonth() + months);

  // ⚠️ si l’ancre dépasse la cible (même mois mais jour/heure trop loin) → recule d’1 mois
  if (anchor.getTime() > target.getTime()) {
    months -= 1;
    anchor = new Date(now);
    anchor.setMonth(anchor.getMonth() + months);
  }

  // 3) reste après les mois entiers
  let remMs = target.getTime() - anchor.getTime();

  // Pour limiter les effets DST, on dérive days/hours depuis le reste en ms.
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;

  // Nombre entier de jours dans le reste
  const days = Math.floor(remMs / DAY);
  remMs -= days * DAY;

  // Nombre entier d'heures dans le reliquat
  const hours = Math.floor(remMs / HOUR);

  return {
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    done: false,
  };
}

/* --- rouleaux --- */
function DigitReel({ value, height }: { value: number; height: number }) {
  const prev = useRef<number>(value);
  const [y, setY] = useState<number>(-(value + 10) * height);
  const [isClient, setIsClient] = useState(false);
  const sequence = useMemo(() => Array.from({ length: 20 }, (_, i) => i % 10), []);
  useEffect(() => setIsClient(true), []);
  useEffect(() => {
    if (!isClient) return;
    let delta = value - prev.current;
    if (delta < 0) delta += 10;
    setY((-(value + 10) * height));
    prev.current = value;
  }, [value, height, isClient]);
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-white"
      style={{ height }}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />
      <motion.div
        initial={{ y }}
        animate={{ y }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="absolute left-0 right-0"
        style={{ willChange: "transform" }}
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
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/5 shadow-[inset_0_10px_20px_-8px_rgba(0,0,0,0.08),inset_0_-10px_20px_-8px_rgba(0,0,0,0.06)]" />
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

/* --- principal --- */
export default function Countdown3D({
  target = "2026-04-21T00:00:00+09:00",
  size = "md",
  className = "",
  designW = 800,
  designH = 260,
  onComplete,
}: Countdown3DProps) {
  const dims = SIZES[(size as SizeKey) ?? "md"] ?? SIZES.md;
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  const { ref, scale, boxH } = useResponsiveScale(designW, designH, 1);
  const [isClient, setIsClient] = useState(false);
  const [{ months, days, hours, done }, setState] = useState(() => ({ months: 0, days: 0, hours: 0, done: false }));

  useEffect(() => setIsClient(true), []);
  useEffect(() => {
    if (!isClient) return;
    const tick = () => {
      const res = diffMDH(new Date(targetMs));
      setState(res);
      if (res.done && onComplete) onComplete?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isClient, targetMs, onComplete]);

  return (
    <div
      ref={ref}
      className={`relative z-10 flex items-center justify-center w-full ${className}`}
      style={{
        height: Number.isFinite(boxH) && boxH > 0 ? `${boxH}px` : `${designH}px`,
        minHeight: `${Math.max(designH * 0.5)}px`,
        overflow: "visible",
      }}
    >
      <div
        className="relative group flex flex-col items-center justify-center counter-scale"
        style={{
          width: `${designW}px`,
          height: `${designH}px`,
          transform: `scale(calc(var(--counter-scale, 1) * ${Number.isFinite(scale) && scale > 0 ? scale : 1}))`,
          transformOrigin: "top center",
          willChange: "transform",
        }}
      >
        {/* Carte verre avec hover GL0W + rayon */}
        <div
          className="relative isolate overflow-hidden rounded-2xl backdrop-blur-md transition-all duration-500"
          style={{
            background: "rgba(255,255,255,0.26)",
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.12), inset 0 0.5px 0 rgba(255,255,255,0.35)",
          }}
        >
          {/* glow bordure au hover */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              boxShadow: "0 0 0 2px rgba(255,255,255,0.65), inset 0 0 30px rgba(255,255,255,0.22)",
            }}
          />
          {/* rayon qui parcourt la bordure (plus visible) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              padding: 1.5,
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              background:
                "conic-gradient(from 0deg, rgba(255,255,255,0.0), rgba(255,255,255,0.9), rgba(255,255,255,0.0))",
              animation: "borderSweep 2.4s linear infinite",
              opacity: 0.85,                // ↑ visibilité
              filter: "blur(0.2px)",        // léger soft
            }}
          />

          {/* BG flouté */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url('/background_countdown3D.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(4px)",
              transform: "scale(1.02)",
            }}
          />

          {/* contenu */}
          <div className="relative z-10 flex items-center justify-center flex-wrap" style={{ gap: dims.gap, padding: "24px 20px" }}>
            {/* Months */}
            <div className="flex flex-col items-center gap-2">
              <TwoDigits num={isClient ? months % 100 : 0} height={dims.digitH} />
              <span className="uppercase tracking-wider text-[10px] text-slate-700">Months</span>
            </div>
            <div className={`${dims.font} text-slate-500 select-none px-1`}>:</div>
            {/* Days */}
            <div className="flex flex-col items-center gap-2">
              <TwoDigits num={isClient ? days % 100 : 0} height={dims.digitH} />
              <span className="uppercase tracking-wider text-[10px] text-slate-700">Days</span>
            </div>
            <div className={`${dims.font} text-slate-500 select-none px-1`}>:</div>
            {/* Hours */}
            <div className="flex flex-col items-center gap-2">
              <TwoDigits num={isClient ? hours % 100 : 0} height={dims.digitH} />
              <span className="uppercase tracking-wider text-[10px] text-slate-700">Hours</span>
            </div>
          </div>
        </div>

        {/* Ombre au sol (plus nette) */}
        <div
          className="pointer-events-none absolute -z-10"
          style={{
            bottom: -18,
            width: 420,
            height: 160,
            filter: "blur(40px)",
            opacity: 0.45,
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.26), transparent 60%)",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes borderSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (hover: hover) {
          .group:hover { transform: translateZ(0); }
        }
      `}</style>
    </div>
  );
}