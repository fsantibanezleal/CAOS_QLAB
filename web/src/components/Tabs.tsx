import katex from "katex";
import { type ReactNode, useState } from "react";
import { useUI } from "../lib/ui";
import type { Bilingual } from "../lib/contract.types";

export interface TabDef {
  id: string;
  label: string;
  badge?: string; // optional chip, e.g. "learned"
  content: ReactNode;
}

/** A reusable sub-tab strip + panel (used by the Methodology / Implementation / Experiments pages). */
export function Tabs({ tabs, initial }: { tabs: TabDef[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id);
  const cur = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div className="tabs">
      <div className="tabbar" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={t.id === active}
                  className={`tab ${t.id === active ? "on" : ""}`} onClick={() => setActive(t.id)}>
            {t.label}
            {t.badge && <span className="tab-badge">{t.badge}</span>}
          </button>
        ))}
      </div>
      <div className="tabpanel" role="tabpanel">{cur?.content}</div>
    </div>
  );
}

/**
 * A centered display equation, typeset with KaTeX (font-based HTML — deterministic
 * to screenshot). `caption` is bilingual (ADR-0017 §2: every <Equation> carries a
 * bilingual caption=) and renders under the math block.
 */
export function Eq({ tex, caption }: { tex: string; caption?: Bilingual }) {
  const { lang } = useUI();
  const html = katex.renderToString(tex, { displayMode: true, throwOnError: false });
  return (
    <div className="equation">
      <div className="eq-math" dangerouslySetInnerHTML={{ __html: html }} />
      {caption && <div className="eq-cap">{caption[lang]}</div>}
    </div>
  );
}

/** Inline KaTeX (for math inside a sentence). */
export function Tex({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, { displayMode: false, throwOnError: false });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
