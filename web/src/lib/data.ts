import type { Bundle, Catalog } from "./contract.types";

const BASE = import.meta.env.BASE_URL;

/** Load the generated catalog index (all cases + variants + verdicts). */
export async function loadCatalog(): Promise<Catalog> {
  const res = await fetch(`${BASE}data/catalog.json`);
  if (!res.ok) throw new Error(`catalog.json ${res.status}`);
  return res.json();
}

/** Load one full trace bundle on demand (the heavy per-variant artifact). */
export async function loadBundle(path: string): Promise<Bundle> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json();
}
