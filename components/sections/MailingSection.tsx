// components/sections/MailingSection.tsx
"use client";

import PageSection from "@/components/layout/PageSection";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useLang } from "@/hooks/useLang";

export default function MailingSection() {
  const { lang } = useLang();

  // Traductions locales au composant
  const t = {
    title: {
      en: "Get notified when I finish it!",
      fr: "Sois prévenu(e) quand il sera terminé !",
    },
    text: {
      en: "Receive a free gift now, and the first chapter for free later when it's available — Blossom wallpapers included 🌸",
      fr: "Reçois un cadeau gratuit maintenant, et le premier chapitre gratuitement plus tard quand il sera disponible — fonds d’écran Blossom inclus 🌸",
    },
    placeholder: {
      en: "your@email.com",
      fr: "ton@email.com",
    },
    button: {
      en: "Get the free gifts!",
      fr: "Recevoir les cadeaux !",
    },
  };

  return (
    <PageSection id="mailing-section">
      <div
        className={`
          bg-white/10 md:bg-white/10
          backdrop-blur-none md:backdrop-blur-md
          border border-white/15 md:border-white/20
          shadow-[0_6px_24px_rgba(0,0,0,0.06)] md:shadow-[0_8px_40px_rgba(0,0,0,0.08)]
          rounded-2xl md:rounded-3xl
          px-6 py-10 md:px-14 md:py-16
          transition-all duration-500
          text-center md:text-justify
        `}
      >
        {/* TITLE */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-slate-800 mb-4 sm:mb-6 text-center">
          {t.title[lang]}
        </h2>

        {/* TEXT */}
        <p className="text-[0.95rem] sm:text-[1rem] md:text-[1.15rem] text-slate-700/90 leading-relaxed mb-8 sm:mb-10 text-center text-justify">
          {t.text[lang]}
        </p>

        {/* FORM */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-5"
        >
          <Input
            type="email"
            placeholder={t.placeholder[lang]}
            aria-label="Email"
          />
          <Button variant="primary">
            {t.button[lang]}
          </Button>
        </form>
      </div>
    </PageSection>
  );
}