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
        "Nous vivons entourés de plantes sans vraiment savoir comment elles fonctionnent. Blossom t’ouvre cet univers simplement, sans jargon.",
        "Tu y découvres comment une plante respire, boit, cherche la lumière, pourquoi certaines grandissent vite et d’autres s’épuisent. Ce n’est pas un cours : juste une manière de regarder le vivant autrement.",
        "Chapitre après chapitre, tu apprends à repérer les signes essentiels — soif, chaleur, lumière, bien-être.",
        "Blossom, c’est apprendre à comprendre les plantes… et à mieux vivre avec elles."
      ]
    },
    en: {
      descriptionTitle: "About the book",
      descriptionText: [
        "We live surrounded by plants without really knowing how they work. Blossom opens this world simply, without jargon.",
        "You discover how a plant breathes, drinks, seeks light — why some grow fast and others struggle. It's not a lesson: just a new way to look at living things.",
        "Chapter by chapter, you learn key signs — thirst, heat, light, well-being.",
        "Blossom is about understanding plants… and learning to live better with them."
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