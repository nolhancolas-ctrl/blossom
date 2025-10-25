// components/Countdown3D.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type Countdown3DProps = {
  target?: Date | string | number;
  size?: "sm" | "md" | "lg";
  designW?: number; // largeur “design”
  designH?: number; // hauteur “design”
  className?: string;
  onComplete?: () => void;
  /** gabarit du conteneur externe — par défaut comme MailingSection */
  maxWClass?: string; // ex: "max-w-4xl"
  padClass?: string;  // ex: "px-14 sm:px-10 lg:px-12"
};

const SIZES = {
  sm: { digitH: 44, font: "text-2xl", gap: 12 },
  md: { digitH: 64, font: "text-4xl", gap: 16 },
  lg: { digitH: 88, font: "text-6xl", gap: 18 },
} as const;
type SizeKey = keyof typeof SIZES;

/* --- Diff MDH robuste --- */
function diffMDH(target: Date) {
  const now = new Date();
  if (target.getTime() <= now.getTime()) {
    return { months: 0, days: 0, hours: 0, done: true };
  }
  const monthsTotalNow = now.getFullYear() * 12 + now.getMonth();
  const monthsTotalTgt = target.getFullYear() * 12 + target.getMonth();
  let months = monthsTotalTgt - monthsTotalNow;
  let anchor = new Date(now);
  anchor.setMonth(anchor.getMonth() + months);
  if (anchor.getTime() > target.getTime()) {
    months -= 1;
    anchor = new Date(now);
    anchor.setMonth(anchor.getMonth() + months);
  }
  let remMs = target.getTime() - anchor.getTime();
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;
  const days = Math.floor(remMs / DAY);
  remMs -= days * DAY;
  const hours = Math.floor(remMs / HOUR);
  return { months: Math.max(0, months), days: Math.max(0, days), hours: Math.max(0, hours), done: false };
}

/* --- Rouleaux --- */
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
    setY(-(value + 10) * height);
    prev.current = value;
  }, [value, height, isClient]);
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-white" style={{ height }} aria-hidden>
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

/* --- Principal --- */
export default function Countdown3D({
  target = "2026-04-21T00:00:00+09:00",
  size = "md",
  className = "",
  designW = 800,
  designH = 260,
  onComplete,
  // gabarit externe (aligne avec MailingSection)
  maxWClass = "max-w-4xl",
  padClass = "px-14 sm:px-10 lg:px-12", // ← marges directrices
}: Countdown3DProps) {
  const dims = SIZES[(size as SizeKey) ?? "md"] ?? SIZES.md;
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);

  /** ── SCALE width-only (drivé par la largeur utile dans les marges px-14) ── */
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let raf = 0;
    const computeNow = () => {
      raf = 0;
      const hostW = hostRef.current?.clientWidth ?? 0; // largeur dispo à l'intérieur des paddings
      if (hostW <= 0) return;
      // scale purement largeur, clamp pour éviter des tailles absurdes
      const s = Math.max(0.6, Math.min(1, hostW / designW));
      setScale(prev => (Math.abs(prev - s) > 1e-4 ? s : prev));
    };
    const compute = () => { if (!raf) raf = requestAnimationFrame(computeNow); };

    compute();
    const ro = new ResizeObserver(compute);
    if (hostRef.current) ro.observe(hostRef.current);

    const onResize = () => compute();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [designW]);

  /** Tick compteur */
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
    <section className={`relative z-10 w-full ${className}`}>
      {/* OUTER : borné par maxW + paddings (les paddings guident la réduction) */}
      <div className={`mx-auto w-full ${maxWClass} ${padClass}`}>
        {/* Host qui mesure la largeur utile (clientWidth inclut déjà les paddings de ce parent) */}
        <div ref={hostRef} className="relative w-full">
          {/* Réserve de hauteur = designH * scale pour éviter tout jump de layout */}
          <div className="relative mx-auto" style={{ height: `${designH * scale}px`, width: "100%" }}>
            {/* Carte centrée, scaled depuis le haut-centre */}
            <div
              className="absolute left-1/2 top-0 grid place-items-center"
              style={{
                width: `${designW}px`,
                height: `${designH}px`,
                transform: `translateX(-50%) scale(${scale})`,
                transformOrigin: "top center",
                willChange: "transform",
              }}
            >
              {/* Carte verre */}
              <div
                className="relative isolate overflow-hidden rounded-2xl backdrop-blur-md transition-all duration-500"
                style={{
                  background: "rgba(255,255,255,0.26)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.12), inset 0 0.5px 0 rgba(255,255,255,0.35)",
                }}
              >
                {/* glow au hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: "0 0 0 2px rgba(255,255,255,0.65), inset 0 0 30px rgba(255,255,255,0.22)" }}
                />
                {/* rayon bordure */}
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
                    opacity: 0.85,
                    filter: "blur(0.2px)",
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
                <CounterRows
                  dims={SIZES[(size as SizeKey) ?? "md"] ?? SIZES.md}
                  months={isClient ? months : 0}
                  days={isClient ? days : 0}
                  hours={isClient ? hours : 0}
                />
              </div>

              {/* Ombre sol */}
              <div
                className="pointer-events-none absolute -z-10"
                style={{
                  bottom: -12,
                  width: 380,
                  height: 140,
                  filter: "blur(36px)",
                  opacity: 0.38,
                  background: "radial-gradient(ellipse at center, rgba(0,0,0,0.26), transparent 60%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes borderSweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          section :global(.-z-10[style]) {
            width: 320px !important;
            height: 120px !important;
            bottom: -10px !important;
            filter: blur(32px) !important;
            opacity: 0.36 !important;
          }
        }
      `}</style>
    </section>
  );
}

/* --- contenu de la carte --- */
function CounterRows({
  dims, months, days, hours,
}: {
  dims: { digitH: number; font: string; gap: number };
  months: number; days: number; hours: number;
}) {
  return (
    <div className="relative z-10 flex items-center justify-center flex-wrap" style={{ gap: dims.gap, padding: "24px 20px" }}>
      <div className="flex flex-col items-center gap-2">
        <TwoDigits num={months % 100} height={dims.digitH} />
        <span className="uppercase tracking-wider text-[10px] text-slate-700">Months</span>
      </div>
      <div className={`${dims.font} text-slate-500 select-none px-1`}>:</div>
      <div className="flex flex-col items-center gap-2">
        <TwoDigits num={days % 100} height={dims.digitH} />
        <span className="uppercase tracking-wider text-[10px] text-slate-700">Days</span>
      </div>
      <div className={`${dims.font} text-slate-500 select-none px-1`}>:</div>
      <div className="flex flex-col items-center gap-2">
        <TwoDigits num={hours % 100} height={dims.digitH} />
        <span className="uppercase tracking-wider text-[10px] text-slate-700">Hours</span>
      </div>
    </div>
  );
}