"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/hooks/useLang";

/* -------------------------------------------------------------
   CountdownSection — with bilingual labels + readable tag style
------------------------------------------------------------- */
export default function Countdown3D({
  target,
  size = "lg",
  className = "",
}: {
  target: string | Date;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { lang } = useLang();

  /* Local translations */
  const labels = {
    en: { months: "Months", days: "Days", hours: "Hours" },
    fr: { months: "Mois", days: "Jours", hours: "Heures" },
  }[lang];

  /* ---------- DESIGN SIZES ---------- */
  const SIZES = {
    sm: { digitH: 44, gap: 12, font: "text-2xl" },
    md: { digitH: 64, gap: 16, font: "text-4xl" },
    lg: { digitH: 88, gap: 18, font: "text-6xl" },
  } as const;
  const dims = SIZES[size] || SIZES.lg;

  const targetDate = useMemo(() => new Date(target), [target]);

  /* ---------- Countdown state ---------- */
  const [{ months, days, hours, done }, setTime] = useState({
    months: 0,
    days: 0,
    hours: 0,
    done: false,
  });

  function computeRemaining(t: Date) {
    const now = new Date();
    if (t <= now) return { months: 0, days: 0, hours: 0, done: true };

    const totalNow = now.getFullYear() * 12 + now.getMonth();
    const totalTgt = t.getFullYear() * 12 + t.getMonth();
    let months = totalTgt - totalNow;

    let anchor = new Date(now);
    anchor.setMonth(anchor.getMonth() + months);

    if (anchor > t) {
      months--;
      anchor = new Date(now);
      anchor.setMonth(anchor.getMonth() + months);
    }

    let diffMs = t.getTime() - anchor.getTime();
    const DAY = 24 * 60 * 60 * 1000;
    const HOUR = 60 * 60 * 1000;

    const days = Math.floor(diffMs / DAY);
    diffMs -= days * DAY;

    const hours = Math.floor(diffMs / HOUR);

    return {
      months: Math.max(0, months),
      days: Math.max(0, days),
      hours: Math.max(0, hours),
      done: false,
    };
  }

  /* ---------- Timer ---------- */
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;
    const tick = () => setTime(computeRemaining(targetDate));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isClient, targetDate]);

  /* ---------- Responsive scaling ---------- */
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const DESIGN_W = 800;
    const update = () => {
      if (!hostRef.current) return;
      const w = hostRef.current.clientWidth;
      setScale(Math.min(1, Math.max(0.6, w / DESIGN_W)));
    };
    update();

    const ro = new ResizeObserver(update);
    if (hostRef.current) ro.observe(hostRef.current);

    window.addEventListener("resize", update, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className={`w-full ${className}`}>
      <div className="mx-auto w-full max-w-4xl px-14 sm:px-10">
        <div ref={hostRef} className="relative w-full">
          <div
            className="relative mx-auto"
            style={{ height: `${260 * scale}px`, width: "100%" }}
          >
            <div
              className="absolute left-1/2 top-0 grid place-items-center"
              style={{
                width: "800px",
                height: "260px",
                transform: `translateX(-50%) scale(${scale})`,
                transformOrigin: "top center",
              }}
            >
              <GlassCard>
                <CounterRows
                  dims={dims}
                  months={months}
                  days={days}
                  hours={hours}
                  done={done}
                  labels={labels}
                />
              </GlassCard>

              <div
                aria-hidden
                className="absolute -z-10"
                style={{
                  bottom: -12,
                  width: 380,
                  height: 140,
                  filter: "blur(36px)",
                  opacity: 0.38,
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0.26), transparent 60%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------
   Glass card
------------------------------------------------------------- */
function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative isolate overflow-hidden rounded-2xl backdrop-blur-md"
      style={{
        background: "rgba(255,255,255,0.26)",
        border: "1px solid rgba(255,255,255,0.35)",
        boxShadow:
          "0 20px 50px rgba(0,0,0,0.12), inset 0 0.5px 0 rgba(255,255,255,0.35)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          padding: 1.5,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          background:
            "conic-gradient(from 0deg, rgba(255,255,255,0), rgba(255,255,255,0.9), rgba(255,255,255,0))",
          animation: "borderSweep 2.4s linear infinite",
          opacity: 0.85,
          filter: "blur(0.2px)",
        }}
      />
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
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------
   Rows of counters
------------------------------------------------------------- */
function CounterRows({
  dims,
  months,
  days,
  hours,
  done,
  labels,
}: {
  dims: any;
  months: number;
  days: number;
  hours: number;
  done: boolean;
  labels: { months: string; days: string; hours: string };
}) {
  return (
    <div
      className="flex items-center justify-center flex-wrap"
      style={{ gap: dims.gap, padding: "24px 20px" }}
    >
      <DigitBlock label={labels.months} value={months} dims={dims} />
      <Separator dims={dims} />
      <DigitBlock label={labels.days} value={days} dims={dims} />
      <Separator dims={dims} />
      <DigitBlock label={labels.hours} value={hours} dims={dims} />
    </div>
  );
}

/* -------------------------------------------------------------
   Digit block with NEW BG TAGS for labels
------------------------------------------------------------- */
function DigitBlock({
  label,
  value,
  dims,
}: {
  label: string;
  value: number;
  dims: any;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <TwoDigits num={value % 100} height={dims.digitH} />

      {/* 🔥 New readable label background */}
      <span
        className="
          uppercase tracking-wide text-[10px] text-slate-800 px-2 py-[2px]
          rounded-full bg-white/60 backdrop-blur-sm border border-white/40
          shadow-sm
        "
      >
        {label}
      </span>
    </div>
  );
}

/* Digit reels + separator remain unchanged */
function Separator({ dims }: { dims: any }) {
  return (
    <div className={`${dims.font} text-slate-500 select-none px-1`}>:</div>
  );
}

function TwoDigits({ num, height }: { num: number; height: number }) {
  const tens = Math.floor(num / 10);
  const ones = num % 10;

  return (
    <div className="grid grid-cols-2 gap-1" style={{ width: height * 1.4 }}>
      <DigitReel value={tens} height={height} />
      <DigitReel value={ones} height={height} />
    </div>
  );
}

function DigitReel({ value, height }: { value: number; height: number }) {
  const prev = useRef(value);
  const [y, setY] = useState(-(value + 10) * height);

  const sequence = useMemo(
    () => Array.from({ length: 20 }, (_, i) => i % 10),
    []
  );

  useEffect(() => {
    let delta = value - prev.current;
    if (delta < 0) delta += 10;
    setY(-(value + 10) * height);
    prev.current = value;
  }, [value, height]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-white"
      style={{ height }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 pointer-events-none" />

      <motion.div
        initial={{ y }}
        animate={{ y }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="absolute left-0 right-0"
      >
        {sequence.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-center font-mono font-extrabold text-slate-800"
            style={{ height }}
          >
            {d}
          </div>
        ))}
      </motion.div>

      <div className="absolute inset-0 rounded-xl ring-1 ring-black/5 pointer-events-none" />
    </div>
  );
}