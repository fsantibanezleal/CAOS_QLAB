// QLab's documentation primitives, rendered by the shared shell's components (Tabs, Equation, InlineMath,
// Callout). The wrappers only adapt QLab's bilingual fields to the shell's props.
import { Callout as ShellCallout, Equation, InlineMath, TabGroups, Tabs as ShellTabs } from "@fasl-work/caos-app-shell";
import type { ReactNode } from "react";
import type { Bilingual } from "../lib/contract.types";
import { useUI } from "../lib/ui";

export interface TabDef {
  id: string;
  label: string;
  badge?: string; // optional chip, e.g. "learned"
  content: ReactNode;
}

/** Groups of tab ids, each answering one question: past six peer tabs the shell requires grouping (ADR-0071 r5). */
export interface TabGroup { id: string; label: string; tabs: string[] }

export function Tabs({ tabs, initial, groups, ariaLabel }: {
  tabs: TabDef[]; initial?: string; groups?: TabGroup[]; ariaLabel?: string;
}) {
  const defs = tabs.map((t) => ({
    id: t.id,
    content: t.content,
    label: t.badge ? <>{t.label}<span className="qlab-tab-badge">{t.badge}</span></> : t.label,
  }));
  if (!groups) return <ShellTabs ariaLabel={ariaLabel} initial={initial} tabs={defs} />;
  const byId = new Map(defs.map((d) => [d.id, d]));
  const grouped = groups.flatMap((g) => g.tabs);
  if (grouped.length !== defs.length || grouped.some((id) => !byId.has(id))) {
    throw new Error(`tab groups must hold every tab exactly once: ${grouped.join(", ")}`);
  }
  return (
    <TabGroups
      ariaLabel={ariaLabel}
      groups={groups.map((g) => ({ id: g.id, label: g.label, tabs: g.tabs.map((id) => byId.get(id)!) }))}
    />
  );
}

/** A display equation; `caption` is bilingual (ADR-0017 s2: every equation carries one). */
export function Eq({ tex, caption }: { tex: string; caption?: Bilingual }) {
  const { lang } = useUI();
  return <Equation tex={tex} caption={caption?.[lang]} />;
}

/** Inline math inside a sentence. */
export function Tex({ tex }: { tex: string }) {
  return <InlineMath tex={tex} />;
}

/** The quantum-vs-classical note: the shell's honest callout, its verdict in bold. */
export function Callout({ title, children, pt }: { title: string; children: ReactNode; pt?: ReactNode }) {
  return (
    <ShellCallout variant="honest" title={title}>
      {children}
      {pt && <strong className="qlab-callout-pt"> {pt}</strong>}
    </ShellCallout>
  );
}
