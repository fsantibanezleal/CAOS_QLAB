import { createContext, useContext, useEffect, useState } from "react";
import type { Bilingual } from "./contract.types";

export type Lang = "en" | "es";
export type Theme = "light" | "dark";

interface UI {
  lang: Lang;
  theme: Theme;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
}

const UIContext = createContext<UI>({ lang: "en", theme: "dark", setLang: () => {}, setTheme: () => {} });

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("qlab-lang") as Lang) || "en");
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("qlab-theme") as Theme) || "dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem("qlab-theme", theme);
    localStorage.setItem("qlab-lang", lang);
  }, [theme, lang]);
  return <UIContext.Provider value={{ lang, theme, setLang, setTheme }}>{children}</UIContext.Provider>;
}

export function useUI() {
  return useContext(UIContext);
}

/** Pick the active-language string from a bilingual field. */
export function useT() {
  const { lang } = useUI();
  return (b: Bilingual | null | undefined) => (b ? b[lang] : "");
}
