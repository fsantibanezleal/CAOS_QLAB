// TypeScript mirror of the QLab data contracts (qlab/core/trace.py, manifest.py, pipeline.py bundle).
// ADR-0057: this must track the Python schema — if it drifts, the build/types break. Keep in lockstep.

export interface Bilingual {
  en: string;
  es: string;
}

export interface Amp {
  re: number;
  im: number;
}

/** One animation frame: the state immediately after applying `gate` (schema qlab-trace/1). */
export interface Step {
  index: number;
  gate: string;
  targets: number[];
  label: Bilingual;
  statevector: Amp[]; // 2^n amplitudes, little-endian (qubit 0 = LSB)
  bloch: number[][]; // per-qubit [x, y, z]
  probabilities: number[];
  params: number[];
}

export interface Measurements {
  counts: Record<string, number>;
  shots: number;
}

export interface CircuitOp {
  gate: string;
  targets: number[];
  params: number[];
}

export interface Provenance {
  engine: string;
  engine_version: string;
  seed: number;
  lane: string;
  ran_on: string;
}

/** A replayable recording of one circuit run. */
export interface Trace {
  schema_version: string;
  case_id: string;
  title: Bilingual;
  concept: Bilingual;
  qubits: number;
  steps: Step[];
  measurements: Measurements;
  circuit_ops: CircuitOp[];
  provenance: Provenance;
  references: Reference[];
  extra: Record<string, unknown>;
}

export type Paradigm = "quantum-sim" | "quantum-hardware" | "classical";

export interface SolverResult {
  solver: string;
  label: Bilingual;
  framework: string;
  paradigm: Paradigm;
  value: Record<string, unknown>;
  cost: Record<string, unknown>;
  notes?: Bilingual;
  optimal?: boolean;
  extra?: Record<string, unknown>;
}

export interface Reference {
  label: string;
  doi?: string;
  url?: string;
}

export interface Comparison {
  verdict?: Bilingual;
  [k: string]: unknown;
}

export interface Instance {
  id: string;
  title: Bilingual;
  params: Record<string, unknown>;
  note: Bilingual;
}

/** The per-(case, variant) artifact the web app replays. */
export interface Bundle {
  schema_version: string;
  case_id: string;
  category: string;
  title: Bilingual;
  concept: Bilingual;
  metric: Bilingual;
  instance: Instance;
  qubits: number;
  lane: string;
  lane_reasons: string[];
  seed: number;
  shots: number;
  primary_solver: string;
  trace: Trace | null;
  solvers: SolverResult[];
  comparison: Comparison;
  references: Reference[];
}

// --- the generated catalog index (web/copy-data.mjs → public/data/catalog.json) ---

export interface CatalogVariant {
  id: string;
  title: Bilingual;
  note: Bilingual;
  lane: string;
  primary_solver: string;
  verdict: Bilingual | null;
  solvers: Pick<SolverResult, "solver" | "label" | "framework" | "paradigm" | "value">[];
  path: string;
}

export interface CatalogCase {
  id: string;
  title: Bilingual;
  category: string;
  concept: Bilingual;
  metric: Bilingual;
  references: Reference[];
  variants: CatalogVariant[];
}

export interface Catalog {
  schema: string;
  count: number;
  cases: CatalogCase[];
}

export const CATEGORY_LABELS: Record<string, Bilingual> = {
  fundamentals: { en: "Fundamentals", es: "Fundamentos" },
  entanglement: { en: "Entanglement", es: "Entrelazamiento" },
  "oracle-algorithms": { en: "Oracle algorithms", es: "Algoritmos de oráculo" },
  "flagship-algorithms": { en: "Flagship algorithms", es: "Algoritmos insignia" },
  variational: { en: "Variational", es: "Variacionales" },
  "noise-and-qec": { en: "Noise & error correction", es: "Ruido y corrección" },
  compilation: { en: "Compilation", es: "Compilación" },
};
