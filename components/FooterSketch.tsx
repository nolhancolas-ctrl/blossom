"use client";

type Props = {
  className?: string;
  /** Image de fond à réutiliser et flouter (la même que ta page) */
  bgUrl?: string;
  /** Adresse email pour le CTA */
  email?: string;
};

export default function FooterBlurry({
  className = "",
  bgUrl = "/blossom_background.jpg",
  email = "hello@blossom.example",
}: Props) {
  return (
    <footer
      className={`relative ${className}`}
      aria-labelledby="footer-title"
    >
      {/* ===== Fond flou & éclairci (copie du fond d’écran) ===== */}
      <div className="absolute inset-0 -z-10 overflow-hidden isolate">

        {/* image floutée (ne floute PAS les enfants) */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
          style={{ backgroundImage: `url('${bgUrl}')` }}
        />
        {/* voile éclaircissant */}
        <div className="absolute inset-0 bg-white/55" />
      </div>

      {/* ===== Fine ligne séparatrice (20px de marge latérale) ===== */}
      <div className="absolute top-0 left-5 right-5 h-px bg-black/10 dark:bg-white/15 rounded-full" />

      {/* ===== Contenu ===== */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-10">

        {/* Grille forcée : gauche (2 cartes empilées), droite (1 carte sur 2 rangées) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:grid-rows-2 md:auto-rows-fr">
{/* 1️⃣ Something to say */}
<section className="rounded-2xl border border-black/10 bg-white/55 backdrop-blur-md shadow-lg p-6 md:h-full flex flex-col items-center justify-center text-center gap-3">
  <h3 className="text-xl font-medium tracking-tight">Something to say ? Iread everything.</h3>
    <a
      href={`mailto:${email}`}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/80 shadow-sm px-3 py-1 hover:shadow-md transition hover:bg-white/90"
      aria-label="Send a mail"
    >
      <span className="text-[12px] font-normal text-slate-800 tracking-wide">
        send me a mail
      </span>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-black/10 bg-black text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
          aria-hidden
        >
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  </span>
</a>
</section>

{/* 2️⃣ Elsewhere */}
<section className="rounded-2xl border border-black/10 bg-white/55 backdrop-blur-md shadow-lg p-6 md:h-full flex flex-col items-center justify-center text-center gap-4">
  <h3 className="text-xl font-medium tracking-tight">Elsewhere around the web.</h3>
  <div className="flex flex-wrap justify-center gap-2">
    <a
      href="https://www.instagram.com/"
      target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/75 shadow-sm px-3 py-1 hover:shadow-md transition hover:bg-white/90 text-[12px] font-normal text-slate-800 tracking-wide"    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6-1.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z"/>
      </svg>
      Instagram
    </a>

    <a
      href="https://www.tiktok.com/"
      target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/75 shadow-sm px-3 py-1 hover:shadow-md transition hover:bg-white/90 text-[12px] font-normal text-slate-800 tracking-wide" >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path d="M14 3c.5 3.1 2.5 5 5 5v3c-1.9 0-3.6-.6-5-1.6V16a5 5 0 1 1-5-5c.3 0 .7 0 1 .1V14a2 2 0 1 0 2 2V3h2Z"/>
      </svg>
      TikTok
    </a>
  </div>
</section>

{/* 3️⃣ Not about me */}
<section className="rounded-2xl border border-black/10 bg-white/55 backdrop-blur-md shadow-lg p-8 md:col-start-2 md:row-start-1 md:row-span-2 md:h-full flex flex-col justify-center text-center md:text-justify">
  <h3 className="text-xl font-medium tracking-tight mb-4 text-center md:text-left">Not about me</h3>
  <p className="text-slate-800/90 leading-relaxed max-w-prose mx-auto md:mx-0">
I’m not a growth hacker, not a guru, not a monk. I’m not here to optimize your morning routine or preach a perfect method. I’m not a productivity machine, nor a brand in disguise. I draw, I learn, I share — simple as that. And even if I'm graduated, I'm definitely not an engineer.  </p>
</section>        </div> 

        {/* Bas du footer centré */}
        <div className="mt-8 pt-2 w-full flex items-center justify-center text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Blossom. All rights reserved.
        </div>
      </div>
    </footer>
  );
}