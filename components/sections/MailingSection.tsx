// components/sections/MailingSection.tsx
"use client";

import PageSection from "@/components/layout/PageSection";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function MailingSection() {
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
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-slate-800 mb-4 sm:mb-6 text-center">
          Get notified when I’ll finish it !
        </h2>
        <p className="text-[0.95rem] sm:text-[1rem] md:text-[1.15rem] text-slate-700/90 leading-relaxed mb-8 sm:mb-10 text-center text-justify">
          Receive a free gift now, and the first chapter also free later when it’s available — Blossom wallpapers included 🌸
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-5"
        >
          <Input
            type="email"
            placeholder="your@email.com"
            aria-label="Email"
          />
          <Button variant="primary">
            Get the free gifts !
          </Button>
        </form>
      </div>
    </PageSection>
  );
}