"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/hooks/useLang";
import type { LucideIcon } from "lucide-react";
import { Globe, Home, Image as ImageIcon, Menu } from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, toggleLang } = useLang();

  const menuItems: MenuItem[] = [
    { label: lang === "en" ? "Home" : "Accueil", href: "/", icon: Home },
    { label: lang === "en" ? "Posters" : "Posters", href: "/shop", icon: ImageIcon },
  ];

  return (
    <nav className="fixed top-4 right-4 z-50 flex items-center justify-end">
      
      {/* Hamburger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          p-3 rounded-full shadow-md
          bg-white/70 backdrop-blur-md
          border border-white/40
          hover:bg-white/90 transition
        "
        aria-label="Open navigation"
      >
        <Menu size={22} className="text-slate-700" />
      </button>

      {/* Menu */}
      <div
        className={`
          absolute top-14 right-0 w-48
          bg-white/80 backdrop-blur-xl
          shadow-xl rounded-xl border border-white/40
          transition-all duration-300 overflow-hidden
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
        `}
      >
        <ul className="flex flex-col py-2">

          {/* HOME (force reload) */}
          <li>
            <button
              onClick={() => {
                setOpen(false);
                window.location.href = "/";  // ⬅️ reload forcé
              }}
              className="
                w-full text-left flex items-center gap-3 px-4 py-3
                text-slate-700 hover:bg-slate-100/60
                transition rounded-md
              "
            >
              <Home size={18} className="text-slate-600" />
              <span>{lang === "en" ? "Home" : "Accueil"}</span>
            </button>
          </li>

          {/* POSTERS (navigation normale, pas de reload) */}
          <li>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="
                flex items-center gap-3 px-4 py-3
                text-slate-700 hover:bg-slate-100/60
                transition rounded-md
              "
            >
              <ImageIcon size={18} className="text-slate-600" />
              <span>{lang === "en" ? "Posters" : "Posters"}</span>
            </Link>
          </li>

          {/* LANGUAGE SWITCH */}
          <li>
            <button
              onClick={() => {
                toggleLang();
                setOpen(false);
              }}
              className="
                flex w-full items-center gap-3 px-4 py-3
                text-slate-700 hover:bg-slate-100/60
                transition rounded-md
              "
            >
              <Globe size={18} className="text-slate-600" />
              <span>{lang === "en" ? "Français" : "English"}</span>
            </button>
          </li>

        </ul>
      </div>
    </nav>
  );
}