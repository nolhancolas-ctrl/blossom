// components/SplashScreen.tsx
"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 🌸 SplashScreen (ancienne animation restaurée)
 * - Barre de progression + libellé "BLOSSOM"
 * - Blocage du scroll tant que visible (lock avant paint, body fixed)
 * - Timeline fiable: holdMs (barre) puis fadeMs (fondu), puis unmount
 */
export default function SplashScreen({
  holdMs = 1700, // durée de remplissage de la barre (opaque)
  fadeMs = 600,  // durée du fade-out
}: {
  holdMs?: number;
  fadeMs?: number;
}) {
  const [phase, setPhase] = useState<"hold" | "fade">("hold");
  const [visible, setVisible] = useState(true);

  // sauvegarde/restaure scroll & styles
  const scrollYRef = useRef(0);
  const prevHtmlOverflow = useRef<string>("");
  const prevBodyOverflow = useRef<string>("");
  const prevBodyPos = useRef<string>("");
  const prevBodyTop = useRef<string>("");
  const prevent = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 🔒 Lock scroll avant le premier paint client
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    scrollYRef.current = window.scrollY || 0;

    // backup styles inline
    prevHtmlOverflow.current = html.style.overflow;
    prevBodyOverflow.current = body.style.overflow;
    prevBodyPos.current = body.style.position;
    prevBodyTop.current = body.style.top;

    // lock sans jump (iOS/Android safe)
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollYRef.current}px`;
    body.style.width = "100%";

    // bloque gestes pendant le splash
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });

    // timeline: hold → fade → unmount
    const t1 = window.setTimeout(() => setPhase("fade"), holdMs);
    const t2 = window.setTimeout(() => {
      setVisible(false);
      // restore scroll & styles
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);

      html.style.overflow = prevHtmlOverflow.current;
      body.style.overflow = prevBodyOverflow.current;
      body.style.position = prevBodyPos.current;
      body.style.top = prevBodyTop.current;
      body.style.width = "";

      // remet exactement à la même position
      window.scrollTo(0, scrollYRef.current);
    }, holdMs + fadeMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      // restore au cas où
      html.style.overflow = prevHtmlOverflow.current;
      body.style.overflow = prevBodyOverflow.current;
      body.style.position = prevBodyPos.current;
      body.style.top = prevBodyTop.current;
      body.style.width = "";
    };
  }, [holdMs, fadeMs]);

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
            background: "rgba(248,245,241,1)", // ton fond off-white
            pointerEvents: "all",
            touchAction: "none",
            WebkitTapHighlightColor: "transparent",
          }}
          aria-label="Loading Blossom"
          role="status"
        >
          {/* Bloc centré : libellé + barre */}
          <div className="splash-inner">
            <div className="splash-title" aria-label="Blossom loading">Blossom</div>
            <div className="splash-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100}>
              <span className="splash-bar__fill" />
              <span className="splash-bar__shine" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}