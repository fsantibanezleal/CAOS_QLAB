// Citation infrastructure per ADR-0017 §4 / ADR-0016 §7.
//   • <CitationsProvider items={CITATIONS}> mounted once at the App root.
//   • <Refs ids={[…]} label /> — a per-section reference list (the house style).
//   • <Cite id paren /> — an inline reference inside prose.
// Never a full-registry / bottom-of-page bibliography dump.

import { createContext, useContext, useMemo } from "react";
import type { Citation } from "../data/citations";
import { useUI } from "./ui";

interface CitationsCtx {
  byId: Record<string, Citation>;
}

const Ctx = createContext<CitationsCtx>({ byId: {} });

export function CitationsProvider({
  items,
  children,
}: {
  items: Citation[];
  children: React.ReactNode;
}) {
  const byId = useMemo(
    () => Object.fromEntries(items.map((c) => [c.id, c])),
    [items],
  );
  return <Ctx.Provider value={{ byId }}>{children}</Ctx.Provider>;
}

export function useCitations() {
  return useContext(Ctx);
}

/** Build the canonical link for a citation: DOI preferred, else url. */
function hrefFor(c: Citation): string | undefined {
  if (c.doi) return `https://doi.org/${c.doi}`;
  return c.url;
}

/**
 * Per-section reference list. Pass the ids this section cites.
 * Renders only those entries, each with a real, clickable DOI/URL.
 */
export function Refs({
  ids,
  label,
}: {
  ids: string[];
  label?: string;
}) {
  const { byId } = useCitations();
  const { lang } = useUI();
  const heading = label ?? (lang === "en" ? "References" : "Referencias");
  const found = ids.map((id) => byId[id]).filter(Boolean) as Citation[];
  if (found.length === 0) return null;
  return (
    <div className="refs-block">
      <h4 className="refs-head">{heading}</h4>
      <ul className="fine refs-inline">
        {found.map((c) => {
          const href = hrefFor(c);
          return (
            <li key={c.id}>
              {c.citation}{" "}
              {c.doi ? (
                <a href={href} target="_blank" rel="noreferrer" className="ref-doi">
                  doi:{c.doi}
                </a>
              ) : href ? (
                <a href={href} target="_blank" rel="noreferrer" className="ref-doi">
                  {href.replace(/^https?:\/\//, "")}
                </a>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Inline citation inside prose. `paren` wraps it in brackets.
 * Renders the short label as a link to the DOI/URL.
 */
export function Cite({ id, paren }: { id: string; paren?: boolean }) {
  const { byId } = useCitations();
  const c = byId[id];
  if (!c) return null;
  const href = hrefFor(c);
  const inner = href ? (
    <a href={href} target="_blank" rel="noreferrer" className="cite-link" title={c.citation}>
      {c.label}
    </a>
  ) : (
    <span className="cite-link" title={c.citation}>
      {c.label}
    </span>
  );
  return paren ? <span className="cite">[{inner}]</span> : inner;
}
