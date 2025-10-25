// components/SplashScreen.tsx
"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  /** durée pleine opacité (ms) avant de lancer le fade */
  holdMs?: number;
  /** durée du fade (ms) */
  fadeMs?: number;
  /** sécurité : durée max totale (ms) avant fade forcé */
  hardMaxMs?: number;
};

export default function SplashScreen({
  holdMs = 1700,
  fadeMs = 600,
  hardMaxMs = 3000,
}: Props) {
  const [phase, setPhase] = useState<"hold" | "fade">("hold");
  const [visible, setVisible] = useState(true);

  // === Scroll lock via classes CSS (et écouteurs globaux) ===
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // mémorise la position actuelle
    const y = window.scrollY || 0;
    body.style.setProperty("--splash-top", `-${y}px`);

    // applique les locks
    html.classList.add("splash-lock");
    body.classList.add("splash-lock", "splash-fixed");

    // bloque gestes & touches
    const prevent = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    const onKey = (e: KeyboardEvent) => {
      const keys = ["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," ","Spacebar"];
      if (keys.includes(e.key)) { e.preventDefault(); e.stopPropagation(); }
    };
    window.addEventListener("wheel", prevent as any, { passive: false });
    window.addEventListener("touchmove", prevent as any, { passive: false });
    window.addEventListener("keydown", onKey as any, { passive: false });

    // helper: retire locks + restaure le scroll EXACTEMENT
    const unlock = () => {
      window.removeEventListener("wheel", prevent as any);
      window.removeEventListener("touchmove", prevent as any);
      window.removeEventListener("keydown", onKey as any);

      html.classList.remove("splash-lock");
      body.classList.remove("splash-lock", "splash-fixed");
      body.style.removeProperty("--splash-top");
      window.scrollTo(0, y);
    };

    // déverrouille UNIQUEMENT quand le fade est terminé
    const onDone = () => unlock();
    window.addEventListener("splash:done", onDone, { once: true });

    // filet en cleanup
    return () => {
      window.removeEventListener("splash:done", onDone);
      unlock();
    };
  }, []);

  // === Calendrier des phases (prepare → fade → done) ===
  useLayoutEffect(() => {
    const timers: number[] = [];

    // On ne tient jamais plus que hardMaxMs avant d'entamer le fade
    const fadeAt = Math.min(hardMaxMs, holdMs);

    // prépare 2s avant le fade (si possible)
    const prepAt = Math.max(0, fadeAt - 2000);
    timers.push(window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("splash:prepare"));
    }, prepAt));

    // passe en phase fade
    timers.push(window.setTimeout(() => {
      setPhase("fade");
    }, fadeAt));

    // fin: retire le DOM + émet l’événement qui déclenche l’unlock
    timers.push(window.setTimeout(() => {
      setVisible(false);
      window.dispatchEvent(new CustomEvent("splash:done"));
    }, fadeAt + fadeMs));

    return () => { timers.forEach(clearTimeout); };
  }, [holdMs, fadeMs, hardMaxMs]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "hold" ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: phase === "hold" ? 0 : fadeMs / 1000, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            background: "rgba(248,245,241,1)", // fond site
            pointerEvents: "all",
            touchAction: "none",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
          aria-label="Loading Blossom"
          role="status"
        >
          {/* Titre + barre de progression visuelle */}
          <div style={{ width: "min(460px, 86vw)", display: "grid", gap: 18, textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
                letterSpacing: "0.03em",
                fontSize: "clamp(1.25rem, 2.4vw + 0.6rem, 2rem)",
                color: "#2f2f2f",
                opacity: 0.9,
              }}
            >
              Blossom
            </div>
            <div
              style={{
                position: "relative",
                height: 8,
                borderRadius: 9999,
                background: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(0,0,0,0.06)",
                overflow: "hidden",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.05)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: "0 auto 0 0",
                  width: "0%",
                  background: "linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0.85))",
                  borderRadius: "inherit",
                  // la barre remplit pendant la phase "hold" (limitée par hardMax)
                  animation: `splashFill ${Math.min(hardMaxMs, holdMs) / 1000}s ease forwards`,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "-40%",
                  bottom: "-40%",
                  width: "24%",
                  left: "-30%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
                  filter: "blur(6px)",
                  opacity: 0.65,
                  animation: "splashShine 1.2s linear infinite",
                }}
              />
            </div>
          </div>

          <style jsx>{`
            @keyframes splashFill {
              0% { width: 0%; }
              100% { width: 100%; }
            }
            @keyframes splashShine {
              0% { transform: translateX(0%); }
              100% { transform: translateX(500%); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}