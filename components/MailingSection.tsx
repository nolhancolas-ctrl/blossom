// components/MailingSection.tsx
"use client";
export default function MailingSection() {
  return (
    <section
      id="mailing-section"
      className="relative flex items-center justify-center px-14 sm:px-10 py-16 sm:py-24 mt-16 sm:mt-24 mb-16 sm:mb-24"
    >
      <div
        className={`
          w-full max-w-2xl mx-auto
          /* ⬇️ Mobile : léger fond sans blur, border douce, ombre subtile */
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
        {/* Titre */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-slate-800 mb-4 sm:mb-6 text-center">
          Get notified when I’ll finish it !
        </h2>

        {/* Sous-texte */}
        <p className="text-[0.95rem] sm:text-[1rem] md:text-[1.15rem] text-slate-700/90 leading-relaxed mb-8 sm:mb-10 text-center text-justify">
          Receive a free gift now, and the first chapter also free later when it’s available — Blossom wallpapers included 🌸
        </p>

        {/* Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-5"
        >

          {/* Champ email */}
          <input
            type="email"
            placeholder="your@email.com"
            className={`
              flex-1 h-14 px-5 rounded-lg md:rounded-xl
              bg-white/50                      /* ✅ fond blanc 50% opaque */
              backdrop-blur-md md:backdrop-blur-xl backdrop-saturate-150
              border border-white              /* ✅ bord opaque et fin */
              ring-1 ring-white/55 md:ring-white/45
              shadow-[inset_0_1px_1px_rgba(255,255,255,0.65),0_2px_8px_rgba(0,0,0,0.08)]
              text-slate-900 placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-white/90
              transition-all duration-300
              hover:bg-white hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.85),0_4px_14px_rgba(0,0,0,0.12)]
            `}
            style={{ lineHeight: 1 }}
          />

          {/* Bouton d’action (noir + shine) */}
          <button
            type="submit"
            className={`
              h-14 px-6 md:px-10
              bg-black text-white font-medium
              rounded-lg md:rounded-xl
              border border-black/20
              shadow-[0_2px_12px_rgba(0,0,0,0.15)]
              relative overflow-hidden
              transition-all duration-500
              hover:scale-[1.04] hover:shadow-[0_4px_25px_rgba(0,0,0,0.25)]
              group
            `}
          >
            <span className="relative z-10">Get the free gifts !</span>
            <span
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-x-full group-hover:translate-x-full"
              style={{ animation: "buttonShine 2.5s ease-in-out infinite" }}
            />
          </button>
        </form>
      </div>
    </section>
  );
}