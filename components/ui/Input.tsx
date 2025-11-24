// components/ui/Input.tsx
"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  fullGlass?: boolean; // force-glass (rarement utile mais on garde)
};

export default function Input({
  className,
  fullGlass = false,
  ...rest
}: Props) {
  return (
    <input
      {...rest}
      className={cn(
        // === Structure & taille ===
        "w-full h-[62px] px-5 rounded-lg md:rounded-xl",
        "text-sm sm:text-base",
        "text-slate-900 placeholder-slate-500",
        "transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-white/90",

        // === BASE GLASS (VERSION ORIGINALE) ===
        fullGlass
          ? [
              "glass-button-text",
              "bg-white/90",
              "border border-white",
              "ring-1 ring-white/55 md:ring-white/45",
              "shadow-[inset_0_1px_1px_rgba(255,255,255,0.65),0_2px_8px_rgba(0,0,0,0.08)]",
              "backdrop-blur-md md:backdrop-blur-xl backdrop-saturate-150",
            ].join(" ")
          : [
              // VERSION REGULAR GLASS (celle que tu utilisais dans Mailing)
              "bg-white/50",
              "border border-white",
              "ring-1 ring-white/55 md:ring-white/45",
              "backdrop-blur-md md:backdrop-blur-xl backdrop-saturate-150",
              "shadow-[inset_0_1px_1px_rgba(255,255,255,0.65),0_2px_8px_rgba(0,0,0,0.08)]",

              // Hover Apple
              "hover:bg-white",
              "hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.85),0_4px_14px_rgba(0,0,0,0.12)]",
            ].join(" "),

        className
      )}
      style={{ lineHeight: 1 }}
    />
  );
}