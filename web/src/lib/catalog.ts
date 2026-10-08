import { useEffect, useState } from "react";
import type { Catalog, CatalogCase } from "./contract.types";
import { loadCatalog } from "./data";

/** The case the App lands on: a small, fully live entanglement case. */
export const DEFAULT_CASE = "state-prep";

/** Category display order, beginner to advanced. */
export const CATEGORY_ORDER = [
  "fundamentals",
  "entanglement",
  "oracle-algorithms",
  "flagship-algorithms",
  "variational",
  "noise-and-qec",
  "compilation",
];

export function useCatalog() {
  const [cat, setCat] = useState<Catalog | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    loadCatalog().then(setCat).catch((e) => setErr(String(e)));
  }, []);
  return { cat, err };
}

/** Cases grouped and ordered by category; a category not in CATEGORY_ORDER comes last. */
export function groupByCategory(cases: CatalogCase[]): [string, CatalogCase[]][] {
  const byCat = new Map<string, CatalogCase[]>();
  for (const c of cases) {
    if (!byCat.has(c.category)) byCat.set(c.category, []);
    byCat.get(c.category)!.push(c);
  }
  const ordered: [string, CatalogCase[]][] = [];
  for (const k of CATEGORY_ORDER) if (byCat.has(k)) ordered.push([k, byCat.get(k)!]);
  for (const [k, v] of byCat) if (!CATEGORY_ORDER.includes(k)) ordered.push([k, v]);
  return ordered;
}
