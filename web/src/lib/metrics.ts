// The Benchmark's live metrics, as pure functions of committed counts (no React, so `node --test` runs them).
import type { Bilingual, Bundle } from "./contract.types.ts";

export type LiveMetric = "grover-success" | "chsh-S" | "qrng-entropy";

export type Counts = Record<string, number>;

const total = (counts: Counts) => Object.values(counts).reduce((a, x) => a + x, 0);

/** mulberry32: a small seeded PRNG, so a subsample is reproducible. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A uniform sample of `budget` shots without replacement from the committed counts, seeded. The samples for
 *  increasing budgets are nested (prefixes of one shuffle), so a convergence sweep moves one sample, not many. */
export function subsampleCounts(counts: Counts, budget: number, seed = 42): Counts {
  const shots: string[] = [];
  for (const k of Object.keys(counts).sort()) for (let i = 0; i < counts[k]; i++) shots.push(k);
  const n = Math.max(0, Math.min(budget, shots.length));
  const rand = rng(seed);
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(rand() * (shots.length - i));
    [shots[i], shots[j]] = [shots[j], shots[i]];
  }
  const out: Counts = {};
  for (let i = 0; i < n; i++) out[shots[i]] = (out[shots[i]] ?? 0) + 1;
  return out;
}

export function shannonBits(counts: Counts): number {
  const n = total(counts);
  let h = 0;
  for (const v of Object.values(counts)) if (v > 0) h -= (v / n) * Math.log2(v / n);
  return n ? h : 0;
}

/** P(marked): the share of shots on the declared marked set, summed over every marked item. A run that
 *  amplified the wrong item reads about 0, and a perfect two-marked run reads about 1. */
export function markedShare(counts: Counts, marked: string[]): number {
  const n = total(counts);
  return n ? marked.reduce((s, k) => s + (counts[k] ?? 0), 0) / n : 0;
}

/** CHSH S from the optimal-protocol correlator: <AB> = P(equal) - P(differ), and at the optimal angles each of
 *  the four correlators has |<A_i B_j>| = |<AB>|/sqrt(2), so S = 4|<AB>|/sqrt(2). */
export function chshS(counts: Counts): number {
  const n = total(counts);
  const equal = (counts["00"] ?? 0) + (counts["11"] ?? 0);
  return n ? (4 * Math.abs((2 * equal) / n - 1)) / Math.SQRT2 : 0;
}

/** Probability that a classical scan without replacement finds one of M marked among N within q queries. */
export function classicalHitProbability(N: number, M: number, q: number): number {
  let miss = 1;
  for (let i = 0; i < q; i++) miss *= Math.max(0, N - M - i) / (N - i);
  return 1 - miss;
}

export function groverMarked(b: Bundle): string[] {
  return ((b.trace?.extra?.marked as string[] | undefined) ?? []).slice();
}

export function recompute(metric: LiveMetric, counts: Counts, b: Bundle): { value: number; total: number } {
  if (metric === "qrng-entropy") return { value: shannonBits(counts), total: total(counts) };
  if (metric === "grover-success") return { value: markedShare(counts, groverMarked(b)), total: total(counts) };
  return { value: chshS(counts), total: total(counts) };
}

export function classicalRef(metric: LiveMetric, b: Bundle): { value: number; label: Bilingual } {
  if (metric === "grover-success") {
    const n = b.trace?.qubits ?? 0;
    const q = Number(b.trace?.extra?.iterations ?? 0);
    const p = classicalHitProbability(2 ** n, groverMarked(b).length, q);
    return { value: p, label: {
      en: `classical scan with the same ${q} oracle quer${q === 1 ? "y" : "ies"} on N=${2 ** n}`,
      es: `barrido clásico con las mismas ${q} consulta${q === 1 ? "" : "s"} al oráculo sobre N=${2 ** n}` } };
  }
  if (metric === "chsh-S") return { value: 2.0, label: { en: "local-hidden-variable bound S = 2", es: "cota de variables ocultas locales S = 2" } };
  const n = b.trace?.qubits ?? 0;
  return { value: n, label: { en: `ideal PRNG entropy = ${n} bits (${n} qubits)`, es: `entropía de PRNG ideal = ${n} bits (${n} qubits)` } };
}
