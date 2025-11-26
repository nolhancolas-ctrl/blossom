"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// 1) DICTIONNAIRES DE TRAD
// ---------------------------------------------------------------------------
const translations = {
  en: {
    mailing_title: "Get notified when I finish it!",
    mailing_text:
      "Receive a free gift now, and the first chapter later when it's available — Blossom wallpapers included 🌸",
    mailing_button: "Get the free gifts!",

    posters_note: "Available as paper prints and metal posters (Displate).",
  },

  fr: {
    mailing_title: "Sois prévenu quand j’aurai terminé !",
    mailing_text:
      "Reçois un cadeau maintenant, et le premier chapitre gratuitement quand il sera disponible — fonds d’écran Blossom inclus 🌸",
    mailing_button: "Recevoir les cadeaux !",

    posters_note:
      "Disponible en impression papier et en posters métalliques (Displate).",
  },
};

// ---------------------------------------------------------------------------
// 2) CONTEXT
// ---------------------------------------------------------------------------
type Lang = "en" | "fr";

type LangContextType = {
  lang: Lang;
  t: (key: keyof (typeof translations)["en"]) => string;
  toggleLang: () => void;
};

const LangContext = createContext<LangContextType | null>(null);

// ---------------------------------------------------------------------------
// 3) PROVIDER
// ---------------------------------------------------------------------------
export function LangProvider({ children }: { children: ReactNode }) {
  // 🔥 langue par défaut = "en"
  const [lang, setLang] = useState<Lang>("en");

  // Charger localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("blossom-lang") as Lang | null;
      if (stored === "en" || stored === "fr") {
        setLang(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Sauvegarder lorsqu'on change
  useEffect(() => {
    try {
      localStorage.setItem("blossom-lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "fr" : "en"));
  };

  const t = (key: keyof (typeof translations)["en"]) => {
    return translations[lang][key] || "";
  };

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// 4) HOOK useLang()
// ---------------------------------------------------------------------------
export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error(
      "useLang() used outside <LangProvider>. Wrap your app in <LangProvider>."
    );
  }
  return ctx;
}