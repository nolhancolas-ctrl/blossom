// components/visual/SplashScreen.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SplashScreenProps {
  holdMs?: number;     // Full opacity duration
  fadeMs?: number;     // Fade-out duration
  hardMaxMs?: number;  // Max total wait time before forced fade
}

/**
 * SplashScreen
 * Smooth intro splash with:
 * - hold → fade → remove
 * - dispatches "splash:prepare" and "splash:done"
 * - auto timeout protection (hardMaxMs)
 */
export default function SplashScreen({
  holdMs = 1700,
  fadeMs = 600,
  hardMaxMs = 3000,
}: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"hold" | "fade">("hold");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // ===== STAGE 1 — PREPARE (for preload events)
    const prepDelay = Math.max(0, holdMs - 2000);
    timers.push(
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("splash:prepare"));
      }, prepDelay)
    );

    // ===== STAGE 2 — START FADE
    const fadeDelay = Math.min(hardMaxMs, holdMs);
    timers.push(
      setTimeout(() => {
        setPhase("fade");
      }, fadeDelay)
    );

    // ===== STAGE 3 — REMOVE + UNLOCK UI
    timers.push(
      setTimeout(() => {
        setVisible(false);
        window.dispatchEvent(new CustomEvent("splash:done"));
      }, fadeDelay + fadeMs)
    );

    return () => timers.forEach(clearTimeout);
  }, [holdMs, fadeMs, hardMaxMs]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "hold" ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeMs / 1000, ease: "easeOut" }}
          className="
            fixed inset-0 z-[9999]
            grid place-items-center 
            bg-[#f8f5f1] backdrop-blur-md
          "
          aria-label="Loading Blossom"
        >
          <div className="w-[86vw] max-w-[460px] grid gap-4 text-center">
            {/* Title */}
            <h1 className="font-serif text-2xl text-slate-800 tracking-wide">
              Blossom
            </h1>

            {/* Progress Bar */}
            <div className="relative h-2 w-full rounded-full bg-white/50 border border-black/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-black/80 rounded-full"
                style={{
                  animation: `splashFill ${Math.min(
                    hardMaxMs,
                    holdMs
                  ) / 1000}s forwards`,
                }}
              ></div>
            </div>
          </div>

          <style jsx>{`
            @keyframes splashFill {
              from {
                width: 0%;
              }
              to {
                width: 100%;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}