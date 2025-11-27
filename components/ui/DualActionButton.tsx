"use client";
import { useLang } from "@/hooks/useLang";

export default function DualActionButton({
  displateUrl,
  paperUrl,
}: {
  displateUrl: string;
  paperUrl: string;
}) {
  const { lang } = useLang();
  const labelPaper = lang === "en" ? "Paper" : "Papier";

  return (
    <div
      className="
        relative flex items-center justify-center
        w-full max-w-[900px] mx-auto mt-5
        rounded-3xl overflow-hidden
        bg-white/80 backdrop-blur-xl
        border border-white/70 shadow-[0_4px_28px_rgba(0,0,0,0.12)]
        transition-all duration-500
        hover:shadow-[0_8px_40px_rgba(0,0,0,0.18)]
      "
    >
      {/* Paper */}
      <a
        href={paperUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex-1 min-w-[150px]        /* ⬅️ IMPORTANT : largeur réaliste */
          py-3 text-center
          text-slate-800 font-medium tracking-wide text-[1.05rem]
          transition-all duration-300
          relative z-10
          hover:bg-white/90
        "
      >
        {labelPaper}
      </a>

      {/* Separator */}
      <div
        className="
          w-px h-10
          bg-gradient-to-b from-black/10 via-black/25 to-black/10
        "
      />

      {/* Displate */}
      <a
        href={displateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex-1 min-w-[150px]        /* ⬅️ IMPORTANT : largeur réaliste */
          py-3 text-center
          text-slate-800 font-medium tracking-wide text-[1.05rem]
          transition-all duration-300
          relative z-10
          hover:bg-white/90
        "
      >
        Displate
      </a>

      {/* Glow on hover */}
      <div
        className="
          absolute inset-0 rounded-3xl
          pointer-events-none opacity-0
          transition-opacity duration-500
          hover:opacity-70
          shadow-[0_0_60px_20px_rgba(255,255,255,0.45)]
        "
      />
    </div>
  );
}