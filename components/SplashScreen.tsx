"use client";
import { useEffect, useRef, useState } from "react";

/**
 * 🌸 SplashScreen — robuste, auto-calculée et non-bloquante
 * - 3 phases : solid → fade → gone
 * - Déclenche `splash:prepare` 2s avant le fade
 * - Timeout max de 3s (force le fade)
 * - Pas de dépendance à setTimeout (utilise performance.now)
 * - Bloque le scroll le temps du splash
 */
export default function SplashScreen() {
  const [phase, setPhase] = useState<"solid" | "fade" | "gone">("solid");

  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const unlockedRef = useRef(false);

  // phase durations (calculées dynamiquement)
  const solidMin = 1200;   // minimum opaque phase
  const fadeDur = 800;     // fade-out duration
  const maxTotal = 3000;   // max visible duration (failsafe)
  const prepareOffset = 2000; // trigger 2s before fade

  // scroll lock
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("splash-lock");
    return () => html.classList.remove("splash-lock");
  }, []);

  useEffect(() => {
    const now = () => performance.now();
    startRef.current = now();

    // pick a dynamic display time between 1.8–2.4s for variation
    const solidDuration = Math.min(
      solidMin + Math.random() * 600, // 1200 → 1800ms
      maxTotal - fadeDur
    );

    const fadeStart = startRef.current + solidDuration;
    const fadeEnd = fadeStart + fadeDur;
    const hardEnd = startRef.current + maxTotal;

    // trigger “prepare” event (2s before fade)
    const prepareAt = Math.max(startRef.current, fadeStart - prepareOffset);
    const prepTimer = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("splash:prepare"));
    }, prepareAt - now());

    const tick = () => {
      const t = now();

      if (t >= hardEnd) {
        // Failsafe: force fade end
        if (!unlockedRef.current) {
          unlockedRef.current = true;
          document.documentElement.classList.remove("splash-lock");
          window.dispatchEvent(new CustomEvent("splash:done"));
        }
        setPhase("gone");
        return;
      }

      if (t >= fadeEnd) {
        // fade done → remove splash
        if (!unlockedRef.current) {
          unlockedRef.current = true;
          document.documentElement.classList.remove("splash-lock");
          window.dispatchEvent(new CustomEvent("splash:done"));
        }
        setPhase("gone");
      } else if (t >= fadeStart) {
        // start fading
        setPhase("fade");
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      clearTimeout(prepTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={[
        "splash-overlay",
        phase === "fade" ? "splash-overlay--fade" : "",
      ].join(" ")}
      style={{
        transitionDuration: phase === "fade" ? "800ms" : "400ms",
      }}
    >
      <div className="splash-inner">
        <div className="splash-title">Blossom</div>

        {/* Barre animée simple */}
        <div className="splash-bar">
          <span
            className="splash-bar__fill"
            style={{
              animationDuration: `${Math.min(2000, Math.random() * 800 + 1600)}ms`,
            }}
          />
          <span className="splash-bar__shine" />
        </div>
      </div>
    </div>
  );
}