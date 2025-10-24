// components/SplashScreen.tsx
"use client";
import { useEffect, useState } from "react";

export default function SplashScreen({ durationMs = 2000 }: { durationMs?: number }) {
  const [visible, setVisible] = useState(true);
  const [soft, setSoft] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("splash-active");
    window.dispatchEvent(new CustomEvent("splash:start"));

    // 0.5s : passe en "soft" (légèrement translucide)
    const t0 = setTimeout(() => setSoft(true), 500);

    // fin durée : déclenche le fade-out rapide (400ms)
    const t1 = setTimeout(() => setFade(true), durationMs);

    // fin fade : démonte + signale le done
    const t2 = setTimeout(() => {
      setVisible(false);
      html.classList.remove("splash-active");
      window.dispatchEvent(new CustomEvent("splash:done"));
    }, durationMs + 400);

    return () => {
      clearTimeout(t0); clearTimeout(t1); clearTimeout(t2);
      html.classList.remove("splash-active");
    };
  }, [durationMs]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={[
        "splash-overlay",
        soft ? "splash-overlay--soft" : "",
        fade ? "splash-overlay--fade" : "",
      ].join(" ")}
    >
      <div className="splash-inner">
        <div className="splash-title" aria-label="Blossom loading">Blossom</div>
        <div className="splash-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100}>
          <span className="splash-bar__fill" />
          <span className="splash-bar__shine" />
        </div>
      </div>
    </div>
  );
}