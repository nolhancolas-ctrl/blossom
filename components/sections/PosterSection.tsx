// components/sections/PosterSection.tsx
"use client";

import PageSection from "@/components/layout/PageSection";
import Button from "@/components/ui/Button";
import { useLang } from "@/hooks/useLang";
import { collections } from "@/lib/collections";
import { useEffect, useRef, useState } from "react";

type Props = {
  title: { en: string; fr: string };
  ctaHref?: string;
};

export default function PosterSection({ title, ctaHref = "/shop/collection" }: Props) {
  const { lang } = useLang();

  // --- Traductions ---
  const translations = {
    fr: {
      description: [
        "Disponible en tirages papier de haute qualité ou en posters métal via Displate, avec leur système d’accroche magnétique.",
        "Et en plus, pour celles-ci, pas besoin d’avoir la main verte. 😉"
      ],
      cta: "Voir tout"
    },
    en: {
      description: [
        "Printed either on thick art paper or as metal posters via Displate, ready to hang with their magnetic system.",
        "And unlike real plants, they survive even without a green thumb. 😉"
      ],
      cta: "See everything"
    }
  };

  const t = translations[lang];

  // --- 1 poster par collection ---
  const previewImages = collections.map((c) => c.images[0]);

  return (
    <PageSection>
      <div
        className="
          w-full max-w-5xl mx-auto
          bg-white/10 md:bg-white/10
          backdrop-blur-none md:backdrop-blur-md
          border border-white/15 md:border-white/20
          shadow-[0_6px_24px_rgba(0,0,0,0.06)]
          md:shadow-[0_8px_40px_rgba(0,0,0,0.08)]
          rounded-2xl md:rounded-3xl
          px-6 py-10 md:px-14 md:py-16
          transition-all duration-500
          text-center
        "
      >

        {/* === TITRE === */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-slate-800 mb-6">
          {title[lang]}
        </h2>

        {/* === CAROUSEL INFINI === */}
        <InfiniteCarousel images={previewImages} />

        {/* === DESCRIPTION === */}
        <div className="text-slate-700/90 text-[0.95rem] sm:text-[1rem] leading-relaxed mb-8 max-w-xl mx-auto text-center-justify">
          {t.description.map((line, i) => (
            <p key={i} className="mb-3 last:mb-0">{line}</p>
          ))}
        </div>

        {/* === CTA === */}
        <Button as="a" href={ctaHref} variant="primary">
          {t.cta}
        </Button>
      </div>
    </PageSection>
  );
}

/* -------------------------------------------------------
   INFINITE CAROUSEL (1 poster/collection)
------------------------------------------------------- */
function InfiniteCarousel({ images }: { images: any[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [rowWidth, setRowWidth] = useState(0);

  // Mesure la largeur d'une ligne
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const id = setTimeout(() => {
      const items = track.querySelectorAll(".carousel-item");
      if (items.length > 0) {
        const total = Array.from(items)
          .slice(0, images.length)
          .reduce((acc, el) => acc + (el as HTMLElement).offsetWidth + 24, 0);

        setRowWidth(total);
        setReady(true);
      }
    }, 60);

    return () => clearTimeout(id);
  }, [images]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-white/40 border border-white/60 shadow-inner mb-8">
      <div
        ref={trackRef}
        className="flex gap-6 py-6 px-6 carousel-track"
        style={{
          width: ready ? rowWidth * 2 : "auto",
          animation: ready ? `marquee ${rowWidth / 38}s linear infinite` : "none",
        }}
      >
        {images.map((img) => (
          <PosterThumb key={img.id} img={img} />
        ))}
        {images.map((img) => (
          <PosterThumb key={img.id + "-dup"} img={img} />
        ))}
      </div>
    </div>
  );
}

function PosterThumb({ img }: { img: any }) {
  return (
    <div
      className="
        carousel-item
        relative flex-shrink-0
        h-56 w-40 sm:h-72 sm:w-52 lg:h-80 lg:w-60
        overflow-hidden rounded-2xl
        shadow-md bg-slate-200/60
      "
    >
      <img
        src={img.src}
        alt={img.alt || ""}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}