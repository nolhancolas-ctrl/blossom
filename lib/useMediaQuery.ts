"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery
 * Small, safe and robust hook to track a CSS media query in React.
 *
 * @example
 *   const isMobile = useMediaQuery("(max-width: 768px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Prevent crash during SSR
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);

    // Set initial state
    setMatches(mql.matches);

    // Listener (addEventListener for modern browsers)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    if (mql.addEventListener) {
      mql.addEventListener("change", listener);
    } else {
      // Fallback for older Safari
      mql.addListener(listener);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", listener);
      } else {
        mql.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}