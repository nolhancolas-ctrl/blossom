// components/ui/FancyTitle.tsx
"use client";

type Props = {
  title: string;
  description?: React.ReactNode;
  className?: string;
};

export default function FancyTitle({ title, description, className = "" }: Props) {
  return (
    <div className={`flex flex-col items-center text-center pt-20 ${className}`}>
      {/* TITLE */}
      <h1
        className="
          fancy-title
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl
          mb-0      /* ⬅️ on annule le margin-bottom global de h1 */
        "
      >
        {title}
      </h1>

      {/* DESCRIPTION (optionnelle) */}
      {description && (
        <p
        className="
            max-w-2xl mx-auto
            mt-[25px]
            text-slate-700/90 text-sm sm:text-base md:text-lg
            leading-relaxed
            mb-0
            text-justify [text-align-last:center]
        "
        >
          {description}
        </p>
      )}
    </div>
  );
}