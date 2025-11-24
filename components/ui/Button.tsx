// components/ui/Button.tsx
"use client";

import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  as?: "button" | "a";
  href?: string;
  variant?: "primary" | "glass" | "black";
  className?: string;
} & React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>;

export default function Button({
  children,
  as = "button",
  href,
  variant = "primary", // primary = bouton noir; glass = ancien bouton glass
  className = "",
  ...props
}: Props) {
  const Component: any = as;

  const base = "h-[62px] inline-flex items-center justify-center transition-all duration-300";

  const variants = {
    glass: "glass-button",                         // ← ton ancien style complet
    primary:
      "rounded-xl px-6 py-3 bg-black text-white font-medium shadow-md hover:scale-[1.04] " +
      "relative overflow-hidden group",
    black:
      "rounded-xl px-6 py-3 bg-black text-white font-medium shadow-md hover:scale-[1.04] " +
      "relative overflow-hidden group",
  };

  return (
    <Component
      href={href}
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {/* Texte */}
      <span className="relative z-10">{children}</span>

      {/* — Shine pour boutons noirs — */}
      {variant === "primary" || variant === "black" ? (
        <span
          className="
            pointer-events-none absolute inset-0 
            bg-gradient-to-r from-transparent via-white/60 to-transparent
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-1000 -translate-x-full group-hover:translate-x-full
          "
          style={{ animation: "buttonShine 2.5s ease-in-out infinite" }}
        />
      ) : null}
    </Component>
  );
}