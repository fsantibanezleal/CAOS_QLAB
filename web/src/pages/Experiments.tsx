import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Eq, type TabDef, Tabs } from "../components/Tabs";
import { Refs } from "../lib/citations";
import type { Catalog, CatalogCase } from "../lib/contract.types";
import { CATEGORY_LABELS } from "../lib/contract.types";
import { loadCatalog } from "../lib/data";
import { useUI } from "../lib/ui";

type Lang = "en" | "es";

/* ──────────────────────────────────────────────────────────────────────────
   The honest scope callout — the shell .callout token (theme-aware), with a
   bold quantum-vs-classical / leakage verdict (ADR-0017 §2).
   ──────────────────────────────────────────────────────────────────────── */
function Callout({ title, children, pt }: { title: string; children: ReactNode; pt?: ReactNode }) {
  return (
    <div className="callout">
      <strong>{title}</strong> {children}
      {pt && <span className="callout-pt">{pt}</span>}
    </div>
  );
}

/* Shared arrowhead marker (themed via .arch-arrowhead). */
function Head({ id }: { id: string }) {
  return (
    <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 Z" className="arch-arrowhead" />
    </marker>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Hand-authored, theme-aware SVGs. Every fill/stroke is a semantic class wired
   to a CSS var (zero hex; the two error/strike accents use the shared green/red
   the shell already uses for is/isnt). Labels are real protocol flows.
   ════════════════════════════════════════════════════════════════════════ */

/** The reproducibility protocol: (params, seed) → one execution path → exact
 *  statevector + one seeded sampler → committed trace that replays bit-for-bit. */
function ReproDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "ex-repro";
  return (
    <svg viewBox="0 0 760 220" className="arch-svg" role="img"
         aria-label={en ? "Seeded, reproducible execution path" : "Camino de ejecución con semilla, reproducible"}>
      <defs><Head id={m} /></defs>
      <rect className="arch-box arch-box-key" x="14" y="74" width="150" height="66" rx="8" />
      <text className="arch-t" x="89" y="100" textAnchor="middle">(params, seed)</text>
      <text className="arch-s" x="89" y="120" textAnchor="middle">{en ? "seed = 42 fixed" : "seed = 42 fijo"}</text>
      <path className="arch-arrow" d="M164 107 L214 107" markerEnd={`url(#${m})`} />

      <rect className="arch-contract" x="214" y="62" width="160" height="90" rx="8" />
      <text className="arch-t" x="294" y="86" textAnchor="middle">{en ? "exact statevector" : "statevector exacto"}</text>
      <text className="arch-s" x="294" y="106" textAnchor="middle">U|ψ₀⟩ {en ? "(deterministic)" : "(determinista)"}</text>
      <text className="arch-s arch-em" x="294" y="124" textAnchor="middle">{en ? "no randomness here" : "sin azar aquí"}</text>
      <text className="arch-s" x="294" y="142" textAnchor="middle">{en ? "amplitudes are pure functions" : "amplitudes = funciones puras"}</text>
      <path className="arch-arrow" d="M374 107 L424 107" markerEnd={`url(#${m})`} />

      <rect className="arch-box" x="424" y="62" width="150" height="90" rx="8" />
      <text className="arch-t" x="499" y="86" textAnchor="middle">{en ? "ONE seeded sampler" : "UN sampler con semilla"}</text>
      <text className="arch-s" x="499" y="106" textAnchor="middle">np.random.default_rng(42)</text>
      <text className="arch-s arch-em" x="499" y="124" textAnchor="middle">{en ? "the only stochastic step" : "el único paso estocástico"}</text>
      <text className="arch-s" x="499" y="142" textAnchor="middle">{en ? "shots = 2048" : "shots = 2048"}</text>
      <path className="arch-arrow" d="M574 107 L624 107" markerEnd={`url(#${m})`} />

      <rect className="arch-spa" x="624" y="74" width="122" height="66" rx="8" />
      <text className="arch-t" x="685" y="100" textAnchor="middle">{en ? "committed trace" : "traza commiteada"}</text>
      <text className="arch-s arch-em" x="685" y="120" textAnchor="middle">{en ? "replays bit-for-bit" : "replay bit a bit"}</text>

      <text className="arch-s" x="380" y="36" textAnchor="middle">{en
        ? "a run is a pure function of (params, seed) — re-running reproduces the committed counts exactly"
        : "una ejecución es función pura de (params, seed) — re-ejecutar reproduce los conteos commiteados exactamente"}</text>
    </svg>
  );
}

/** The leakage-safe held-out protocol — the good split (fit on TRAIN, score on
 *  the untouched TEST) and the forbidden anti-pattern (fit then score on the
 *  same data), drawn and then struck out (ADR-0017 §2). */
function HeldOutDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "ex-held";
  return (
    <svg viewBox="0 0 760 320" className="arch-svg" role="img"
         aria-label={en ? "Leakage-safe held-out protocol vs the forbidden anti-pattern"
                        : "Protocolo held-out sin fuga vs el anti-patrón prohibido"}>
      <defs><Head id={m} /></defs>

      {/* ── TOP: the correct, leakage-safe path ── */}
      <text className="proto-oklabel" x="14" y="22">{en ? "✓ LEAKAGE-SAFE (what QLab does)" : "✓ SIN FUGA (lo que hace QLab)"}</text>
      <rect className="arch-box arch-box-key" x="14" y="34" width="150" height="58" rx="8" />
      <text className="arch-t" x="89" y="58" textAnchor="middle">{en ? "labelled dataset" : "dataset etiquetado"}</text>
      <text className="arch-s" x="89" y="76" textAnchor="middle">{en ? "stratified split" : "split estratificado"}</text>

      <path className="arch-arrow" d="M164 54 L214 44" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M164 72 L214 110" markerEnd={`url(#${m})`} />

      {/* TRAIN */}
      <rect className="proto-train" x="214" y="24" width="150" height="44" rx="7" />
      <text className="arch-t" x="289" y="44" textAnchor="middle">TRAIN (70%)</text>
      <text className="arch-s" x="289" y="60" textAnchor="middle">{en ? "fit kernel + SVM" : "ajusta kernel + SVM"}</text>
      {/* TEST */}
      <rect className="proto-test" x="214" y="92" width="150" height="44" rx="7" />
      <text className="arch-t" x="289" y="112" textAnchor="middle">TEST (30%)</text>
      <text className="arch-s" x="289" y="128" textAnchor="middle">{en ? "never seen in fit" : "nunca visto al ajustar"}</text>

      <path className="arch-arrow" d="M364 46 L470 66" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M364 114 L470 90" markerEnd={`url(#${m})`} />
      <rect className="proto-okbox" x="470" y="52" width="150" height="52" rx="8" />
      <text className="arch-t" x="545" y="74" textAnchor="middle">{en ? "score on TEST" : "evalúa en TEST"}</text>
      <text className="arch-s arch-em" x="545" y="92" textAnchor="middle">{en ? "honest accuracy" : "exactitud honesta"}</text>
      <path className="arch-arrow" d="M620 78 L676 78" markerEnd={`url(#${m})`} />
      <text className="proto-oklabel" x="682" y="74">acc</text>
      <text className="proto-oklabel" x="682" y="90">↦ Benchmark</text>
      <text className="arch-s" x="430" y="158" textAnchor="middle">{en
        ? "the quantum fidelity kernel and the classical RBF kernel see the same split — comparison is apples-to-apples"
        : "el kernel de fidelidad cuántico y el kernel RBF clásico ven el mismo split — comparación pareja"}</text>

      {/* divider */}
      <line className="bloch-axis" x1="14" y1="184" x2="746" y2="184" />

      {/* ── BOTTOM: the forbidden anti-pattern, drawn then struck out ── */}
      <text className="proto-banlabel" x="14" y="214">{en ? "✗ FORBIDDEN — train-on-test leakage" : "✗ PROHIBIDO — fuga: evaluar sobre lo entrenado"}</text>
      <rect className="proto-badbox" x="14" y="226" width="150" height="58" rx="8" />
      <text className="arch-t" x="89" y="250" textAnchor="middle">{en ? "whole dataset" : "dataset completo"}</text>
      <text className="arch-s" x="89" y="268" textAnchor="middle">{en ? "no split" : "sin split"}</text>
      <path className="proto-bad" d="M164 255 L214 255" markerEnd={`url(#${m})`} />
      <rect className="proto-badbox" x="214" y="226" width="170" height="58" rx="8" />
      <text className="arch-t" x="299" y="250" textAnchor="middle">{en ? "fit on ALL of it" : "ajusta sobre TODO"}</text>
      <text className="arch-s" x="299" y="268" textAnchor="middle">{en ? "then score the same rows" : "luego evalúa las mismas filas"}</text>
      <path className="proto-bad" d="M384 255 L434 255" markerEnd={`url(#${m})`} />
      <rect className="proto-badbox" x="434" y="226" width="180" height="58" rx="8" />
      <text className="arch-t" x="524" y="250" textAnchor="middle">{en ? "inflated ~100% accuracy" : "exactitud inflada ~100%"}</text>
      <text className="arch-s" x="524" y="268" textAnchor="middle">{en ? "memorisation, not skill" : "memorización, no habilidad"}</text>
      {/* strike-through the whole forbidden row */}
      <line className="proto-strike" x1="20" y1="232" x2="610" y2="280" />
      <line className="proto-strike" x1="20" y1="280" x2="610" y2="232" />
      <text className="proto-banlabel" x="628" y="252">{en ? "NEVER" : "NUNCA"}</text>
      <text className="proto-banlabel" x="628" y="268">{en ? "reported" : "se reporta"}</text>
    </svg>
  );
}

/** Cross-framework agreement: one problem (MaxCut p=1) sent to three independent
 *  engines; a result is trusted only when all three return the identical cut. */
function CrossCheckDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "ex-xc";
  return (
    <svg viewBox="0 0 760 230" className="arch-svg" role="img"
         aria-label={en ? "Three independent engines must agree on the same cut" : "Tres motores independientes deben coincidir en el mismo corte"}>
      <defs><Head id={m} /></defs>
      <rect className="arch-box arch-box-key" x="14" y="86" width="150" height="58" rx="8" />
      <text className="arch-t" x="89" y="110" textAnchor="middle">{en ? "one problem" : "un problema"}</text>
      <text className="arch-s" x="89" y="128" textAnchor="middle">MaxCut · QAOA p=1</text>

      <path className="arch-arrow" d="M164 100 L240 50" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M164 115 L240 115" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M164 130 L240 180" markerEnd={`url(#${m})`} />

      <rect className="arch-contract" x="240" y="28" width="150" height="44" rx="7" />
      <text className="arch-t" x="315" y="56" textAnchor="middle">Qiskit + Aer</text>
      <rect className="arch-contract" x="240" y="93" width="150" height="44" rx="7" />
      <text className="arch-t" x="315" y="121" textAnchor="middle">PennyLane</text>
      <rect className="arch-contract" x="240" y="158" width="150" height="44" rx="7" />
      <text className="arch-t" x="315" y="186" textAnchor="middle">Cirq</text>

      <path className="arch-arrow" d="M390 50 L470 105" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M390 115 L470 115" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M390 180 L470 125" markerEnd={`url(#${m})`} />

      <rect className="proto-okbox" x="470" y="90" width="160" height="50" rx="8" />
      <text className="arch-t" x="550" y="112" textAnchor="middle">{en ? "all 3 cuts equal?" : "¿los 3 cortes iguales?"}</text>
      <text className="arch-s arch-em" x="550" y="130" textAnchor="middle">{en ? "yes → trust · no → bug" : "sí → confiar · no → bug"}</text>
      <path className="arch-arrow" d="M630 115 L686 115" markerEnd={`url(#${m})`} />
      <text className="proto-oklabel" x="692" y="118">{en ? "publish" : "publicar"}</text>
      <text className="arch-s" x="380" y="222" textAnchor="middle">{en
        ? "disagreement is a bug in the build, not a discovery — three engines are the audit"
        : "una discrepancia es un bug del build, no un hallazgo — tres motores son la auditoría"}</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   The coverage / datasets table — generated LIVE from the committed catalog so
   it can never drift from the shipped manifests (ADR-0017 §2: a real datasets
   table with per-case coverage + live-vs-roadmap status; synthetic cells tagged).
   ════════════════════════════════════════════════════════════════════════ */

interface CaseRow {
  id: string;
  title: string;
  category: string;
  variants: number;
  live: number;
  precompute: number;
  frameworks: string[];
  hasClassical: boolean;
  /** the catalog ships labelled-synthetic regimes (no public restricted dataset)
   *  for the data-driven cases; everything else is exact engine output. */
  source: "engine" | "synthetic";
}

/** Cases whose "data" is a labelled, generated regime family (not a re-hosted
 *  external dataset) — these cells must be tagged synthetic per ADR-0017 §2. */
const SYNTHETIC_CASES = new Set(["qml", "qaoa", "maxcut", "vqe"]);

function rowsFrom(cat: Catalog, lang: Lang): CaseRow[] {
  return cat.cases.map((c: CatalogCase) => {
    const solvers = c.variants.flatMap((v) => v.solvers);
    const frameworks = [...new Set(solvers.map((s) => s.framework.split(":")[0].replace(/^qiskit-aer$/, "qiskit")))];
    const live = c.variants.filter((v) => v.lane === "live").length;
    return {
      id: c.id,
      title: c.title[lang],
      category: c.category,
      variants: c.variants.length,
      live,
      precompute: c.variants.length - live,
      frameworks,
      hasClassical: solvers.some((s) => s.paradigm === "classical"),
      source: SYNTHETIC_CASES.has(c.id) ? "synthetic" : "engine",
    };
  });
}

export function Experiments() {
  const { lang } = useUI();
  const en = lang === "en";
  const refLabel = en ? "References" : "Referencias";
  const [cat, setCat] = useState<Catalog | null>(null);
  useEffect(() => { loadCatalog().then(setCat).catch(() => {}); }, []);

  const rows = useMemo(() => (cat ? rowsFrom(cat, lang) : []), [cat, lang]);
  const stats = useMemo(() => {
    const fam = new Set<string>();
    let variants = 0, live = 0, withClassical = 0, synth = 0;
    for (const r of rows) {
      r.frameworks.forEach((f) => fam.add(f));
      variants += r.variants;
      live += r.live;
      if (r.hasClassical) withClassical++;
      if (r.source === "synthetic") synth++;
    }
    return {
      cases: rows.length, variants, frameworks: fam.size, live,
      precompute: variants - live, withClassical, synth,
    };
  }, [rows]);

  const byCat = useMemo(() => {
    const m = new Map<string, CaseRow[]>();
    for (const r of rows) {
      if (!m.has(r.category)) m.set(r.category, []);
      m.get(r.category)!.push(r);
    }
    return m;
  }, [rows]);

  const tabs: TabDef[] = [
    /* ─────────────────────── 1 · Reproducibility protocol ──────────────── */
    {
      id: "protocol",
      label: en ? "Reproducibility" : "Reproducibilidad",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "Every experiment in QLab is reproducible by construction, and the discipline is simple enough to state in one sentence: a run is a pure function of (params, seed). There is exactly one source of randomness in the whole pipeline — measurement sampling — and it is routed through a single, explicitly-seeded NumPy bit-generator (np.random.default_rng(42)). The state-vector evolution that precedes it is exact: applying a gate is a deterministic matrix–vector product on 2ⁿ complex amplitudes, with no floating-point nondeterminism beyond IEEE-754 rounding, so the amplitudes, the probabilities and the Bloch vectors are fixed before a single shot is drawn. Re-running any case with the same seed reproduces the committed counts bit-for-bit; this is what lets the web app replay a recording instead of re-deriving it."
              : "Cada experimento en QLab es reproducible por construcción, y la disciplina cabe en una frase: una ejecución es función pura de (params, seed). Hay exactamente una fuente de azar en todo el pipeline — el muestreo de medición — y pasa por un único generador de bits de NumPy con semilla explícita (np.random.default_rng(42)). La evolución del statevector que la precede es exacta: aplicar una compuerta es un producto matriz–vector determinista sobre 2ⁿ amplitudes complejas, sin no-determinismo de punto flotante más allá del redondeo IEEE-754, así que las amplitudes, las probabilidades y los vectores de Bloch quedan fijos antes de tirar un solo shot. Re-ejecutar cualquier caso con la misma semilla reproduce los conteos commiteados bit a bit; eso es lo que permite que la web reproduzca una grabación en vez de re-derivarla."}
          </p>
          <Eq
            tex={String.raw`\text{counts}=\mathcal{S}\bigl(\,\lvert\psi\rangle=U(\text{params})\,\lvert\psi_0\rangle,\ \text{shots}=2048;\ \text{seed}=42\,\bigr),\qquad |\psi\rangle\ \text{is exact}`}
            caption={{
              en: "A committed result is the seeded sampler 𝒮 applied to an exact state vector; only 𝒮 is stochastic, and its seed (42) is fixed, so the counts are deterministic across re-runs.",
              es: "Un resultado commiteado es el sampler con semilla 𝒮 aplicado a un statevector exacto; solo 𝒮 es estocástico, y su semilla (42) es fija, así que los conteos son deterministas entre re-ejecuciones.",
            }}
          />
          <p>
            {en
              ? "The shot count is a fixed, declared constant — 2048 shots per case — chosen so the sampling error on a probability p is small but visible: the standard error of an estimated frequency is √(p(1−p)/N), which at N=2048 is at most 0.011 (worst case p=½). That is why a Bell-pair histogram reads 0.50/0.50 to two decimals rather than exactly ½, and why the App shows the empirical counts next to the exact probabilities — the gap between them is the honest, quantified shot noise, not a bug. Cases that need optimisation (QAOA, VQE) or stabiliser sampling (QEC) declare their own additional constants (grid size, θ-scan length, syndrome rounds), and every one of those constants is written into the committed trace's provenance block alongside the engine version, the lane and the seed."
              : "El número de shots es una constante fija y declarada — 2048 shots por caso — elegida para que el error de muestreo sobre una probabilidad p sea pequeño pero visible: el error estándar de una frecuencia estimada es √(p(1−p)/N), que con N=2048 es a lo más 0.011 (peor caso p=½). Por eso un histograma de par de Bell se lee 0.50/0.50 a dos decimales y no exactamente ½, y por eso la App muestra los conteos empíricos junto a las probabilidades exactas — la brecha entre ambos es el ruido de shots honesto y cuantificado, no un bug. Los casos que necesitan optimización (QAOA, VQE) o muestreo de estabilizadores (QEC) declaran sus propias constantes adicionales (tamaño de grilla, largo del barrido en θ, rondas de síndrome), y cada una queda escrita en el bloque de procedencia de la traza commiteada junto a la versión del motor, el carril y la semilla."}
          </p>
          <Eq
            tex={String.raw`\mathrm{SE}(\hat p)=\sqrt{\tfrac{p(1-p)}{N}}\ \le\ \tfrac{1}{2\sqrt N}=\tfrac{1}{2\sqrt{2048}}\approx 0.0110,\qquad N=2048`}
            caption={{
              en: "Why 2048 shots: the worst-case standard error of a measured frequency is 1/(2√N) ≈ 1.1% — small enough to read two decimals, large enough that the App's empirical-vs-exact gap is honestly visible.",
              es: "Por qué 2048 shots: el error estándar en el peor caso de una frecuencia medida es 1/(2√N) ≈ 1.1% — chico para leer dos decimales, grande para que la brecha empírico-vs-exacto de la App sea honestamente visible.",
            }}
          />
          <div className="fig-svg wide"><ReproDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "The single execution path: (params, seed) → exact state vector → one seeded sampler at 2048 shots → a committed trace that replays bit-for-bit. Only the sampler is stochastic, and its seed is fixed."
              : "El único camino de ejecución: (params, seed) → statevector exacto → un sampler con semilla a 2048 shots → una traza commiteada que reproduce bit a bit. Solo el sampler es estocástico, y su semilla es fija."}</p>
          </div>
          <Callout
            title={en ? "Exact vs sampled —" : "Exacto vs muestreado —"}
            pt={en
              ? "The exact numbers are the ground truth; the sampled counts carry an honest ±1.1% that we never hide."
              : "Los números exactos son la verdad de referencia; los conteos muestreados cargan un ±1.1% honesto que nunca ocultamos."}>
            {en
              ? "QLab reports both the analytic probabilities (from the exact state vector) and the 2048-shot empirical counts. Where a case claims fidelity 1.000 or P(marked)=1, that is the exact figure; the histogram beside it is the sampled approximation, and its scatter is the quantified shot noise above."
              : "QLab reporta ambos: las probabilidades analíticas (del statevector exacto) y los conteos empíricos de 2048 shots. Donde un caso afirma fidelidad 1.000 o P(marcado)=1, esa es la cifra exacta; el histograma al lado es la aproximación muestreada, y su dispersión es el ruido de shots cuantificado arriba."}
          </Callout>
          <Refs ids={["nielsen2010", "knuth1997", "qiskit2024"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────── 2 · Held-out / leakage-safe ───────────────── */
    {
      id: "heldout",
      label: en ? "Held-out protocol" : "Protocolo held-out",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "Only one family in QLab learns from data — the quantum-machine-learning case (a quantum fidelity-kernel SVM benchmarked against a classical RBF-kernel SVM) — and exactly that family is where a careless evaluation can lie. The rule is the one statistical-learning has enforced for fifty years: a model is fit on a training split and scored only on a disjoint, held-out test split it never saw. QLab uses a stratified 70/30 train/test split (class-balanced so the test accuracy is not an artifact of label imbalance); the kernel matrix, the SVM dual coefficients and the bias are all estimated on TRAIN, and the reported accuracy is computed once, on TEST. No hyper-parameter is tuned on the test rows; no metric is ever computed on data the model trained on."
              : "Solo una familia en QLab aprende de datos — el caso de aprendizaje automático cuántico (un SVM con kernel de fidelidad cuántico comparado contra un SVM con kernel RBF clásico) — y justo esa familia es donde una evaluación descuidada puede mentir. La regla es la que el aprendizaje estadístico impone hace cincuenta años: un modelo se ajusta en un split de entrenamiento y se evalúa solo en un split de prueba disjunto y reservado que nunca vio. QLab usa un split estratificado 70/30 (balanceado por clase para que la exactitud de prueba no sea un artefacto de desbalance); la matriz kernel, los coeficientes duales del SVM y el sesgo se estiman en TRAIN, y la exactitud reportada se computa una vez, sobre TEST. Ningún hiperparámetro se ajusta en las filas de prueba; ninguna métrica se computa jamás sobre datos con los que el modelo entrenó."}
          </p>
          <Eq
            tex={String.raw`\mathcal D=\mathcal D_{\text{train}}\,\dot\cup\,\mathcal D_{\text{test}},\quad \mathcal D_{\text{train}}\cap\mathcal D_{\text{test}}=\varnothing,\quad \widehat{\mathrm{acc}}=\frac{1}{|\mathcal D_{\text{test}}|}\!\!\sum_{(x,y)\in\mathcal D_{\text{test}}}\!\!\mathbb 1\!\left[\hat f(x)=y\right]`}
            caption={{
              en: "The held-out estimator: the dataset is a DISJOINT union of train and test; accuracy is the empirical 0–1 loss on the test split only, with the model fit exclusively on train.",
              es: "El estimador held-out: el dataset es una unión DISJUNTA de train y test; la exactitud es la pérdida 0–1 empírica solo en el split de prueba, con el modelo ajustado exclusivamente en train.",
            }}
          />
          <p>
            {en
              ? "The forbidden anti-pattern is fitting on the whole dataset and then scoring the same rows: a flexible kernel can memorise its training set and report ~100% accuracy that collapses on anything new. This is train-on-test leakage, and it is the single most common way a quantum-ML demo overstates an advantage — so QLab draws it explicitly and strikes it out below. The same discipline protects the comparison itself: the quantum fidelity kernel and the classical RBF kernel are fit and scored on the identical split, so the verdict (the QML case ties or loses to classical on these datasets) is a fair, apples-to-apples result and not an accident of who got the easier rows."
              : "El anti-patrón prohibido es ajustar sobre el dataset completo y luego evaluar las mismas filas: un kernel flexible puede memorizar su conjunto de entrenamiento y reportar ~100% de exactitud que se desploma ante cualquier dato nuevo. Esto es fuga de entrenar-sobre-prueba, y es la forma más común en que una demo de ML cuántico exagera una ventaja — por eso QLab la dibuja explícitamente y la tacha abajo. La misma disciplina protege la comparación: el kernel de fidelidad cuántico y el RBF clásico se ajustan y evalúan sobre el mismo split, así que el veredicto (el caso QML empata o pierde contra el clásico en estos datasets) es un resultado justo y pareja, no un accidente de a quién le tocaron las filas fáciles."}
          </p>
          <div className="fig-svg wide"><HeldOutDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "Top: the leakage-safe path — fit on TRAIN, score on the untouched TEST, same split for both kernels. Bottom (struck out): the forbidden anti-pattern — fit and score the same rows, yielding inflated accuracy that QLab never reports."
              : "Arriba: el camino sin fuga — ajustar en TRAIN, evaluar en el TEST intacto, el mismo split para ambos kernels. Abajo (tachado): el anti-patrón prohibido — ajustar y evaluar las mismas filas, dando una exactitud inflada que QLab nunca reporta."}</p>
          </div>
          <p>
            {en
              ? "Where the dataset is small, a single split is itself noisy, so the protocol generalises to k-fold cross-validation: partition into k equal folds, train on k−1 and test on the held-out fold, rotate, and average. The cross-validated accuracy estimate is the mean over folds, and its spread (the fold-to-fold standard deviation) is reported as the honest uncertainty band — never a single lucky split presented as the headline. This is the textbook model-assessment procedure, and it is what keeps a 'quantum beats classical' claim from being a coin-flip dressed up as a discovery."
              : "Donde el dataset es chico, un solo split es ruidoso por sí mismo, así que el protocolo se generaliza a validación cruzada de k folds: particionar en k folds iguales, entrenar en k−1 y evaluar en el fold reservado, rotar, y promediar. La estimación de exactitud validada cruzadamente es la media sobre folds, y su dispersión (la desviación estándar entre folds) se reporta como la banda de incertidumbre honesta — nunca un único split afortunado presentado como titular. Este es el procedimiento de evaluación de modelos de libro, y es lo que evita que una afirmación de 'cuántico le gana a clásico' sea una moneda al aire disfrazada de hallazgo."}
          </p>
          <Eq
            tex={String.raw`\widehat{\mathrm{acc}}_{\text{CV}}=\frac{1}{k}\sum_{i=1}^{k}\mathrm{acc}\!\left(\mathcal D\setminus F_i\ \to\ F_i\right),\qquad \sigma_{\text{CV}}=\sqrt{\tfrac{1}{k-1}\textstyle\sum_i\bigl(\mathrm{acc}_i-\widehat{\mathrm{acc}}_{\text{CV}}\bigr)^2}`}
            caption={{
              en: "k-fold cross-validation: each fold Fᵢ is the held-out test once; the reported figure is the fold mean with the fold-to-fold standard deviation σ_CV as the honest uncertainty.",
              es: "Validación cruzada de k folds: cada fold Fᵢ es el test reservado una vez; la cifra reportada es la media de folds con la desviación estándar entre folds σ_CV como incertidumbre honesta.",
            }}
          />
          <Callout
            title={en ? "Leakage-safe —" : "Sin fuga —"}
            pt={en
              ? "On these datasets the quantum kernel ties or loses to the classical RBF — and we report that, because the protocol gives us no way to hide it."
              : "En estos datasets el kernel cuántico empata o pierde contra el RBF clásico — y lo reportamos, porque el protocolo no nos deja ocultarlo."}>
            {en
              ? "the only learned cases (QML, and the VQE θ-scan as a 1-parameter fit) are evaluated on data the model did not fit; for the VQE the 'held-out' check is the variational lower bound E(θ) ≥ E₀, validated against exact FCI. Every other case is exact engine output with nothing to leak."
              : "los únicos casos aprendidos (QML, y el barrido en θ de VQE como un ajuste de 1 parámetro) se evalúan sobre datos que el modelo no ajustó; para VQE el chequeo 'reservado' es la cota variacional E(θ) ≥ E₀, validada contra FCI exacto. Todo otro caso es salida exacta del motor, sin nada que filtrar."}
          </Callout>
          <Refs ids={["stone1974", "kohavi1995", "hastie2009", "cortes1995", "huang2021"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────── 3 · Metrics & estimators ──────────────────── */
    {
      id: "metrics",
      label: en ? "Metrics & estimators" : "Métricas y estimadores",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "Each experimental family answers a different question, so each is scored with its own exact metric — never a single generic 'accuracy'. The probability distributions a circuit produces are compared to the analytic target with the total variation distance and the (classical) fidelity, both defined over the 2ⁿ basis-state probabilities; for a perfect circuit TVD=0 and F=1. The fidelity-1.000 claims in the QFT, teleportation and superdense cases are exactly F computed against the analytic reference, not a hand-wave."
              : "Cada familia experimental responde una pregunta distinta, así que cada una se evalúa con su propia métrica exacta — nunca una 'exactitud' genérica única. Las distribuciones de probabilidad que produce un circuito se comparan con el objetivo analítico mediante la distancia de variación total y la fidelidad (clásica), ambas definidas sobre las 2ⁿ probabilidades de estado base; para un circuito perfecto TVD=0 y F=1. Las afirmaciones de fidelidad 1.000 en QFT, teleportación y superdensa son exactamente F computada contra la referencia analítica, no un gesto."}
          </p>
          <div className="metric-eq-head">{en ? "Distribution agreement (QFT · teleportation · superdense · RNG)" : "Acuerdo de distribuciones (QFT · teleportación · superdensa · RNG)"}</div>
          <Eq
            tex={String.raw`\mathrm{TVD}(p,q)=\tfrac12\sum_{x}\lvert p_x-q_x\rvert,\qquad F(p,q)=\Bigl(\sum_x\sqrt{p_x\,q_x}\Bigr)^{\!2}\in[0,1]`}
            caption={{
              en: "Total variation distance and (classical Bhattacharyya) fidelity between the circuit's distribution p and the analytic target q over the 2ⁿ outcomes; a perfect run gives TVD=0, F=1.",
              es: "Distancia de variación total y fidelidad (Bhattacharyya clásica) entre la distribución p del circuito y el objetivo analítico q sobre los 2ⁿ resultados; una ejecución perfecta da TVD=0, F=1.",
            }}
          />
          <p>
            {en
              ? "Search and oracle cases are scored by the probability the measurement returns the right answer. Grover's success probability has a closed form: after k iterations on N=2ⁿ items with M marked, P(success)=sin²((2k+1)θ) with sinθ=√(M/N) — which is exactly why the App's 0.9453 and 0.9613 are the right numbers, and why over-rotating past the optimal k=⌊π/(4θ)⌋ pushes the probability back down. The Bernstein–Vazirani and Deutsch–Jozsa cases instead report the query count: 1 quantum query against n (BV) or up to 2ⁿ⁻¹+1 (DJ) classical queries — a query-complexity metric, since wall-time is trivial at these sizes."
              : "Los casos de búsqueda y oráculo se evalúan por la probabilidad de que la medición devuelva la respuesta correcta. La probabilidad de éxito de Grover tiene forma cerrada: tras k iteraciones sobre N=2ⁿ ítems con M marcados, P(éxito)=sin²((2k+1)θ) con sinθ=√(M/N) — que es exactamente por qué los 0.9453 y 0.9613 de la App son los números correctos, y por qué sobre-rotar más allá del óptimo k=⌊π/(4θ)⌋ baja de nuevo la probabilidad. Los casos de Bernstein–Vazirani y Deutsch–Jozsa reportan en cambio el conteo de consultas: 1 consulta cuántica contra n (BV) o hasta 2ⁿ⁻¹+1 (DJ) consultas clásicas — una métrica de complejidad de consultas, ya que el tiempo de pared es trivial a estos tamaños."}
          </p>
          <div className="metric-eq-head">{en ? "Search success (Grover)" : "Éxito de búsqueda (Grover)"}</div>
          <Eq
            tex={String.raw`P_{\text{succ}}(k)=\sin^2\!\bigl((2k+1)\theta\bigr),\ \ \sin\theta=\sqrt{\tfrac{M}{N}},\qquad k^\star=\Bigl\lfloor\tfrac{\pi}{4\theta}\Bigr\rfloor\approx\tfrac{\pi}{4}\sqrt{\tfrac{N}{M}}`}
            caption={{
              en: "Grover's exact success probability after k iterations, and the optimal iteration count k★ ≈ (π/4)√(N/M); running past k★ over-rotates and the probability falls — the App reproduces both.",
              es: "Probabilidad de éxito exacta de Grover tras k iteraciones, y el conteo óptimo k★ ≈ (π/4)√(N/M); pasarse de k★ sobre-rota y la probabilidad cae — la App reproduce ambos.",
            }}
          />
          <p>
            {en
              ? "The variational and physics cases each have a physically meaningful target. VQE is scored against exact full-configuration-interaction (FCI) energy and must land within chemical accuracy, 1 kcal/mol ≈ 1.6×10⁻³ Hartree, of the true ground state along the H₂ dissociation curve. MaxCut/QAOA is scored by the approximation ratio r = C(QAOA cut)/C(optimum), with the Goemans–Williamson 0.878 semidefinite bound and the exact brute-force optimum both available as references. CHSH is scored by the Bell value S, classical-bounded at 2 and quantum-bounded at the Tsirelson 2√2≈2.828 — the App reaches 2.828 at the optimal angles and 1.414 for a separable state, exactly as theory predicts."
              : "Los casos variacionales y de física tienen cada uno un objetivo físicamente significativo. VQE se evalúa contra la energía exacta de interacción de configuración completa (FCI) y debe caer dentro de la exactitud química, 1 kcal/mol ≈ 1.6×10⁻³ Hartree, del estado base verdadero a lo largo de la curva de disociación de H₂. MaxCut/QAOA se evalúa por la razón de aproximación r = C(corte QAOA)/C(óptimo), con la cota semidefinida de Goemans–Williamson 0.878 y el óptimo exacto por fuerza bruta disponibles como referencias. CHSH se evalúa por el valor de Bell S, acotado clásicamente en 2 y cuánticamente en la cota de Tsirelson 2√2≈2.828 — la App alcanza 2.828 en los ángulos óptimos y 1.414 para un estado separable, exactamente como predice la teoría."}
          </p>
          <div className="metric-eq-head">{en ? "Energy · cut quality · nonlocality" : "Energía · calidad de corte · no-localidad"}</div>
          <Eq
            tex={String.raw`\lvert E_{\text{VQE}}-E_0^{\text{FCI}}\rvert\le 1.6\times10^{-3}\,E_h,\quad r=\frac{C_{\text{QAOA}}}{C_{\max}}\ (\ge 0.878_{\text{GW}}?),\quad S=\textstyle\sum_{\pm}E(a_i,b_j)\le 2_{\text{LHV}}<2\sqrt2_{\text{Tsirelson}}`}
            caption={{
              en: "Three physical metrics: chemical accuracy for VQE (1.6 mHartree), the MaxCut approximation ratio against the exact optimum and the 0.878 Goemans–Williamson bound, and the CHSH value with its classical (2) and Tsirelson (2√2) bounds.",
              es: "Tres métricas físicas: exactitud química para VQE (1.6 mHartree), la razón de aproximación de MaxCut contra el óptimo exacto y la cota 0.878 de Goemans–Williamson, y el valor CHSH con sus cotas clásica (2) y de Tsirelson (2√2).",
            }}
          />
          <p>
            {en
              ? "The noise-and-correction cases report error directly. Zero-noise extrapolation scores the residual bias of the mitigated estimator: running at scaled noise λ∈{1,3,5} and extrapolating ⟨O⟩(λ) back to λ=0 cuts the error from ≈11× to ≈1.5× as noise grows — mitigation, which reduces bias but does not remove it. Error correction is scored by the logical error rate per cycle p_L, and the headline is the scaling: below the surface-code threshold p_L falls with code distance (d=5 beats d=3), while above threshold more qubits make it worse — the threshold crossover, the single most important number in fault tolerance."
              : "Los casos de ruido y corrección reportan error directamente. La extrapolación a ruido cero evalúa el sesgo residual del estimador mitigado: correr a ruido escalado λ∈{1,3,5} y extrapolar ⟨O⟩(λ) de vuelta a λ=0 recorta el error de ≈11× a ≈1.5× a medida que crece el ruido — mitigación, que reduce el sesgo pero no lo elimina. La corrección de errores se evalúa por la tasa de error lógico por ciclo p_L, y el titular es el escalamiento: bajo el umbral del código de superficie p_L cae con la distancia (d=5 le gana a d=3), mientras que sobre el umbral más qubits empeoran — el cruce de umbral, el número más importante en tolerancia a fallos."}
          </p>
          <div className="metric-eq-head">{en ? "Mitigation bias · logical error rate" : "Sesgo de mitigación · tasa de error lógico"}</div>
          <Eq
            tex={String.raw`\langle O\rangle_{\text{ZNE}}=\lim_{\lambda\to0}\widehat{\langle O\rangle}(\lambda),\ \ \lambda\in\{1,3,5\};\qquad p_L(d)\propto\Bigl(\tfrac{p}{p_{\text{th}}}\Bigr)^{\!\lfloor (d+1)/2\rfloor}\ \text{for}\ p<p_{\text{th}}`}
            caption={{
              en: "ZNE extrapolates the noise-scaled estimator to λ=0 (bias reduction, not correction); the surface-code logical error rate falls exponentially in distance d below threshold p_th and rises above it.",
              es: "ZNE extrapola el estimador escalado en ruido a λ=0 (reducción de sesgo, no corrección); la tasa de error lógico del código de superficie cae exponencialmente en la distancia d bajo el umbral p_th y sube por encima.",
            }}
          />
          <Callout
            title={en ? "One metric per question —" : "Una métrica por pregunta —"}
            pt={en
              ? "A single 'accuracy' would flatten all of these into a meaningless average; each number above is the honest measure for its own claim."
              : "Una 'exactitud' única aplanaría todo esto en un promedio sin sentido; cada número de arriba es la medida honesta de su propia afirmación."}>
            {en
              ? "every metric here is computed against a ground truth that exists at these sizes — the analytic distribution, the exact FCI energy, the brute-force optimum, the Tsirelson bound — so 'correct' is verifiable, not asserted. That same small size is the honesty caveat: the classical reference is cheap precisely because the problems are small."
              : "cada métrica aquí se computa contra una verdad de referencia que existe a estos tamaños — la distribución analítica, la energía FCI exacta, el óptimo por fuerza bruta, la cota de Tsirelson — así que 'correcto' es verificable, no afirmado. Ese mismo tamaño chico es la advertencia honesta: la referencia clásica es barata justamente porque los problemas son chicos."}
          </Callout>
          <Refs ids={["nielsen2010", "grover1996", "peruzzo2014", "mcardle2020", "goemans1995", "chsh1969", "giurgicatiron2020", "fowler2012"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────── 4 · Cross-framework validation ────────────── */
    {
      id: "crosscheck",
      label: en ? "Cross-framework check" : "Validación cruzada",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "A quantum result is only trustworthy if two independent engines agree on it — the SimLab 'two engines on one problem' discipline. The flagship example is MaxCut QAOA: QLab runs the identical p=1 ansatz on three independent frameworks — Qiskit + Aer, PennyLane and Cirq — and they must return the same optimal cut on every lab graph (3–6 nodes). Because the three stacks share no simulation code, a disagreement would have to be a bug in one of them rather than a property of the physics; agreement across all three is the audit trail. On the shipped graphs all three frameworks converge to the identical cut, and none of them beats the exact brute-force optimum (which is computed in microseconds at this size)."
              : "Un resultado cuántico solo es confiable si dos motores independientes coinciden — la disciplina SimLab de 'dos motores sobre un problema'. El ejemplo insignia es MaxCut QAOA: QLab ejecuta el ansatz idéntico p=1 en tres frameworks independientes — Qiskit + Aer, PennyLane y Cirq — y deben devolver el mismo corte óptimo en cada grafo del lab (3–6 nodos). Como los tres stacks no comparten código de simulación, una discrepancia tendría que ser un bug en uno de ellos y no una propiedad de la física; la coincidencia entre los tres es el registro de auditoría. En los grafos publicados los tres frameworks convergen al corte idéntico, y ninguno le gana al óptimo exacto por fuerza bruta (computado en microsegundos a este tamaño)."}
          </p>
          <Eq
            tex={String.raw`\text{cut}_{\text{Qiskit}}=\text{cut}_{\text{PennyLane}}=\text{cut}_{\text{Cirq}}\ \overset{?}{=}\ \arg\max_{z}\,C(z),\qquad C(z)=\!\!\sum_{(i,j)\in E}\!\!\tfrac{1-z_i z_j}{2}`}
            caption={{
              en: "The cross-framework invariant for MaxCut: three independent engines must return the same cut, and it is checked against the exact optimum of the cut objective C(z) over the graph edges E.",
              es: "El invariante entre frameworks para MaxCut: tres motores independientes deben devolver el mismo corte, y se contrasta con el óptimo exacto del objetivo de corte C(z) sobre las aristas E del grafo.",
            }}
          />
          <div className="fig-svg wide"><CrossCheckDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "One problem, three independent engines (Qiskit, PennyLane, Cirq): the result is trusted only when all three return the identical cut — disagreement is a bug, not a discovery."
              : "Un problema, tres motores independientes (Qiskit, PennyLane, Cirq): el resultado se confía solo cuando los tres devuelven el corte idéntico — una discrepancia es un bug, no un hallazgo."}</p>
          </div>
          <p>
            {en
              ? "The other cases self-validate against a known reference instead of against a sibling engine, because for them an exact analytic answer exists. The QFT output is checked against the analytic discrete Fourier transform (both sign conventions) and reports fidelity 1.000 on every committed variant. Teleportation and superdense coding are validated by recovery: every input state teleports back with fidelity 1, and every two-bit message decodes exactly from the single transmitted qubit. The error-correction cases use a different but equally independent oracle — Stim's Clifford-frame stabiliser simulator generates the syndromes and PyMatching's minimum-weight perfect-matching decoder corrects them — and the below-threshold scaling (d=5 outperforming d=3) is reproduced, the Willow result in miniature."
              : "Los demás casos se autovalidan contra una referencia conocida en vez de contra un motor hermano, porque para ellos existe una respuesta analítica exacta. La salida de la QFT se contrasta con la transformada de Fourier discreta analítica (ambas convenciones de signo) y reporta fidelidad 1.000 en cada variante commiteada. La teleportación y la codificación superdensa se validan por recuperación: cada estado de entrada se teleporta de vuelta con fidelidad 1, y cada mensaje de dos bits decodifica exactamente del único qubit transmitido. Los casos de corrección de errores usan un oráculo distinto pero igual de independiente — el simulador de estabilizadores en marco de Clifford de Stim genera los síndromes y el decodificador de matching perfecto de peso mínimo de PyMatching los corrige — y el escalamiento bajo umbral (d=5 superando a d=3) se reproduce, el resultado de Willow en miniatura."}
          </p>
          <ul className="fw-list">
            <li><strong>QAOA × 3</strong> — {en ? "Qiskit, PennyLane and Cirq return the same cut on all lab graphs; none beats the exact optimum." : "Qiskit, PennyLane y Cirq devuelven el mismo corte en todos los grafos; ninguno gana al óptimo exacto."}</li>
            <li><strong>QFT</strong> — {en ? "validated against the analytic DFT (both sign conventions) — fidelity 1.000." : "validado contra la DFT analítica (ambas convenciones de signo) — fidelidad 1.000."}</li>
            <li><strong>{en ? "Teleportation / superdense" : "Teleportación / superdensa"}</strong> — {en ? "every input state recovers with fidelity 1; every 2-bit message decodes exactly." : "cada estado de entrada se recupera con fidelidad 1; cada mensaje de 2 bits decodifica exactamente."}</li>
            <li><strong>QEC</strong> — {en ? "Stim stabiliser sim + PyMatching MWPM; below-threshold scaling reproduced (d=5 < d=3)." : "sim de estabilizadores de Stim + MWPM de PyMatching; escalamiento bajo umbral reproducido (d=5 < d=3)."}</li>
          </ul>
          <Callout
            title={en ? "Self-validating —" : "Autovalidante —"}
            pt={en
              ? "There is no place to hide a wrong number: every quantum result is checked against either an independent engine or an exact analytic reference."
              : "No hay dónde esconder un número erróneo: cada resultado cuántico se contrasta contra un motor independiente o una referencia analítica exacta."}>
            {en
              ? "each quantum solver is also run against its classical baseline in the same execution, and the comparison verdict on every case is recorded — so the audit is twofold: engine-vs-engine (or engine-vs-analytic) for correctness, and quantum-vs-classical for the honest advantage claim."
              : "cada solver cuántico también se ejecuta contra su baseline clásico en la misma ejecución, y el veredicto de comparación de cada caso queda registrado — así la auditoría es doble: motor-vs-motor (o motor-vs-analítico) para corrección, y cuántico-vs-clásico para la afirmación honesta de ventaja."}
          </Callout>
          <Refs ids={["qiskit2024", "pennylane2018", "gidney2021stim", "higgott2022", "google2024willow", "nielsen2010"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────── 5 · Quantum vs classical verdict ──────────── */
    {
      id: "verdict",
      label: en ? "Quantum vs classical" : "Cuántico vs clásico",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "The central experiment QLab runs is not 'does the circuit work' — it does — but 'does quantum actually beat classical here, and in what sense'. Every case ships its quantum solver next to a real classical baseline solved in the same run, and the honest verdict falls into one of four buckets. The first is no advantage by construction: state preparation, single-qubit gates, superposition/RNG and interference are foundational concepts where a classical computer writes the 2ⁿ amplitude vector down instantly at these sizes — the cases teach the substrate, not a speedup."
              : "El experimento central que ejecuta QLab no es '¿funciona el circuito?' — sí funciona — sino '¿le gana de verdad lo cuántico a lo clásico aquí, y en qué sentido?'. Cada caso incluye su solver cuántico junto a un baseline clásico real resuelto en la misma ejecución, y el veredicto honesto cae en uno de cuatro grupos. El primero es sin ventaja por construcción: preparación de estados, compuertas de un qubit, superposición/RNG e interferencia son conceptos fundacionales donde una computadora clásica escribe el vector de 2ⁿ amplitudes al instante a estos tamaños — los casos enseñan el sustrato, no una aceleración."}
          </p>
          <p>
            {en
              ? "The second bucket is a real query-complexity separation that is nonetheless not a practical speedup: Bernstein–Vazirani recovers the hidden string in 1 quantum query versus n classical; Deutsch–Jozsa decides constant-vs-balanced in 1 versus up to 2ⁿ⁻¹+1; Simon finds the period in O(n) versus ~2^{n/2} — the first provably exponential separation. These are genuine and provable, but they live in the oracle model on contrived problems, and at browser sizes the classical wall-time is still instant. The third bucket is the asymptotic-but-not-here speedup: Grover is a real quadratic ~√N advantage, and Shor's order-finding genuinely factors 15 — but factoring 15 is trivial classically, and a cryptographically relevant Shor needs on the order of 10⁶ noisy qubits plus fault tolerance, three-to-four orders beyond today's machines."
              : "El segundo grupo es una separación real de complejidad de consultas que aun así no es una aceleración práctica: Bernstein–Vazirani recupera la cadena oculta en 1 consulta cuántica vs n clásicas; Deutsch–Jozsa decide constante-vs-balanceada en 1 vs hasta 2ⁿ⁻¹+1; Simon halla el período en O(n) vs ~2^{n/2} — la primera separación exponencial demostrable. Son genuinas y demostrables, pero viven en el modelo de oráculo sobre problemas artificiales, y a tamaños de navegador el tiempo clásico sigue siendo instantáneo. El tercer grupo es la aceleración asintótica-pero-no-aquí: Grover es una ventaja cuadrática real ~√N, y la búsqueda de orden de Shor sí factoriza 15 — pero factorizar 15 es trivial clásicamente, y un Shor criptográficamente relevante necesita del orden de 10⁶ qubits ruidosos más tolerancia a fallos, tres-a-cuatro órdenes más allá de las máquinas de hoy."}
          </p>
          <Eq
            tex={String.raw`\underbrace{\text{BV: }1\,\text{vs}\,n}_{\text{query sep.}}\ \ \underbrace{\text{Grover: }\tfrac{\pi}{4}\sqrt N\,\text{vs}\,\tfrac N2}_{\text{quadratic (asymptotic)}}\ \ \underbrace{\text{QML: }r\le r_{\text{classical}}}_{\text{no advantage}}\ \ \underbrace{\text{CHSH: }2\sqrt2>2}_{\text{genuine, non-compute}}`}
            caption={{
              en: "The four honest verdict buckets in one line: a query separation, a quadratic asymptotic speedup, a measured no-advantage (QML), and the one genuine non-computational win (CHSH).",
              es: "Los cuatro grupos de veredicto honesto en una línea: una separación de consultas, una aceleración cuadrática asintótica, un no-ventaja medido (QML), y la única victoria genuina no-computacional (CHSH).",
            }}
          />
          <p>
            {en
              ? "The fourth bucket is the honest counter-evidence, and QLab reports it as loudly as the wins. The quantum-kernel SVM ties or loses to a classical RBF-SVM on these datasets — measured under the leakage-safe protocol, so the negative result is trustworthy; this is the QML hype-check. VQE matches FCI to chemical accuracy but on a 4×4 H₂ Hamiltonian that is pedagogy, not advantage. ZNE reduces error but does not correct it, and the classical statevector is exact and free at this scale. The one place quantum genuinely and irreducibly beats classical is CHSH: a Bell state reaches S=2√2>2, ruling out local realism (2022 Nobel) — but that is a nonlocality result, not a faster computation, and a separable state cannot violate the bound at all."
              : "El cuarto grupo es la contra-evidencia honesta, y QLab la reporta tan fuerte como las victorias. El SVM con kernel cuántico empata o pierde contra un SVM-RBF clásico en estos datasets — medido bajo el protocolo sin fuga, así que el resultado negativo es confiable; este es el chequeo de hype del ML cuántico. VQE iguala a FCI con exactitud química pero sobre un Hamiltoniano de H₂ de 4×4 que es pedagogía, no ventaja. ZNE reduce el error pero no lo corrige, y el statevector clásico es exacto y gratis a esta escala. El único lugar donde lo cuántico le gana genuina e irreduciblemente a lo clásico es CHSH: un estado de Bell alcanza S=2√2>2, descartando el realismo local (Nobel 2022) — pero ese es un resultado de no-localidad, no un cálculo más rápido, y un estado separable no puede violar la cota en absoluto."}
          </p>
          <div className="wf-grid">
            <div className="wf-card ok"><h5>{en ? "Where quantum genuinely wins" : "Dónde lo cuántico gana de verdad"}</h5>
              <ul>
                <li>{en ? "CHSH: S=2√2 > 2 — rules out local realism (non-compute)." : "CHSH: S=2√2 > 2 — descarta el realismo local (no-cálculo)."}</li>
                <li>{en ? "BV / DJ / Simon: real query-complexity separations." : "BV / DJ / Simon: separaciones reales de complejidad de consultas."}</li>
                <li>{en ? "Grover: quadratic ~√N (asymptotic)." : "Grover: cuadrático ~√N (asintótico)."}</li>
                <li>{en ? "Teleportation / superdense: fidelity-1 / Holevo-beating channel use." : "Teleportación / superdensa: fidelidad-1 / uso de canal que supera Holevo."}</li>
              </ul>
            </div>
            <div className="wf-card fail"><h5>{en ? "Where classical ties or wins" : "Dónde clásico empata o gana"}</h5>
              <ul>
                <li>{en ? "QML kernel: ties/loses to RBF-SVM (leakage-safe)." : "Kernel QML: empata/pierde vs SVM-RBF (sin fuga)."}</li>
                <li>{en ? "VQE / MaxCut / Shor-15: exact classical reference is trivial here." : "VQE / MaxCut / Shor-15: la referencia clásica exacta es trivial aquí."}</li>
                <li>{en ? "Foundations (gates, RNG, interference): no advantage at all." : "Fundamentos (compuertas, RNG, interferencia): sin ventaja alguna."}</li>
                <li>{en ? "ZNE: mitigation, not correction; classical exact + free." : "ZNE: mitigación, no corrección; clásico exacto + gratis."}</li>
              </ul>
            </div>
          </div>
          <Callout
            title={en ? "The honest scorecard —" : "La tarjeta honesta —"}
            pt={en
              ? "Counting wins is easy; reporting the ties and losses under a leakage-safe protocol is the actual experiment."
              : "Contar victorias es fácil; reportar los empates y derrotas bajo un protocolo sin fuga es el experimento real."}>
            {en
              ? "QLab does not claim quantum supremacy from a browser. It claims something narrower and verifiable: each circuit is correct, each comparison is fair, and the advantage — where it exists — is exactly the kind the resource numbers support (query, asymptotic, or nonlocality), never a marketing 'exponential speedup' on a task you would pay for."
              : "QLab no afirma supremacía cuántica desde un navegador. Afirma algo más estrecho y verificable: cada circuito es correcto, cada comparación es justa, y la ventaja — donde existe — es exactamente del tipo que los números de recursos respaldan (consultas, asintótica o no-localidad), nunca un 'speedup exponencial' de marketing sobre una tarea por la que valga la pena pagar."}
          </Callout>
          <Refs ids={["bernstein1997", "simon1997", "grover1996", "shor1997", "gidney2025", "huang2021", "chsh1969", "preskill2018"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────── 6 · Robustness & sweeps ───────────────────── */
    {
      id: "robustness",
      label: en ? "Robustness & sweeps" : "Robustez y barridos",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "A single headline number can hide fragility, so the cases that have a free parameter ship a full sweep over it rather than one cherry-picked point. Grover sweeps the iteration count k and shows the over-rotation curve P_succ(k)=sin²((2k+1)θ): the probability climbs to its peak at k★≈(π/4)√(N/M) and then falls again if you keep iterating — a non-monotone curve that a one-point claim would erase. CHSH sweeps the measurement angles and traces S from the separable-state 1.414 through sub-optimal settings up to the Tsirelson 2.828, so the violation is shown as a continuum, not a single lucky angle. Interference sweeps the phase φ and reproduces the full P(0)=cos²(φ/2) fringe, including the exact cancellation at φ=π."
              : "Un único número titular puede esconder fragilidad, así que los casos con un parámetro libre incluyen un barrido completo en vez de un punto elegido a dedo. Grover barre el conteo de iteraciones k y muestra la curva de sobre-rotación P_éxito(k)=sin²((2k+1)θ): la probabilidad sube a su pico en k★≈(π/4)√(N/M) y luego cae de nuevo si se sigue iterando — una curva no monótona que una afirmación de un punto borraría. CHSH barre los ángulos de medición y traza S desde el 1.414 del estado separable, pasando por ajustes subóptimos, hasta el 2.828 de Tsirelson, así que la violación se muestra como un continuo, no un único ángulo afortunado. La interferencia barre la fase φ y reproduce la franja completa P(0)=cos²(φ/2), incluida la cancelación exacta en φ=π."}
          </p>
          <Eq
            tex={String.raw`P_0(\varphi)=\cos^2\!\tfrac{\varphi}{2}\ \xrightarrow{\ \varphi=\pi\ }\ 0\quad(\text{exact cancellation}),\qquad S(\theta)\ \text{swept from }1.414\to 2\to 2.828`}
            caption={{
              en: "Two swept fringes: the Mach–Zehnder probability P₀(φ)=cos²(φ/2) cancelling exactly at φ=π, and the CHSH value S traced from a separable state up to the Tsirelson bound.",
              es: "Dos franjas barridas: la probabilidad Mach–Zehnder P₀(φ)=cos²(φ/2) cancelándose exacto en φ=π, y el valor CHSH S trazado desde un estado separable hasta la cota de Tsirelson.",
            }}
          />
          <p>
            {en
              ? "The noise-and-correction cases are the most important robustness experiments, because their whole point is how a metric degrades. The ZNE case is a 2-D sweep over noise probability p and circuit depth: it reports the error before mitigation and after extrapolating ⟨O⟩(λ) from λ∈{1,3,5} to λ=0, and shows the reduction shrinking from ≈11× to ≈1.5× as the underlying noise grows — the honest statement that mitigation buys less as the device gets worse. The QEC cases are a 2-D sweep over code distance d and physical error rate p, and they reproduce the threshold crossover directly: below p_th the logical error rate falls with distance (d=5 beats d=3), at p_th the curves cross, and above p_th adding qubits makes things worse. That crossover — not a flat 100% — is the real result, and it is exactly what a degradation curve is for."
              : "Los casos de ruido y corrección son los experimentos de robustez más importantes, porque su razón de ser es cómo se degrada una métrica. El caso ZNE es un barrido 2-D sobre la probabilidad de ruido p y la profundidad del circuito: reporta el error antes de mitigar y después de extrapolar ⟨O⟩(λ) desde λ∈{1,3,5} a λ=0, y muestra la reducción encogiéndose de ≈11× a ≈1.5× a medida que crece el ruido subyacente — la afirmación honesta de que la mitigación rinde menos cuando el dispositivo empeora. Los casos de QEC son un barrido 2-D sobre la distancia del código d y la tasa de error físico p, y reproducen el cruce de umbral directamente: bajo p_th la tasa de error lógico cae con la distancia (d=5 le gana a d=3), en p_th las curvas se cruzan, y sobre p_th agregar qubits empeora las cosas. Ese cruce — no un 100% plano — es el resultado real, y es exactamente para lo que sirve una curva de degradación."}
          </p>
          <div className="bound-row">
            <span className="bound-chip"><b>Grover</b> {en ? "sweep k → over-rotation" : "barrido k → sobre-rotación"}</span>
            <span className="bound-chip"><b>CHSH</b> {en ? "sweep angles → 1.414…2.828" : "barrido ángulos → 1.414…2.828"}</span>
            <span className="bound-chip"><b>{en ? "Interference" : "Interferencia"}</b> {en ? "sweep φ → cos²(φ/2)" : "barrido φ → cos²(φ/2)"}</span>
            <span className="bound-chip"><b>ZNE</b> {en ? "sweep p × depth" : "barrido p × profundidad"}</span>
            <span className="bound-chip"><b>QEC</b> {en ? "sweep d × p → threshold" : "barrido d × p → umbral"}</span>
            <span className="bound-chip"><b>QPE</b> {en ? "exact vs finite-precision φ" : "φ exacto vs precisión finita"}</span>
          </div>
          <Callout
            title={en ? "Degradation, not a flat 100% —" : "Degradación, no un 100% plano —"}
            pt={en
              ? "Where a number can fall, QLab shows the whole curve — the over-rotation dip, the mitigation shrinking, the QEC threshold — never a single best-case point."
              : "Donde un número puede caer, QLab muestra la curva entera — el bajón de sobre-rotación, la mitigación encogiéndose, el umbral de QEC — nunca un único punto de mejor caso."}>
            {en
              ? "the QPE case makes the same point inside one family: its 'exact' variants (φ = 1/4, 5/8, 3/16) land with probability 1.00, while the finite-precision variants (φ = 0.3, 0.8, 0.1) land on the nearest m/2ᵗ bin at 0.58–0.88 with the rest spread over neighbours — the honest resolution limit, not a hidden rounding."
              : "el caso QPE hace el mismo punto dentro de una familia: sus variantes 'exactas' (φ = 1/4, 5/8, 3/16) caen con probabilidad 1.00, mientras que las de precisión finita (φ = 0.3, 0.8, 0.1) caen en el bin m/2ᵗ más cercano a 0.58–0.88 con el resto repartido en vecinos — el límite de resolución honesto, no un redondeo escondido."}
          </Callout>
          <Refs ids={["grover1996", "chsh1969", "feynman1965", "temme2017", "giurgicatiron2020", "fowler2012", "google2024willow"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────── 7 · Datasets & coverage (live) ────────────── */
    {
      id: "datasets",
      label: en ? "Datasets & coverage" : "Datasets y cobertura",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "This table is generated live from the committed catalog — the set of shipped manifests — so it can never drift from what the build actually contains. Each row is one case: how many parametric regimes (variants) it ships, how those split across the live (clean, in-browser) and precompute (needs noise / feed-forward / optimisation / >12 qubits) lanes, which frameworks produced it, whether it carries a classical baseline, and where its data comes from. Most cases are exact engine output with no external dataset; the four data-driven cases use a labelled, generated regime family rather than a re-hosted external dataset, and those cells are tagged SYNTHETIC so the distinction is never blurred."
              : "Esta tabla se genera en vivo desde el catálogo commiteado — el conjunto de manifiestos publicados — así que nunca puede desviarse de lo que el build realmente contiene. Cada fila es un caso: cuántos regímenes paramétricos (variantes) incluye, cómo se reparten entre los carriles live (limpio, en navegador) y precompute (necesita ruido / feed-forward / optimización / >12 qubits), qué frameworks lo produjeron, si lleva un baseline clásico, y de dónde vienen sus datos. La mayoría de los casos son salida exacta del motor sin dataset externo; los cuatro casos basados en datos usan una familia de regímenes generada y etiquetada en vez de un dataset externo re-hospedado, y esas celdas se marcan SYNTHETIC para que la distinción nunca se difumine."}
          </p>
          {cat ? (
            <>
              <div className="stat-row">
                <div className="stat"><b>{stats.cases}</b><span>{en ? "cases" : "casos"}</span></div>
                <div className="stat"><b>{stats.variants}</b><span>{en ? "regimes" : "regímenes"}</span></div>
                <div className="stat"><b>{stats.frameworks}</b><span>frameworks</span></div>
                <div className="stat"><b>{stats.live}/{stats.precompute}</b><span>live / precompute</span></div>
                <div className="stat"><b>{stats.withClassical}/{stats.cases}</b><span>{en ? "vs classical" : "vs clásico"}</span></div>
                <div className="stat"><b>{stats.synth}</b><span>{en ? "synthetic-data cases" : "casos con datos sintéticos"}</span></div>
              </div>
              <table className="impl-table cover-table">
                <thead><tr>
                  <th>{en ? "Case" : "Caso"}</th>
                  <th>{en ? "Regimes" : "Regímenes"}</th>
                  <th>{en ? "Live / Pre." : "Live / Pre."}</th>
                  <th>Frameworks</th>
                  <th>{en ? "Baseline" : "Baseline"}</th>
                  <th>{en ? "Data source" : "Fuente de datos"}</th>
                </tr></thead>
                <tbody>
                  {[...byCat.entries()].map(([category, crs]) => (
                    <CategoryBlock key={category} category={category} crs={crs} lang={lang} en={en} />
                  ))}
                </tbody>
              </table>
              <p className="fine">{en
                ? "Lane key — live: a clean small unitary that re-runs exactly in the browser (≤12 qubits). precompute: needs a noise model, mid-circuit feed-forward, variational optimisation or stabiliser sampling, so it ships as a committed trace replayed in the browser. Both lanes use the identical renderer; the only difference is where the numbers were produced."
                : "Clave de carril — live: un unitario limpio y chico que se re-ejecuta exacto en el navegador (≤12 qubits). precompute: necesita un modelo de ruido, feed-forward a mitad de circuito, optimización variacional o muestreo de estabilizadores, así que se publica como traza commiteada reproducida en el navegador. Ambos carriles usan el renderer idéntico; la única diferencia es dónde se produjeron los números."}</p>
            </>
          ) : <p className="note">{en ? "Loading the committed catalog…" : "Cargando el catálogo commiteado…"}</p>}
          <Callout
            title={en ? "Synthetic where labelled, exact everywhere else —" : "Sintético donde se etiqueta, exacto en el resto —"}
            pt={en
              ? "No external restricted dataset is re-hosted here; the data-driven cases use generated, class-balanced regimes, and they say so."
              : "Ningún dataset externo restringido se re-hospeda aquí; los casos basados en datos usan regímenes generados y balanceados por clase, y lo dicen."}>
            {en
              ? "the QML and the two optimisation cases (QAOA/MaxCut, VQE) draw their inputs from a deterministic, seeded generator (the two-moons / parametric-graph / bond-length families) — labelled SYNTHETIC above — precisely so the leakage-safe protocol can be applied without licensing a real dataset. Every quantum and physics case is exact engine output, with the classical baseline computed in the same run."
              : "el caso QML y los dos casos de optimización (QAOA/MaxCut, VQE) toman sus entradas de un generador determinista con semilla (las familias de dos-lunas / grafo-paramétrico / longitud-de-enlace) — etiquetadas SYNTHETIC arriba — justamente para que el protocolo sin fuga pueda aplicarse sin licenciar un dataset real. Todo caso cuántico y de física es salida exacta del motor, con el baseline clásico computado en la misma ejecución."}
          </Callout>
          <Refs ids={["ecma404", "qiskit2024", "huang2021", "peruzzo2014"]} label={refLabel} />
        </div>
      ),
    },
  ];

  return (
    <div className="page-body prose">
      <div className="page-head">
        <h1>{en ? "Experiments" : "Experimentos"}</h1>
        <p className="lede">
          {en
            ? "How QLab earns its claims: the seeded, reproducible protocol behind every committed trace; the leakage-safe held-out evaluation for the only learned cases; the exact metric for each experimental question; the three-engine cross-check that catches a wrong number; the honest quantum-vs-classical scorecard; the degradation sweeps; and the live coverage of cases × frameworks. It is not a 'we tested it, it works' page — it is the audit."
            : "Cómo QLab gana sus afirmaciones: el protocolo con semilla y reproducible detrás de cada traza commiteada; la evaluación held-out sin fuga para los únicos casos aprendidos; la métrica exacta de cada pregunta experimental; la validación de tres motores que atrapa un número erróneo; la tarjeta honesta cuántico-vs-clásico; los barridos de degradación; y la cobertura en vivo de casos × frameworks. No es una página de 'lo probamos, funciona' — es la auditoría."}
        </p>
      </div>
      <Tabs tabs={tabs} initial="protocol" />
    </div>
  );
}

function CategoryBlock({ category, crs, lang, en }: { category: string; crs: CaseRow[]; lang: Lang; en: boolean }) {
  const label = CATEGORY_LABELS[category]?.[lang] ?? category;
  return (
    <>
      <tr className="cat-head-row"><td colSpan={6}>{label}</td></tr>
      {crs.map((r) => (
        <tr key={r.id}>
          <td>{r.title}</td>
          <td>{r.variants}</td>
          <td>
            <span className="lane-pill live">{r.live}</span>{" "}
            {r.precompute > 0 ? <span className="lane-pill precompute">{r.precompute}</span> : <span className="fine">—</span>}
          </td>
          <td>{r.frameworks.map((f) => <span key={f} className="fw-chip">{f}</span>)}</td>
          <td>{r.hasClassical ? "✓" : "—"}</td>
          <td>
            {r.source === "synthetic"
              ? <span className="syn-tag">{en ? "synthetic" : "sintético"}</span>
              : <span className="real-tag">{en ? "exact engine" : "motor exacto"}</span>}
          </td>
        </tr>
      ))}
    </>
  );
}
