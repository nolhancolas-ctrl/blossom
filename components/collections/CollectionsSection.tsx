// components/sections/CollectionsSection.tsx
"use client";

import PageSection from "@/components/layout/PageSection";
import Button from "@/components/ui/Button";
import { collections } from "@/lib/collections";
import { useLang } from "@/hooks/useLang";
import { useRef, useEffect, useState } from "react";

export default function CollectionsSection() {
  const { lang } = useLang();

  return (
    <>
      {collections.map((collection) => (
        <PageSection
          key={collection.id}
          id={`collection-${collection.slug}`}
          variant="default"
        >
          <div
            className="
              w-full max-w-5xl mx-auto
              bg-white/10 md:bg-white/10
              backdrop-blur-none md:backdrop-blur-md
              border border-white/15 md:border-white/20
              shadow-[0_6px_24px_rgba(0,0,0,0.06)]
              md:shadow-[0_8px_40px_rgba(0,0,0,0.08)]
              rounded-2xl md:rounded-3xl
              px-6 py-8 md:px-10 md:py-12
              transition-all duration-500
            "
          >
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-slate-800 mb-4 text-center">
              {collection.title[lang]}
            </h2>

            {/* Infinite carousel */}
            <InfiniteCarousel images={collection.images} />

            {/* Description */}
            <p className="text-slate-700/90 text-[0.95rem] sm:text-[1rem] leading-relaxed mb-6 text-justify text-center">
              {collection.description[lang]}
            </p>

            {/* CTA */}
            <div className="flex justify-center">
              <Button as="a" href={`/shop/${collection.slug}`} variant="primary">
                {lang === "en" ? "See the collection" : "Voir la collection"}
              </Button>
            </div>
          </div>
        </PageSection>
      ))}
    </>
  );
}

/* -------------------------------------------------------
   INFINITE CAROUSEL — continuous, smooth, no hover pause
------------------------------------------------------- */
function InfiniteCarousel({ images }: { images: any[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [rowWidth, setRowWidth] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const id = setTimeout(() => {
      const items = track.querySelectorAll(".carousel-item");
      if (items.length > 0) {
        // Compute width of ONE full row of images
        const total = Array.from(items)
          .slice(0, images.length)
          .reduce((acc, el) => acc + (el as HTMLElement).offsetWidth + 24, 0);

        setRowWidth(total);
        setReady(true);
      }
    }, 80);

    return () => clearTimeout(id);
  }, [images]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-white/40 border border-white/60 shadow-inner mb-5">
      <div
        ref={trackRef}
        className="flex gap-6 py-6 px-6 carousel-track"
        style={{
          width: ready ? rowWidth * 2 : "auto", // Two copies inside the track
          animation: ready ? `marquee ${rowWidth / 40}s linear infinite` : "none",
        }}
      >
        {/* Original list */}
        {images.map((img) => (
          <PosterThumb key={img.id} img={img} />
        ))}

        {/* Duplicate list for seamless infinite scroll */}
        {images.map((img) => (
          <PosterThumb key={img.id + "-dup"} img={img} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Single poster thumbnail
------------------------------------------------------- */
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