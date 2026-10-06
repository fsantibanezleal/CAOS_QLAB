// Language and theme come from the shared shell's stores (caos.lang, caos.theme), so a choice made on any CAOS
// app carries over. useUI keeps the shape the pages already read.
import { useLangStore, useShellLang, useThemeStore } from "@fasl-work/caos-app-shell";
import type { Bilingual } from "./contract.types";

export type Lang = "en" | "es";
export type Theme = "light" | "dark";

export function useUI(): { lang: Lang; theme: Theme; setLang: (l: Lang) => void; setTheme: (t: Theme) => void } {
  const lang = useShellLang();
  const setLang = useLangStore((s) => s.setLang);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  return { lang, theme, setLang, setTheme };
}

/** Pick the active-language string from a bilingual field. */
export function useT() {
  const { lang } = useUI();
  return (b: Bilingual | null | undefined) => (b ? b[lang] : "");
}
