"use client";
import { useState, useEffect } from "react";
import { CollectionImage } from "@/lib/collections";
import DualActionButton from "@/components/ui/DualActionButton";

export default function CollectionGrid({ images }: { images: CollectionImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const zoomed = index !== null ? images[index] : null;

  /* -------------------------------------------------------------
     SCROLL LOCK + HIDE CONTEXT WHEN ZOOMED
  ------------------------------------------------------------- */
  useEffect(() => {
    if (index !== null) {
      document.documentElement.classList.add("zoom-open");
      document.body.classList.add("zoom-open");

      const prevent = (e: Event) => e.preventDefault();
      window.addEventListener("wheel", prevent, { passive: false });
      window.addEventListener("touchmove", prevent, { passive: false });

      return () => {
        document.documentElement.classList.remove("zoom-open");
        document.body.classList.remove("zoom-open");
        window.removeEventListener("wheel", prevent);
        window.removeEventListener("touchmove", prevent);
      };
    }
  }, [index]);

  /* ESC → close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && setIndex(null);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const prev = () => index !== null && setIndex((i) => (i! - 1 + images.length) % images.length);
  const next = () => index !== null && setIndex((i) => (i! + 1) % images.length);

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full">
        {images.map((img, i) => (
          <div
            key={img.id}
            onClick={() => setIndex(i)}
            className="
              relative rounded-2xl overflow-hidden cursor-pointer
              shadow-md bg-slate-200/40
              transition-transform duration-300
              hover:scale-[1.05]
              hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]
            "
          >
            <img
              src={img.src}
              alt={img.alt || ""}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* ZOOM OVERLAY */}
      {zoomed && (
        <div
          className="
            fixed inset-0 z-[999]
            bg-black/70 backdrop-blur-md
            flex items-center justify-center
            px-6 py-6
          "
          onClick={() => setIndex(null)}
        >
          {/* CROIX EN HAUT À GAUCHE (symétrique au burger) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex(null);
            }}
            className="
              fixed top-4 left-4 
              h-12 w-12 rounded-full
              bg-white/80 backdrop-blur-xl
              border border-white/60
              flex items-center justify-center
              shadow-md hover:bg-white transition
              z-[1000]
            "
            aria-label="Close"
          >
            <span className="text-slate-800 text-3xl leading-none">×</span>
          </button>

          {/* WRAPPER CENTRÉ (image + flèches + dual button) */}
          <div
            className="
              relative flex flex-col items-center
              p-8 rounded-3xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* FLÈCHE GAUCHE — collée au bord, bien espacée de l'image */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="
                absolute top-1/2 -translate-y-1/2
                flex items-center justify-center
                rounded-full
                bg-white/85 backdrop-blur-xl
                border border-white/60
                shadow-xl hover:bg-white transition
                z-[1000]
              "
              style={{
                left: "clamp(10px, 4vw, -80px)",
                width: "clamp(48px, 5vw, 72px)",
                height: "clamp(48px, 5vw, 72px)",
              }}
            >
              <span className="text-slate-800 text-3xl">‹</span>
            </button>

            {/* FLÈCHE DROITE — idem, côté droit */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="
                absolute top-1/2 -translate-y-1/2
                flex items-center justify-center
                rounded-full
                bg-white/85 backdrop-blur-xl
                border border-white/60
                shadow-xl hover:bg-white transition
                z-[1000]
              "
              style={{
                right: "clamp(10px, 4vw, -80px)",
                width: "clamp(48px, 5vw, 72px)",
                height: "clamp(48px, 5vw, 72px)",
              }}
            >
              <span className="text-slate-800 text-3xl">›</span>
            </button>

            {/* IMAGE — centrée, limitée par le vrai viewport (vhpx) + largeur */}
            <img
              src={zoomed.src}
              alt={zoomed.alt || ""}
              className="rounded-2xl object-contain shadow-2xl"
              style={{
                maxHeight: "calc(var(--vhpx) - 240px)", // haut + bas + dual button
                maxWidth: "calc(100vw - 200px)",
              }}
            />

            {/* Dual Button un peu plus proche */}
            <div className="mt-3">
              <DualActionButton
                displateUrl="/shop"
                paperUrl="/shop"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}