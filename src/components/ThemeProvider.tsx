"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeChoice = "system" | "light" | "dark";
const STORAGE_KEY = "pp-theme";

type Ctx = { choice: ThemeChoice; resolved: "light" | "dark"; setChoice: (c: ThemeChoice) => void };
const ThemeContext = createContext<Ctx | null>(null);

/** Inline script (runs before paint) so there's no flash of the wrong theme. */
export const themeInitScript = `(function(){try{var c=localStorage.getItem('${STORAGE_KEY}')||'system';var d=c==='dark'||(c==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){}})();`;

function systemPrefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  const apply = useCallback((c: ThemeChoice) => {
    const dark = c === "dark" || (c === "system" && systemPrefersDark());
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    setResolved(dark ? "dark" : "light");
  }, []);

  useEffect(() => {
    let stored: ThemeChoice = "system";
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "light" || v === "dark" || v === "system") stored = v;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with storage after hydration
    setChoiceState(stored);
    apply(stored);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let current: string | null = "system";
      try {
        current = localStorage.getItem(STORAGE_KEY) ?? "system";
      } catch {}
      if (current === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [apply]);

  const setChoice = useCallback(
    (c: ThemeChoice) => {
      try {
        localStorage.setItem(STORAGE_KEY, c);
      } catch {}
      setChoiceState(c);
      apply(c);
    },
    [apply],
  );

  return <ThemeContext.Provider value={{ choice, resolved, setChoice }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
