"use client";

export default function MailingSection() {
  return (
    <section
      id="mailing-section"
      className="relative flex items-center justify-center px-8 py-24 mt-24 mb-24"
    >
      <div
        className={`
          w-full max-w-2xl mx-auto
          bg-transparent md:bg-white/10 md:backdrop-blur-md
          rounded-2xl md:rounded-3xl
          border border-transparent md:border-white/20
          shadow-none md:shadow-[0_8px_40px_rgba(0,0,0,0.08)]
          px-8 py-12 md:px-14 md:py-16
          transition-all duration-500
          text-center md:text-justify
        `}
      >
        {/* === Titre principal === */}
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-slate-800 mb-6 text-center">
          Get notified when I’ll finish it !
        </h2>

        {/* === Sous-texte explicatif === */}
        <p className="text-[1rem] md:text-[1.25rem] text-slate-700/90 leading-relaxed mb-10 text-center md:text-justify">
          Receive a free gift now, and the first chapter also free later when it’s available — Blossom wallpapers included 🌸
        </p>

        {/* === Formulaire === */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-5"
        >
          {/* Champ email */}
          <input
            type="email"
            placeholder="your@email.com"
            className={`
              flex-1 h-14
              bg-white/60 md:bg-white/40
              text-slate-800 placeholder-slate-500
              px-5 rounded-lg md:rounded-xl
              border border-slate-300/50
              focus:outline-none focus:ring-2 focus:ring-slate-400/40
              transition-all duration-300
            `}
          />
          {/* Bouton d’action */}
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
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-x-full group-hover:translate-x-full"
              style={{
                animation: "buttonShine 2.5s ease-in-out infinite",
              }}
            />
          </button>
        </form>
      </div>
    </section>
  );
}