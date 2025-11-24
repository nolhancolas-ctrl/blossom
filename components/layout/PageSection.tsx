// components/layout/PageSection.tsx
"use client";
import { cn } from "@/lib/utils";

type PageSectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "hero" | "tight";
};

export default function PageSection({
  id,
  children,
  className,
  variant = "default",
}: PageSectionProps) {
  const vertical = (() => {
    switch (variant) {
      case "hero":
        return "py-6 sm:py-6";
      case "tight":
        return "py-6 sm:py-10";
      default:
        return "py-8 sm:py-10";
    }
  })();

  return (
    <section
      id={id}
      className={cn(
        "site-section relative flex w-full items-center justify-center",
        "px-11 sm:px-10 lg:px-14",
        vertical,
        className
      )}
    >
      {/* 🌟 WRAPPER GLOBAL UNIQUE POUR TOUTES LES SECTIONS */}
      <div className="w-full max-w-2xl mx-auto">
        {children}
      </div>
    </section>
  );
}