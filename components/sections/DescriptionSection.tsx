// components/sections/DescriptionSection.tsx
"use client";

import PageSection from "@/components/layout/PageSection";
import { useLang } from "@/hooks/useLang";

export default function DescriptionSection() {
  const { lang } = useLang(); // 'fr' or 'en'

  // Traductions locales au composant
  const translations = {
    fr: {
      descriptionTitle: "À propos du livre",
      descriptionText: [
        "Tu ne t’es jamais demandé ce que sont vraiment toutes les plantes autour de toi ? 🌿",
        "Parce que moi si — leurs noms, leurs origines, pourquoi elles poussent de façons si différentes… et crois-moi, la réponse est parfois sureprenante... ☀️", 
        "Blossom traverse cette diversité : feuilles de jungle, petites alpines, plantes de désert, grandes grimpantes ou épyphytes à fleurs… 🪴", 
        "Il existe tellement de beauté qui pour la plupart des gens reste un mystère, alors sois curieux ! ✨",
      ]
    },
    en: {
      descriptionTitle: "About the book",
      descriptionText: [
        "Have you ever wondered what all the plants around you really are? 🌿",
        "Because I have — their names, their origins, why they grow in such different ways… and believe me, the answer is sometimes surprising... ☀️", 
        "Blossom walks through this diversity: jungle leaves, tiny alpine plants, desert species, tall climbers or flowering epiphytes… 🪴", 
        "There is so much beauty that, for most people, remains a mystery, so stay curious! ✨",
      ]
    }
  };

  const t = translations[lang];

  return (
    <PageSection id="description-section">
      <div
        className="
          w-full max-w-2xl mx-auto
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
        {/* TITLE */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-slate-800 mb-6">
          {t.descriptionTitle}
        </h2>

        {/* PARAGRAPHS */}
        <div className="text-[1rem] sm:text-[1.05rem] md:text-[1.15rem] text-slate-700/90 leading-relaxed space-y-5 text-justify">
          {t.descriptionText.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </PageSection>
  );
}