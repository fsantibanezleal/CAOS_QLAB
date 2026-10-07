// Citations per ADR-0017 s4 / ADR-0016 s7, rendered by the shared shell: <CitationsProvider> once at the root,
// <Refs ids label> per section, <Cite id paren> inline. Never a bottom-of-page bibliography dump.
import { Refs as ShellRefs } from "@fasl-work/caos-app-shell";
import { useUI } from "./ui";

export { Cite, CitationsProvider } from "@fasl-work/caos-app-shell";

/** The shell's per-section reference list, with QLab's default heading. */
export function Refs({ ids, label }: { ids: string[]; label?: string }) {
  const { lang } = useUI();
  return <ShellRefs ids={ids} label={label ?? (lang === "en" ? "References" : "Referencias")} />;
}
