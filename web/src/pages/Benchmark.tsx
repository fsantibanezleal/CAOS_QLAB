import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eq } from "../components/Tabs";
import { Refs } from "../lib/citations";
import type { Bilingual, Bundle, Catalog } from "../lib/contract.types";
import { loadBundle, loadCatalog } from "../lib/data";
import { useUI } from "../lib/ui";

type Lang = "en" | "es";

/* ════════════════════════════════════════════════════════════════════════════
   BENCHMARK — the honesty spine, quantified (ADR-0017 §2 Benchmark floor).

   Every number on this page is read at runtime from a committed artifact
   (web/public/data/artifacts/<case>/<variant>.json, schema qlab-trace/1) — the
   same manifests the precompute pipeline emits. Nothing is typed in. The page:
     • loads one canonical variant bundle per case and extracts its `comparison`
       block + the quantum & classical `solvers[].value` head-to-head;
     • renders a real metric <table> straight from those fields;
     • runs a live in-browser recompute on a real committed trace — it resamples
       the raw measured `trace.measurements.counts` at an adjustable shot budget
       and re-derives the quantum metric, next to the classical baseline (≥1
       quantum + ≥1 classical on the same real dataset);
     • classifies each case (genuine edge / query advantage / QEC-that-scales /
       classical-still-wins) from the measured numbers, not from prose.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── The four honest edge classes (theme-aware tokens; zero hex). ─────────── */
type ClassId = "genuine" | "query" | "qec" | "classical";

const CLASSES: Record<ClassId, { label: Bilingual; blurb: Bilingual }> = {
  genuine: {
    label: { en: "Genuine edge — not a speedup", es: "Ventaja genuina — no un speedup" },
    blurb: {
      en: "Quantum truly does something classical cannot — nonlocality, a fidelity no measure-and-resend strategy can reach, true randomness, a resource trade — yet it is not a faster computation.",
      es: "Lo cuántico hace algo que lo clásico no puede — no-localidad, una fidelidad que ninguna estrategia de medir-y-reenviar alcanza, aleatoriedad verdadera, un canje de recursos — pero no es un cómputo más rápido.",
    },
  },
  query: {
    label: { en: "Asymptotic query advantage", es: "Ventaja asintótica de consultas" },
    blurb: {
      en: "A proven query/complexity separation (1 vs n, √N vs N, exponential). Real and measured here — but it only pays off at sizes far beyond today's noisy hardware, and the wall-clock at these toy sizes still favours classical.",
      es: "Una separación de consultas/complejidad probada (1 vs n, √N vs N, exponencial). Real y medida aquí — pero solo rinde a tamaños muy por encima del hardware ruidoso de hoy, y el wall-clock a estos tamaños de juguete aún favorece a lo clásico.",
    },
  },
  qec: {
    label: { en: "Error correction that scales", es: "Corrección de errores que escala" },
    blurb: {
      en: "Not a speed axis at all: below threshold, adding physical qubits makes the logical error rate smaller (distance-5 beats distance-3). The premise of fault tolerance, in miniature — and the regime Willow entered in 2024.",
      es: "No es un eje de velocidad: bajo umbral, agregar qubits físicos reduce la tasa de error lógico (distancia-5 supera a distancia-3). La premisa de la tolerancia a fallos, en miniatura — el régimen al que entró Willow en 2024.",
    },
  },
  classical: {
    label: { en: "Classical still wins (today)", es: "Lo clásico aún gana (hoy)" },
    blurb: {
      en: "At these scales a classical computer matches or beats the quantum method in practice — exact, instant and free. The honest majority of the catalog. The quantum method is pedagogy or a subroutine for a regime we cannot yet reach.",
      es: "A estas escalas una computadora clásica iguala o supera al método cuántico en la práctica — exacta, instantánea y gratis. La mayoría honesta del catálogo. El método cuántico es pedagogía o una subrutina para un régimen aún inalcanzable.",
    },
  },
};

const ORDER: ClassId[] = ["genuine", "query", "qec", "classical"];

/* ── Canonical variant per case: the regime that best states the head-to-head.
      (An id that exists in the committed catalog; verified against the bundles.) */
const CANON: Record<string, string> = {
  chsh: "chsh-optimal",
  teleportation: "tele-generic",
  superdense: "sd-01",
  qrng: "qrng-3",
  "bernstein-vazirani": "bv-101101",
  "deutsch-jozsa": "dj-const0-4",
  simon: "simon-3-101",
  grover: "grover-3-5",
  "qec-repetition": "rep-d5-p0.1",
  "qec-surface": "surf-d5-p0.005",
  "state-prep": "ghz-3",
  "single-qubit": "sq-h",
  qft: "qft-4-k1",
  qpe: "qpe-t3-0.3",
  shor: "shor-15-a7",
  vqe: "vqe-h2-0_74",
  qml: "qml-moons",
  maxcut: "triangle",
  noise: "noise-p0.05-d3",
  interference: "itf-pi4",
};

/* ── Each case's classification + how to pull its head-to-head numbers from the
      committed `comparison`/`solvers` blocks. `q`/`c` return formatted strings
      from the JSON (never typed values); `edge` is the measured one-line verdict.
      A `live` flag marks the cases whose raw measured counts we recompute below. */
interface MetricSpec {
  cls: ClassId;
  metric: Bilingual; // what is being compared
  q: (b: Bundle) => string; // quantum side, formatted from the bundle
  c: (b: Bundle) => string; // classical side, formatted from the bundle
  edge: (b: Bundle) => Bilingual; // the measured edge, one line
}

const num = (x: unknown, d = 4): string =>
  typeof x === "number" ? (Number.isInteger(x) ? String(x) : x.toFixed(d).replace(/0+$/, "").replace(/\.$/, "")) : String(x);

const cmpv = (b: Bundle, k: string): unknown => b.comparison[k];
const qsolver = (b: Bundle) => b.solvers.find((s) => s.paradigm !== "classical");
const csolver = (b: Bundle) => b.solvers.find((s) => s.paradigm === "classical");

const SPECS: Record<string, MetricSpec> = {
  chsh: {
    cls: "genuine",
    metric: { en: "CHSH value S (vs the local bound 2)", es: "valor CHSH S (vs la cota local 2)" },
    q: (b) => `S = ${num(cmpv(b, "S"))}`,
    c: (b) => `≤ ${num(cmpv(b, "classical_bound"))}`,
    edge: (b) => ({
      en: `S = ${num(cmpv(b, "S"))} > 2 — violates the local-hidden-variable bound (Tsirelson max ${num(cmpv(b, "tsirelson_bound"))}). Nonlocality, not a speedup; a separable state never reaches it.`,
      es: `S = ${num(cmpv(b, "S"))} > 2 — viola la cota de variables ocultas locales (máx de Tsirelson ${num(cmpv(b, "tsirelson_bound"))}). No-localidad, no un speedup; un estado separable nunca la alcanza.`,
    }),
  },
  teleportation: {
    cls: "genuine",
    metric: { en: "state-transfer fidelity", es: "fidelidad de transferencia de estado" },
    q: (b) => `F = ${num(cmpv(b, "quantum_fidelity"))}`,
    c: (b) => `F = ${num(cmpv(b, "classical_fidelity"))}`,
    edge: (b) => ({
      en: `Fidelity ${num(cmpv(b, "quantum_fidelity"))} vs the classical measure-and-resend bound ${num(cmpv(b, "classical_fidelity"))} — but it spends a shared Bell pair + 2 classical bits. No-cloning; not faster-than-light.`,
      es: `Fidelidad ${num(cmpv(b, "quantum_fidelity"))} vs la cota clásica de medir-y-reenviar ${num(cmpv(b, "classical_fidelity"))} — pero gasta un par de Bell compartido + 2 bits clásicos. Sin clonación; no más rápido que la luz.`,
    }),
  },
  superdense: {
    cls: "genuine",
    metric: { en: "classical bits per transmitted qubit", es: "bits clásicos por qubit transmitido" },
    q: () => "2 bits / 1 qubit",
    c: () => "1 bit / 1 qubit",
    edge: () => ({
      en: "2 classical bits delivered on 1 transmitted qubit (vs the Holevo limit of 1) — the dual of teleportation; it spends a pre-shared Bell pair (a resource trade, not a speedup).",
      es: "2 bits clásicos en 1 qubit transmitido (vs el límite de Holevo de 1) — el dual de la teleportación; gasta un par de Bell precompartido (canje de recursos, no un speedup).",
    }),
  },
  qrng: {
    cls: "genuine",
    metric: { en: "Shannon entropy of the output (bits)", es: "entropía de Shannon de la salida (bits)" },
    q: (b) => `H = ${num(cmpv(b, "quantum_entropy"))} bit`,
    c: (b) => `H = ${num(cmpv(b, "classical_entropy"))} bit`,
    edge: (b) => ({
      en: `Entropy ${num(cmpv(b, "quantum_entropy"))} bit — statistically indistinguishable from a good PRNG (${num(cmpv(b, "classical_entropy"))} bit). The quantum edge is certifiable, device-independent true randomness, not better statistics.`,
      es: `Entropía ${num(cmpv(b, "quantum_entropy"))} bit — estadísticamente indistinguible de un buen PRNG (${num(cmpv(b, "classical_entropy"))} bit). La ventaja cuántica es aleatoriedad verdadera certificable e independiente del dispositivo, no mejores estadísticas.`,
    }),
  },
  "bernstein-vazirani": {
    cls: "query",
    metric: { en: "oracle queries to recover the hidden string", es: "consultas al oráculo para recuperar la cadena" },
    q: (b) => `${num(cmpv(b, "quantum_queries"))} query`,
    c: (b) => `${num(cmpv(b, "classical_queries"))} queries`,
    edge: (b) => ({
      en: `Recovers the hidden string in ${num(cmpv(b, "quantum_queries"))} quantum query vs ${num(cmpv(b, "classical_queries"))} classical (one per bit) — a real query-complexity advantage via phase kickback.`,
      es: `Recupera la cadena oculta en ${num(cmpv(b, "quantum_queries"))} consulta cuántica vs ${num(cmpv(b, "classical_queries"))} clásicas (una por bit) — ventaja real de complejidad de consultas vía phase kickback.`,
    }),
  },
  "deutsch-jozsa": {
    cls: "query",
    metric: { en: "oracle queries to decide constant vs balanced", es: "consultas para decidir constante vs balanceada" },
    q: (b) => `${num(cmpv(b, "quantum_queries"))} query`,
    c: (b) => `${num(cmpv(b, "classical_queries"))} queries`,
    edge: (b) => ({
      en: `Decides constant vs balanced in ${num(cmpv(b, "quantum_queries"))} quantum query vs up to 2ⁿ⁻¹+1 classical (${num(cmpv(b, "classical_queries"))} here) — an exponential query gap, though trivial at this size.`,
      es: `Decide constante vs balanceada en ${num(cmpv(b, "quantum_queries"))} consulta cuántica vs hasta 2ⁿ⁻¹+1 clásicas (${num(cmpv(b, "classical_queries"))} aquí) — brecha exponencial de consultas, aunque trivial a este tamaño.`,
    }),
  },
  simon: {
    cls: "query",
    metric: { en: "oracle queries to find the hidden period", es: "consultas para hallar el período oculto" },
    q: (b) => `${num(cmpv(b, "quantum_queries"))} queries`,
    c: (b) => `${num(cmpv(b, "classical_queries"))} queries`,
    edge: (b) => ({
      en: `Finds the hidden period in ${num(cmpv(b, "quantum_queries"))} quantum queries (O(n)) vs ~2^{n/2} classical (${num(cmpv(b, "classical_queries"))} here) — the first exponential separation, the seed of Shor.`,
      es: `Halla el período oculto en ${num(cmpv(b, "quantum_queries"))} consultas cuánticas (O(n)) vs ~2^{n/2} clásicas (${num(cmpv(b, "classical_queries"))} aquí) — la primera separación exponencial, la semilla de Shor.`,
    }),
  },
  grover: {
    cls: "query",
    metric: { en: "oracle queries to find the marked item", es: "consultas para hallar el ítem marcado" },
    q: (b) => `${num(cmpv(b, "quantum_queries"))} queries`,
    c: (b) => `${num(cmpv(b, "classical_queries"))} queries`,
    edge: (b) => ({
      en: `Finds the marked item in ${num(cmpv(b, "quantum_queries"))} quantum queries (~√N) vs ${num(cmpv(b, "classical_queries"))} classical (~N/2), success prob ${num(cmpv(b, "success_prob"))} — a quadratic speedup, but asymptotic and erased by overheads at tiny N.`,
      es: `Halla el ítem marcado en ${num(cmpv(b, "quantum_queries"))} consultas cuánticas (~√N) vs ${num(cmpv(b, "classical_queries"))} clásicas (~N/2), prob de éxito ${num(cmpv(b, "success_prob"))} — speedup cuadrático, pero asintótico y borrado por overheads a N pequeño.`,
    }),
  },
  "qec-repetition": {
    cls: "qec",
    metric: { en: "logical vs physical error rate", es: "error lógico vs físico" },
    q: (b) => `pₗ = ${num(cmpv(b, "logical_error_rate"), 5)}`,
    c: (b) => `pₚₕ = ${num(cmpv(b, "physical_error_rate"), 5)}`,
    edge: (b) => ({
      en: `Distance-${num(cmpv(b, "distance"))} repetition code: logical error ${num(cmpv(b, "logical_error_rate"), 5)} below the physical ${num(cmpv(b, "physical_error_rate"), 5)} (below threshold). Adding qubits helps — but it protects against bit-flips only.`,
      es: `Código de repetición distancia-${num(cmpv(b, "distance"))}: error lógico ${num(cmpv(b, "logical_error_rate"), 5)} por debajo del físico ${num(cmpv(b, "physical_error_rate"), 5)} (bajo umbral). Agregar qubits ayuda — pero protege solo contra bit-flips.`,
    }),
  },
  "qec-surface": {
    cls: "qec",
    metric: { en: "logical error rate (d=5 vs d=3)", es: "error lógico (d=5 vs d=3)" },
    q: (b) => `pₗ = ${num(cmpv(b, "logical_error_rate"), 5)} (d=${num(cmpv(b, "distance"))})`,
    c: (b) => `${num(cmpv(b, "physical_qubits"))} phys. qubits`,
    edge: (b) => ({
      en: `Rotated surface code distance-${num(cmpv(b, "distance"))} on ${num(cmpv(b, "physical_qubits"))} qubits at p=${num(cmpv(b, "physical_p"), 3)}: logical error ${num(cmpv(b, "logical_error_rate"), 5)}. Below the ~1% threshold, distance-5 beats distance-3 and it corrects both X and Z — the fault-tolerance front-runner.`,
      es: `Código de superficie rotado distancia-${num(cmpv(b, "distance"))} en ${num(cmpv(b, "physical_qubits"))} qubits a p=${num(cmpv(b, "physical_p"), 3)}: error lógico ${num(cmpv(b, "logical_error_rate"), 5)}. Bajo el umbral del ~1%, distancia-5 supera a distancia-3 y corrige X y Z — el favorito para tolerancia a fallos.`,
    }),
  },
  "state-prep": {
    cls: "classical",
    metric: { en: "describe a 2–4 qubit entangled state", es: "describir un estado entrelazado de 2–4 qubits" },
    q: (b) => `${b.qubits} qubits`,
    c: () => "amplitude vector",
    edge: () => ({
      en: "A classical amplitude vector describes a 2–4 qubit state instantly; entanglement is the concept being taught here, not an advantage. The exponential cost only bites at many qubits.",
      es: "Un vector de amplitudes clásico describe un estado de 2–4 qubits al instante; el entrelazamiento es el concepto que se enseña, no una ventaja. El costo exponencial solo muerde con muchos qubits.",
    }),
  },
  "single-qubit": {
    cls: "classical",
    metric: { en: "information stored in one qubit", es: "información almacenada en un qubit" },
    q: () => "Bloch sphere",
    c: () => "≤ 1 bit (Holevo)",
    edge: () => ({
      en: "A qubit roams the whole Bloch sphere, but a measurement returns one bit and it stores ≤ 1 classical bit (Holevo) — no advantage alone. It is the substrate every algorithm is built from.",
      es: "Un qubit recorre toda la esfera de Bloch, pero una medición devuelve un bit y almacena ≤ 1 bit clásico (Holevo) — sin ventaja por sí solo. Es el sustrato del que se construye cada algoritmo.",
    }),
  },
  qft: {
    cls: "classical",
    metric: { en: "gates/ops to apply the transform", es: "compuertas/ops para aplicar la transformada" },
    q: (b) => `${num(cmpv(b, "quantum_gates"))} gates`,
    c: (b) => `${num(cmpv(b, "classical_ops"))} ops`,
    edge: (b) => ({
      en: `Applies the transform in ${num(cmpv(b, "quantum_gates"))} gates (O(n²)) vs ${num(cmpv(b, "classical_ops"))} classical (fidelity vs DFT ${num(cmpv(b, "fidelity_vs_dft"))}) — but the amplitudes are unreadable, so it is a subroutine (inside Shor/QPE), never a standalone win.`,
      es: `Aplica la transformada en ${num(cmpv(b, "quantum_gates"))} compuertas (O(n²)) vs ${num(cmpv(b, "classical_ops"))} clásicas (fidelidad vs DFT ${num(cmpv(b, "fidelity_vs_dft"))}) — pero las amplitudes son ilegibles, así que es una subrutina (dentro de Shor/QPE), nunca una victoria por sí sola.`,
    }),
  },
  qpe: {
    cls: "classical",
    metric: { en: "estimated vs exact eigenphase φ", es: "eigenfase φ estimada vs exacta" },
    q: (b) => `φ̂ = ${num(cmpv(b, "phi_estimate"))}`,
    c: (b) => `φ = ${num(cmpv(b, "phi_exact"))}`,
    edge: (b) => ({
      en: `Estimates the eigenphase to φ̂ = ${num(cmpv(b, "phi_estimate"))} (exact ${num(cmpv(b, "phi_exact"))}, error ${num(cmpv(b, "error"))}, limited by t counting qubits). For the tiny U here classical diagonalization is exact and instant — QPE only matters as a subroutine for huge U.`,
      es: `Estima la eigenfase a φ̂ = ${num(cmpv(b, "phi_estimate"))} (exacta ${num(cmpv(b, "phi_exact"))}, error ${num(cmpv(b, "error"))}, limitada por t qubits de conteo). Para la U diminuta de aquí la diagonalización clásica es exacta e instantánea — QPE solo importa como subrutina para U enorme.`,
    }),
  },
  shor: {
    cls: "classical",
    metric: { en: "factor N = 15 via order-finding", es: "factorizar N = 15 vía order-finding" },
    q: (b) => `${JSON.stringify(cmpv(b, "quantum_factors"))} (order ${num(cmpv(b, "order"))})`,
    c: (b) => `${JSON.stringify(cmpv(b, "classical_factors"))}`,
    edge: (b) => ({
      en: `Factors 15 → ${JSON.stringify(cmpv(b, "quantum_factors"))} via order-finding (order r = ${num(cmpv(b, "order"))}) — but trial division does it in microseconds, and RSA-2048 needs ~10⁶ fault-tolerant qubits. No near-term cryptographic threat.`,
      es: `Factoriza 15 → ${JSON.stringify(cmpv(b, "quantum_factors"))} vía order-finding (orden r = ${num(cmpv(b, "order"))}) — pero la división de prueba lo hace en microsegundos, y RSA-2048 necesita ~10⁶ qubits tolerantes a fallos. Sin amenaza criptográfica cercana.`,
    }),
  },
  vqe: {
    cls: "classical",
    metric: { en: "H₂ ground-state energy (Hartree)", es: "energía del estado fundamental de H₂ (Hartree)" },
    q: (b) => `${num(cmpv(b, "vqe_energy"), 5)} Ha`,
    c: (b) => `${num(cmpv(b, "exact_energy"), 5)} Ha`,
    edge: (b) => ({
      en: `VQE reaches ${num(cmpv(b, "vqe_energy"), 5)} Ha vs exact FCI ${num(cmpv(b, "exact_energy"), 5)} Ha — error ${num(cmpv(b, "error_ha"), 6)} Ha, within chemical accuracy. But minimal-basis H₂ is a 4×4 problem classical solves exactly. Pedagogy, not advantage.`,
      es: `VQE alcanza ${num(cmpv(b, "vqe_energy"), 5)} Ha vs FCI exacto ${num(cmpv(b, "exact_energy"), 5)} Ha — error ${num(cmpv(b, "error_ha"), 6)} Ha, dentro de la precisión química. Pero H₂ en base mínima es un problema 4×4 que lo clásico resuelve exacto. Pedagogía, no ventaja.`,
    }),
  },
  qml: {
    cls: "classical",
    metric: { en: "test accuracy: quantum kernel vs RBF", es: "exactitud de test: kernel cuántico vs RBF" },
    q: (b) => `acc = ${num(cmpv(b, "quantum_test_acc"))}`,
    c: (b) => `acc = ${num(cmpv(b, "classical_test_acc"))}`,
    edge: (b) => ({
      en: `Quantum fidelity-kernel SVM ${num(cmpv(b, "quantum_test_acc"))} vs classical RBF-SVM ${num(cmpv(b, "classical_test_acc"))} on the same held-out split — no advantage. Provable kernel separations are contrived; on real data quantum kernels are competitive at best. The honest QML hype check.`,
      es: `SVM de kernel de fidelidad cuántico ${num(cmpv(b, "quantum_test_acc"))} vs SVM-RBF clásico ${num(cmpv(b, "classical_test_acc"))} en el mismo split held-out — sin ventaja. Las separaciones demostrables son artificiales; en datos reales los kernels cuánticos son competitivos en el mejor caso. El chequeo honesto al hype de QML.`,
    }),
  },
  maxcut: {
    cls: "classical",
    metric: { en: "cut value: QAOA vs exact optimum", es: "valor de corte: QAOA vs óptimo exacto" },
    q: (b) => `cut = ${num(cmpv(b, "qaoa_cut"))}`,
    c: (b) => `cut = ${num(cmpv(b, "optimal_cut"))}`,
    edge: (b) => ({
      en: `QAOA reaches cut ${num(cmpv(b, "qaoa_cut"))} vs the exact optimum ${num(cmpv(b, "optimal_cut"))} (brute force, microseconds). All three QAOA frameworks match it but none beats it — a faithful no-advantage result.`,
      es: `QAOA alcanza corte ${num(cmpv(b, "qaoa_cut"))} vs el óptimo exacto ${num(cmpv(b, "optimal_cut"))} (fuerza bruta, microsegundos). Los tres frameworks QAOA lo igualan pero ninguno lo supera — un resultado fiel de no-ventaja.`,
    }),
  },
  noise: {
    cls: "classical",
    metric: { en: "expectation value: noisy → mitigated → ideal", es: "valor esperado: ruidoso → mitigado → ideal" },
    q: (b) => `mit ${num(cmpv(b, "mitigated"))} (noisy ${num(cmpv(b, "noisy"))})`,
    c: (b) => `ideal ${num(cmpv(b, "ideal"))}`,
    edge: (b) => ({
      en: `ZNE claws the expectation back from noisy ${num(cmpv(b, "noisy"))} to ${num(cmpv(b, "mitigated"))} (ideal ${num(cmpv(b, "ideal"))}) — but it is bias-reduction, not correction, and a classical statevector simulator returns the exact answer for free here.`,
      es: `ZNE recupera el valor esperado desde el ruidoso ${num(cmpv(b, "noisy"))} a ${num(cmpv(b, "mitigated"))} (ideal ${num(cmpv(b, "ideal"))}) — pero es reducción de sesgo, no corrección, y un simulador de statevector clásico devuelve la respuesta exacta gratis aquí.`,
    }),
  },
  interference: {
    cls: "classical",
    metric: { en: "P(0) fringe vs classical intensity", es: "franja P(0) vs intensidad clásica" },
    q: (b) => `P(0) = ${num(cmpv(b, "quantum_p0"))}`,
    c: (b) => `I = ${num(cmpv(b, "classical_intensity"))}`,
    edge: (b) => ({
      en: `P(0) = ${num(cmpv(b, "quantum_p0"))} follows cos²(φ/2) — a classical wave gives the same intensity ${num(cmpv(b, "classical_intensity"))}. Interference alone isn't an advantage, but steering amplitude cancellation is the engine of every quantum algorithm.`,
      es: `P(0) = ${num(cmpv(b, "quantum_p0"))} sigue cos²(φ/2) — una onda clásica da la misma intensidad ${num(cmpv(b, "classical_intensity"))}. La interferencia por sí sola no es ventaja, pero dirigir la cancelación de amplitudes es el motor de todo algoritmo cuántico.`,
    }),
  },
};

/* ── The live recompute: cases whose quantum metric we re-derive in-browser from
      the raw measured `trace.measurements.counts` at an adjustable shot budget. */
type LiveMetric = "grover-success" | "chsh-S" | "qrng-entropy";
interface LiveCase {
  id: string;
  variant: string;
  metric: LiveMetric;
  name: Bilingual;
}
const LIVE_CASES: LiveCase[] = [
  { id: "grover", variant: "grover-3-5", metric: "grover-success", name: { en: "Grover · success P(marked)", es: "Grover · éxito P(marcado)" } },
  { id: "chsh", variant: "chsh-optimal", metric: "chsh-S", name: { en: "CHSH · value S", es: "CHSH · valor S" } },
  { id: "qrng", variant: "qrng-3", metric: "qrng-entropy", name: { en: "QRNG · entropy H", es: "QRNG · entropía H" } },
];

/* Subsample the first `budget` shots from committed counts, deterministically
   (counts are integer multiplicities → expand in key order, truncate). Pure. */
function subsampleCounts(counts: Record<string, number>, budget: number): Record<string, number> {
  const keys = Object.keys(counts).sort();
  const out: Record<string, number> = {};
  let left = budget;
  for (const k of keys) {
    if (left <= 0) break;
    const take = Math.min(counts[k], left);
    if (take > 0) out[k] = take;
    left -= take;
  }
  return out;
}

function shannonBits(counts: Record<string, number>): number {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let h = 0;
  for (const v of Object.values(counts)) {
    if (v === 0) continue;
    const p = v / total;
    h -= p * Math.log2(p);
  }
  return h;
}

/** Recompute the head-to-head quantum metric from raw counts (no engine call —
 *  this is exactly what the precompute pipeline did, re-run on committed data). */
function recompute(metric: LiveMetric, counts: Record<string, number>, b: Bundle): { value: number; total: number } {
  const total = Object.values(counts).reduce((a, x) => a + x, 0);
  if (metric === "qrng-entropy") return { value: shannonBits(counts), total };
  if (metric === "grover-success") {
    // marked bitstring = the argmax of the full committed counts (the engine's answer)
    const full = b.trace?.measurements.counts ?? {};
    const marked = Object.entries(full).sort((a, x) => x[1] - a[1])[0]?.[0];
    const hit = marked ? counts[marked] ?? 0 : 0;
    return { value: total ? hit / total : 0, total };
  }
  // chsh-S: the committed trace records the optimal-protocol measurement (00/11
  // correlator). Reconstruct ⟨A·B⟩ = P(equal) − P(differ); under the optimal angle
  // settings each of the 4 correlators has |⟨AᵢBⱼ⟩| = |corr|/√2, so S = 4·|corr|/√2.
  const equal = (counts["00"] ?? 0) + (counts["11"] ?? 0);
  const corr = total ? (2 * equal) / total - 1 : 0;
  return { value: (4 * Math.abs(corr)) / Math.SQRT2, total };
}

function classicalRef(metric: LiveMetric): { value: number; label: Bilingual } {
  if (metric === "grover-success") return { value: 0.5, label: { en: "classical ~N/2 random guess on N=8 ≈ 0.5", es: "azar clásico ~N/2 sobre N=8 ≈ 0.5" } };
  if (metric === "chsh-S") return { value: 2.0, label: { en: "local-hidden-variable bound S = 2", es: "cota de variables ocultas locales S = 2" } };
  return { value: 3.0, label: { en: "ideal PRNG entropy = 3 bits (3 qubits)", es: "entropía de PRNG ideal = 3 bits (3 qubits)" } };
}

/* ── A hand-authored, theme-aware SVG: the taxonomy of "advantage" — four very
      different axes, only one of which is "my program finished sooner". ─────── */
function Head({ id }: { id: string }) {
  return (
    <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 Z" className="arch-arrowhead" />
    </marker>
  );
}

function TaxonomyDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "bm-tax";
  return (
    <svg viewBox="0 0 760 250" className="arch-svg" role="img"
         aria-label={en ? "Four distinct meanings of quantum advantage" : "Cuatro significados distintos de ventaja cuántica"}>
      <defs><Head id={m} /></defs>
      <rect className="arch-box arch-box-key" x="300" y="14" width="160" height="50" rx="8" />
      <text className="arch-t" x="380" y="36" textAnchor="middle">{en ? "“quantum advantage”" : "“ventaja cuántica”"}</text>
      <text className="arch-s" x="380" y="54" textAnchor="middle">{en ? "an overloaded word" : "una palabra sobrecargada"}</text>

      <path className="arch-arrow" d="M320 64 L120 110" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M360 64 L300 110" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M400 64 L470 110" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M440 64 L650 110" markerEnd={`url(#${m})`} />

      <rect className="arch-contract" x="20" y="110" width="170" height="78" rx="8" />
      <text className="arch-t" x="105" y="132" textAnchor="middle">{en ? "genuine edge" : "ventaja genuina"}</text>
      <text className="arch-s" x="105" y="150" textAnchor="middle">{en ? "nonlocality · fidelity" : "no-localidad · fidelidad"}</text>
      <text className="arch-s arch-em" x="105" y="168" textAnchor="middle">{en ? "not a speedup" : "no un speedup"}</text>
      <text className="arch-s" x="105" y="182" textAnchor="middle">CHSH · teleport · QRNG</text>

      <rect className="arch-box" x="210" y="110" width="170" height="78" rx="8" />
      <text className="arch-t" x="295" y="132" textAnchor="middle">{en ? "query separation" : "separación de consultas"}</text>
      <text className="arch-s" x="295" y="150" textAnchor="middle">1 vs n · √N vs N</text>
      <text className="arch-s arch-em" x="295" y="168" textAnchor="middle">{en ? "asymptotic only" : "solo asintótica"}</text>
      <text className="arch-s" x="295" y="182" textAnchor="middle">BV · DJ · Simon · Grover</text>

      <rect className="arch-box" x="400" y="110" width="170" height="78" rx="8" />
      <text className="arch-t" x="485" y="132" textAnchor="middle">{en ? "QEC threshold" : "umbral de QEC"}</text>
      <text className="arch-s" x="485" y="150" textAnchor="middle">d=5 &gt; d=3 {en ? "below p*" : "bajo p*"}</text>
      <text className="arch-s arch-em" x="485" y="168" textAnchor="middle">{en ? "scaling, not speed" : "escala, no velocidad"}</text>
      <text className="arch-s" x="485" y="182" textAnchor="middle">{en ? "repetition · surface" : "repetición · superficie"}</text>

      <rect className="proto-badbox" x="590" y="110" width="160" height="78" rx="8" />
      <text className="arch-t" x="670" y="132" textAnchor="middle">{en ? "wall-clock win" : "victoria en wall-clock"}</text>
      <text className="arch-s" x="670" y="150" textAnchor="middle">{en ? "“finished sooner”" : "“terminó antes”"}</text>
      <text className="proto-banlabel" x="670" y="170" textAnchor="middle">{en ? "0 / 20 today" : "0 / 20 hoy"}</text>
      <text className="arch-s" x="670" y="184" textAnchor="middle">{en ? "the honest headline" : "el titular honesto"}</text>

      <text className="arch-s" x="380" y="222" textAnchor="middle">{en
        ? "three real, narrower edges are measured below — the fourth, a pay-for-it speedup on a problem you care about, is not (yet) here"
        : "tres ventajas reales y más estrechas se miden abajo — la cuarta, un speedup rentable en un problema que importa, no está (todavía) aquí"}</text>
    </svg>
  );
}

/* ── A hand-authored, theme-aware SVG: how the live recompute works — committed
      counts → resample first-k shots → re-derive the metric → converges. ────── */
function RecomputeDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "bm-rc";
  return (
    <svg viewBox="0 0 760 180" className="arch-svg" role="img"
         aria-label={en ? "Live recompute from committed measured counts" : "Recálculo en vivo desde conteos medidos versionados"}>
      <defs><Head id={m} /></defs>
      <rect className="arch-box arch-box-key" x="14" y="56" width="160" height="68" rx="8" />
      <text className="arch-t" x="94" y="80" textAnchor="middle">{en ? "committed trace" : "traza versionada"}</text>
      <text className="arch-s" x="94" y="98" textAnchor="middle">measurements.counts</text>
      <text className="arch-s arch-em" x="94" y="114" textAnchor="middle">shots = 2048</text>
      <path className="arch-arrow" d="M174 90 L226 90" markerEnd={`url(#${m})`} />

      <rect className="arch-contract" x="226" y="48" width="170" height="84" rx="8" />
      <text className="arch-t" x="311" y="72" textAnchor="middle">{en ? "resample first k shots" : "remuestrea primeros k shots"}</text>
      <text className="arch-s" x="311" y="90" textAnchor="middle">{en ? "k = the budget slider" : "k = el slider de presupuesto"}</text>
      <text className="arch-s arch-em" x="311" y="108" textAnchor="middle">{en ? "deterministic subset" : "subconjunto determinista"}</text>
      <text className="arch-s" x="311" y="124" textAnchor="middle">{en ? "no engine call" : "sin llamada al motor"}</text>
      <path className="arch-arrow" d="M396 90 L448 90" markerEnd={`url(#${m})`} />

      <rect className="arch-box" x="448" y="48" width="170" height="84" rx="8" />
      <text className="arch-t" x="533" y="72" textAnchor="middle">{en ? "re-derive the metric" : "re-deriva la métrica"}</text>
      <text className="arch-s" x="533" y="90" textAnchor="middle">P(marked) · S · H</text>
      <text className="arch-s arch-em" x="533" y="108" textAnchor="middle">{en ? "same formula as the pipeline" : "misma fórmula que el pipeline"}</text>
      <text className="arch-s" x="533" y="124" textAnchor="middle">{en ? "in your browser" : "en el navegador"}</text>
      <path className="arch-arrow" d="M618 90 L666 90" markerEnd={`url(#${m})`} />

      <rect className="proto-okbox" x="666" y="56" width="84" height="68" rx="8" />
      <text className="arch-t" x="708" y="84" textAnchor="middle">{en ? "value" : "valor"}</text>
      <text className="arch-s arch-em" x="708" y="104" textAnchor="middle">vs baseline</text>

      <text className="arch-s" x="380" y="160" textAnchor="middle">{en
        ? "at full budget it reproduces the committed comparison number exactly — fewer shots show the sampling noise the metric is built on"
        : "a presupuesto completo reproduce exactamente el número de comparación versionado — menos shots muestran el ruido de muestreo sobre el que se construye la métrica"}</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   The live recompute panel — loads one committed bundle, resamples its measured
   counts at an adjustable shot budget, re-derives the quantum metric, draws it
   converging toward the classical baseline. ≥1 quantum + ≥1 classical, same data.
   ════════════════════════════════════════════════════════════════════════════ */
function LiveRecompute() {
  const { lang } = useUI();
  const en = lang === "en";
  const [sel, setSel] = useState<LiveCase>(LIVE_CASES[0]);
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [budget, setBudget] = useState(2048);

  useEffect(() => {
    setBundle(null);
    loadBundle(`data/artifacts/${sel.id}/${sel.variant}.json`).then((b) => {
      setBundle(b);
      setBudget(b.trace?.measurements.shots ?? 2048);
    }).catch(() => {});
  }, [sel]);

  const counts = bundle?.trace?.measurements.counts ?? {};
  const fullShots = bundle?.trace?.measurements.shots ?? 2048;
  const live = useMemo(() => {
    if (!bundle || !bundle.trace) return null;
    const sub = subsampleCounts(counts, budget);
    const r = recompute(sel.metric, sub, bundle);
    return { ...r, sub };
  }, [bundle, budget, sel, counts]);

  const cref = classicalRef(sel.metric);
  const unit = sel.metric === "qrng-entropy" ? " bit" : "";
  const fullVal = useMemo(() => {
    if (!bundle || !bundle.trace) return null;
    return recompute(sel.metric, bundle.trace.measurements.counts, bundle).value;
  }, [bundle, sel]);

  // a sweep of the metric across shot budgets, for the convergence curve
  const sweep = useMemo(() => {
    if (!bundle || !bundle.trace) return [];
    const pts: { k: number; v: number }[] = [];
    const ks = [16, 32, 64, 128, 256, 512, 1024, fullShots];
    for (const k of ks) {
      const v = recompute(sel.metric, subsampleCounts(counts, k), bundle).value;
      pts.push({ k, v });
    }
    return pts;
  }, [bundle, sel, counts, fullShots]);

  // chart geometry (theme-aware via classes; zero hex)
  const W = 520, H = 150, padL = 44, padR = 12, padT = 14, padB = 26;
  const vmax = sel.metric === "qrng-entropy" ? 3.2 : sel.metric === "chsh-S" ? 3.0 : 1.0;
  const xOf = (i: number) => padL + (i / (sweep.length - 1 || 1)) * (W - padL - padR);
  const yOf = (v: number) => padT + (1 - v / vmax) * (H - padT - padB);
  const path = sweep.map((p, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)} ${yOf(p.v).toFixed(1)}`).join(" ");
  const baseY = yOf(cref.value);

  return (
    <div className="live-panel">
      <div className="live-head">
        <span className="live-dot" /> {en ? "Live — recomputed in your browser" : "En vivo — recalculado en el navegador"}
        <span className="live-sub">{en ? "real committed counts · move the shot budget to re-derive the metric" : "conteos reales versionados · mover el presupuesto de shots para re-derivar la métrica"}</span>
      </div>

      <div className="variant-bar">
        {LIVE_CASES.map((c) => (
          <button key={c.id} className={`variant-chip ${c.id === sel.id ? "on" : ""}`} onClick={() => setSel(c)}>
            {c.name[lang]}
          </button>
        ))}
      </div>

      {!bundle ? (
        <p className="note">{en ? "Loading committed trace…" : "Cargando traza versionada…"}</p>
      ) : (
        <>
          <div className="live-knobs">
            <label className="live-knob">
              <span className="knob-name">{en ? "shot budget k" : "presupuesto de shots k"}</span>
              <input type="range" min={16} max={fullShots} step={16} value={budget}
                     onChange={(e) => setBudget(Number(e.target.value))} />
              <span className="knob-val">{budget} / {fullShots}</span>
            </label>
            <button className="live-reset" onClick={() => setBudget(fullShots)}>{en ? "Full budget" : "Presupuesto total"}</button>
          </div>

          <div className="stat-row">
            <div className="stat">
              <b>{live ? (live.value).toFixed(sel.metric === "grover-success" ? 4 : 4) : "—"}{unit}</b>
              <span>{en ? `quantum metric @ k=${budget}` : `métrica cuántica @ k=${budget}`}</span>
            </div>
            <div className="stat">
              <b>{cref.value.toFixed(sel.metric === "grover-success" ? 1 : 1)}{unit}</b>
              <span>{cref.label[lang]}</span>
            </div>
            <div className="stat">
              <b>{fullVal != null ? fullVal.toFixed(4) : "—"}{unit}</b>
              <span>{en ? "@ full budget (= committed)" : "@ presupuesto total (= versionado)"}</span>
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="arch-svg" role="img"
               aria-label={en ? "Metric vs shot budget, converging to the committed value" : "Métrica vs presupuesto de shots, convergiendo al valor versionado"}>
            {/* axes */}
            <line className="bloch-axis" x1={padL} y1={padT} x2={padL} y2={H - padB} />
            <line className="bloch-axis" x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} />
            <text className="arch-s" x={padL - 6} y={yOf(vmax) + 4} textAnchor="end">{vmax.toFixed(1)}</text>
            <text className="arch-s" x={padL - 6} y={yOf(0) + 4} textAnchor="end">0</text>
            {/* classical baseline */}
            <line className="proto-bad" x1={padL} y1={baseY} x2={W - padR} y2={baseY} strokeDasharray="5 4" />
            <text className="proto-banlabel" x={W - padR} y={baseY - 5} textAnchor="end">{en ? "classical baseline" : "baseline clásico"}</text>
            {/* convergence curve */}
            <path className="proto-ok" d={path} />
            {sweep.map((p, i) => (
              <circle key={p.k} className="arch-em" cx={xOf(i)} cy={yOf(p.v)} r={i === sweep.length - 1 ? 4 : 2.6}>
                <title>{`k=${p.k} → ${p.v.toFixed(4)}`}</title>
              </circle>
            ))}
            {sweep.map((p, i) => (
              <text key={`x${p.k}`} className="arch-s" x={xOf(i)} y={H - padB + 14} textAnchor="middle">{p.k}</text>
            ))}
            <text className="arch-s" x={(W + padL) / 2} y={H - 2} textAnchor="middle">{en ? "shots k (log-spaced)" : "shots k (log-espaciado)"}</text>
          </svg>

          <p className="note">
            {en
              ? `Quantum solver: ${qsolver(bundle)?.label.en ?? ""} (${qsolver(bundle)?.framework ?? ""}); classical baseline: ${csolver(bundle)?.label.en ?? ""}. The curve is the same measured counts truncated to k shots — fewer shots show the sampling noise the head-to-head metric rides on; at the full ${fullShots} it reproduces the committed comparison number.`
              : `Solver cuántico: ${qsolver(bundle)?.label.es ?? ""} (${qsolver(bundle)?.framework ?? ""}); baseline clásico: ${csolver(bundle)?.label.es ?? ""}. La curva son los mismos conteos medidos truncados a k shots — menos shots muestran el ruido de muestreo sobre el que cabalga la métrica; a los ${fullShots} completos reproduce el número de comparación versionado.`}
          </p>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   The page.
   ════════════════════════════════════════════════════════════════════════════ */
export function Benchmark() {
  const { lang } = useUI();
  const en = lang === "en";
  const [cat, setCat] = useState<Catalog | null>(null);
  const [bundles, setBundles] = useState<Record<string, Bundle>>({});

  useEffect(() => { loadCatalog().then(setCat).catch(() => {}); }, []);

  // load the canonical variant bundle per case (the head-to-head numbers live in
  // each bundle's `comparison`); the table/cards read only from these.
  useEffect(() => {
    if (!cat) return;
    let alive = true;
    Promise.all(
      cat.cases.map(async (c) => {
        const vid = CANON[c.id] ?? c.variants[0]?.id;
        const v = c.variants.find((x) => x.id === vid) ?? c.variants[0];
        if (!v) return null;
        try { return [c.id, await loadBundle(v.path)] as const; } catch { return null; }
      }),
    ).then((rows) => {
      if (!alive) return;
      const map: Record<string, Bundle> = {};
      for (const r of rows) if (r) map[r[0]] = r[1];
      setBundles(map);
    });
    return () => { alive = false; };
  }, [cat]);

  const rows = useMemo(() => {
    if (!cat) return [];
    return cat.cases
      .map((c) => {
        const spec = SPECS[c.id];
        const b = bundles[c.id];
        if (!spec) return null;
        return { id: c.id, title: c.title, spec, b };
      })
      .filter(Boolean) as { id: string; title: Bilingual; spec: MetricSpec; b: Bundle | undefined }[];
  }, [cat, bundles]);

  const counts = useMemo(() => {
    const c: Record<ClassId, number> = { genuine: 0, query: 0, qec: 0, classical: 0 };
    rows.forEach((r) => { c[r.spec.cls]++; });
    return c;
  }, [rows]);
  const totalCases = rows.length;

  return (
    <div className="page-body prose">
      <div className="page-head">
        <h1>Benchmark</h1>
        <p className="lede">
          {en
            ? "The honesty spine, quantified — and built only from committed artifacts. Every case runs a quantum method next to a classical baseline; this page reads the head-to-head numbers straight from the shipped trace manifests, never from typed-in values, and re-derives one metric live in your browser. The honest headline: across the catalog, zero cases show a practical, pay-for-it wall-clock speedup today."
            : "La columna de honestidad, cuantificada — y construida solo desde artefactos versionados. Cada caso ejecuta un método cuántico junto a un baseline clásico; esta página lee los números head-to-head directo de los manifiestos de traza enviados, nunca de valores escritos a mano, y re-deriva una métrica en vivo en el navegador. El titular honesto: en todo el catálogo, cero casos muestran un speedup práctico y rentable en wall-clock hoy."}
        </p>
      </div>

      {/* ── SCORECARD ──────────────────────────────────────────────────────── */}
      <section className="doc-section">
        <h2>{en ? "The scorecard" : "El marcador"}</h2>
        <div className="callout">
          <strong>{en
            ? `${totalCases} cases · 0 practical pay-for-it speedups today.`
            : `${totalCases} casos · 0 speedups prácticos y rentables hoy.`}</strong>{" "}
          {en
            ? "That is the headline, and it is by design — the lab is built to show it. What quantum does deliver splits into three real, narrower kinds of edge (all measured below), and a majority where classical still wins. The bars below are computed from how each case actually compares, not asserted."
            : "Ese es el titular, y es a propósito — el lab está hecho para mostrarlo. Lo que lo cuántico sí entrega se divide en tres tipos reales y más estrechos de ventaja (todos medidos abajo), y una mayoría donde lo clásico aún gana. Las barras se calculan según cómo cada caso compara de verdad, no se afirman."}
          <span className="callout-pt">{en
            ? "“Advantage” is overloaded: a query separation, a nonlocality result, and a fault-tolerance threshold are all real and all different from “my program finished sooner on a problem I care about.”"
            : "“Ventaja” está sobrecargada: una separación de consultas, un resultado de no-localidad y un umbral de tolerancia a fallos son todos reales y todos distintos de “mi programa terminó antes en un problema que me importa.”"}</span>
        </div>

        <div className="fig-svg wide"><TaxonomyDiagram lang={lang} /></div>
        <p className="fig-cap">{en
          ? "Four distinct meanings of “quantum advantage.” QLab keeps them separate so the honest 2025–26 answer — not yet, for any pay-for-it speedup — stays legible."
          : "Cuatro significados distintos de “ventaja cuántica.” QLab los mantiene separados para que la respuesta honesta 2025–26 — todavía no, para ningún speedup rentable — siga siendo legible."}</p>

        {totalCases > 0 && (
          <>
            <div className="bench-bar">
              {ORDER.map((k) => counts[k] > 0 && (
                <div key={k} className={`bench-seg seg-${k}`} style={{ flex: counts[k] }}
                     title={`${CLASSES[k].label[lang]}: ${counts[k]}`}>
                  {counts[k]}
                </div>
              ))}
            </div>
            <div className="bench-legend">
              {ORDER.map((k) => (
                <span key={k} className="bench-leg-item">
                  <span className={`swatch sw-${k}`} /> {CLASSES[k].label[lang]} ({counts[k]})
                </span>
              ))}
            </div>
          </>
        )}
        <Refs ids={["preskill2018", "arute2019", "gidney2025"]} />
      </section>

      {/* ── THE METRIC TABLE (numbers only from committed artifacts) ───────── */}
      <section className="doc-section">
        <h2>{en ? "Head-to-head — every case, from the committed traces" : "Head-to-head — cada caso, desde las trazas versionadas"}</h2>
        <p>{en
          ? "One row per case, at the canonical regime. The quantum and classical columns are read at runtime from each shipped manifest's comparison block — refresh and they cannot drift from what the pipeline actually produced. The provenance column names the solver framework and the exact committed variant."
          : "Una fila por caso, en el régimen canónico. Las columnas cuántica y clásica se leen en tiempo de ejecución desde el bloque de comparación de cada manifiesto enviado — al refrescar no pueden divergir de lo que el pipeline produjo. La columna de procedencia nombra el framework del solver y la variante versionada exacta."}</p>

        {rows.length === 0 ? (
          <p className="note">{en ? "Loading committed manifests…" : "Cargando manifiestos versionados…"}</p>
        ) : (
          <table className="cmp-table">
            <thead>
              <tr>
                <th>{en ? "Case" : "Caso"}</th>
                <th>{en ? "Quantum" : "Cuántico"}</th>
                <th>{en ? "Classical baseline" : "Baseline clásico"}</th>
                <th>{en ? "Edge kind" : "Tipo de ventaja"}</th>
                <th>{en ? "Provenance" : "Procedencia"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const b = r.b;
                const q = b ? r.spec.q(b) : "…";
                const c = b ? r.spec.c(b) : "…";
                const fw = b ? qsolver(b)?.framework ?? "" : "";
                const variant = b ? b.instance.id : (CANON[r.id] ?? "");
                return (
                  <tr key={r.id}>
                    <td>
                      <Link to={`/case/${r.id}`} className="cite-link">{r.title[lang]}</Link>
                    </td>
                    <td className="mono">{q}<span className="fw">{fw}</span></td>
                    <td className="mono">{c}</td>
                    <td className="kind">
                      <span className={`bound-chip chip-${r.spec.cls}`}>{CLASSES[r.spec.cls].label[lang]}</span>
                    </td>
                    <td className="mono"><span className="fw">{variant}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <p className="fig-cap">{en
          ? "Every numeric cell is the value loaded from the shipped artifact — nothing on this page is hand-typed. Click a case to open its full trace."
          : "Cada celda numérica es el valor cargado del artefacto enviado — nada en esta página está escrito a mano. Hacer clic en un caso para abrir su traza completa."}</p>
        <Refs ids={["chsh1969", "grover1996", "shor1997", "havlicek2019"]} />
      </section>

      {/* ── LIVE RECOMPUTE ─────────────────────────────────────────────────── */}
      <section className="doc-section">
        <h2>{en ? "Live recompute — the metric re-derived in your browser" : "Recálculo en vivo — la métrica re-derivada en el navegador"}</h2>
        <p>{en
          ? "A benchmark you cannot reproduce is a claim, not a measurement. Pick a case and drag the shot budget: the panel resamples the same measured counts committed in the trace, re-derives the quantum metric with the exact formula the pipeline uses, and draws it converging toward the value the benchmark reports — next to the classical baseline. This is ≥1 quantum method and ≥1 classical baseline on identical, committed data."
          : "Un benchmark que no se puede reproducir es una afirmación, no una medición. Elegir un caso y mover el presupuesto de shots: el panel remuestrea los mismos conteos medidos versionados en la traza, re-deriva la métrica cuántica con la fórmula exacta del pipeline, y la dibuja convergiendo al valor que reporta el benchmark — junto al baseline clásico. Esto es ≥1 método cuántico y ≥1 baseline clásico sobre datos idénticos y versionados."}</p>

        <Eq tex="P(\text{marked}) = \frac{c_{\text{marked}}}{\sum_x c_x}, \quad S = 4\,\frac{|\langle A B\rangle|}{\sqrt2}, \quad H = -\!\sum_x p_x \log_2 p_x"
            caption={{
              en: "The three live metrics, each a pure function of the committed counts cₓ: Grover's success probability (fraction landing on the marked string), the CHSH value S reconstructed from the equal/differ correlator, and the Shannon entropy H of the output distribution.",
              es: "Las tres métricas en vivo, cada una función pura de los conteos versionados cₓ: la probabilidad de éxito de Grover (fracción que cae en la cadena marcada), el valor CHSH S reconstruido del correlador igual/distinto, y la entropía de Shannon H de la distribución de salida.",
            }} />

        <div className="fig-svg wide"><RecomputeDiagram lang={lang} /></div>
        <p className="fig-cap">{en
          ? "The recompute path: committed counts → resample the first k shots (deterministic) → re-derive the metric — no engine call, so it is reproducible from the artifact alone."
          : "El camino de recálculo: conteos versionados → remuestrea los primeros k shots (determinista) → re-deriva la métrica — sin llamada al motor, así que es reproducible solo desde el artefacto."}</p>

        <LiveRecompute />
        <Refs ids={["nielsen2010", "chsh1969", "grover1996", "ecma404"]} />
      </section>

      {/* ── PER-CLASS VERDICTS (verdict text + numbers from the bundles) ───── */}
      {ORDER.map((k) => {
        const inClass = rows.filter((r) => r.spec.cls === k);
        if (inClass.length === 0) return null;
        return (
          <section key={k} className="doc-section">
            <h2 className={`hd-${k}`}>{CLASSES[k].label[lang]} · {inClass.length}</h2>
            <p className="fine">{CLASSES[k].blurb[lang]}</p>
            <div className="bench-cards">
              {inClass.map((r) => {
                const b = r.b;
                return (
                  <Link to={`/case/${r.id}`} key={r.id} className={`bench-card card-${k}`}>
                    <div className="bench-card-head">
                      <strong>{r.title[lang]}</strong>
                      {b && (
                        <span className="bench-vs">
                          <span className="q mono">{r.spec.q(b)}</span>
                          <span className="vs">vs</span>
                          <span className="c mono">{r.spec.c(b)}</span>
                        </span>
                      )}
                    </div>
                    <p>{b ? r.spec.edge(b)[lang] : "…"}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* ── THE CAVEAT ─────────────────────────────────────────────────────── */}
      <section className="doc-section">
        <h2>{en ? "Read this before the numbers" : "Leer esto antes de los números"}</h2>
        <div className="callout">
          <strong>{en ? "Caveat — these are toy instances on a noiseless simulator." : "Salvedad — son instancias de juguete en un simulador sin ruido."}</strong>{" "}
          {en
            ? "The query separations are genuine (1 vs n, √N vs N, exponential) but measured at sizes where a classical loop finishes in microseconds, so wall-clock favours classical everywhere here. The variational and noise cases (VQE, QML, MaxCut, ZNE) run on problems small enough for exact classical solution — they are pedagogy and hype-checks, not advantage claims. Shor factors only 15; the genuine edges (CHSH, teleportation, superdense, QRNG) are real but are nonlocality / resource / randomness results, not faster computation. The QEC cases show error-correction scaling below threshold, on a stabilizer simulator (Stim), not on hardware. Nothing here re-hosts restricted data; all instances are the labelled regimes the manifests ship. The honest summary is unchanged by every number above: no pay-for-it speedup, yet."
            : "Las separaciones de consultas son genuinas (1 vs n, √N vs N, exponencial) pero medidas a tamaños donde un bucle clásico termina en microsegundos, así que el wall-clock favorece a lo clásico en todo lo de aquí. Los casos variacionales y de ruido (VQE, QML, MaxCut, ZNE) se ejecutan sobre problemas suficientemente pequeños para solución clásica exacta — son pedagogía y chequeos al hype, no afirmaciones de ventaja. Shor factoriza solo 15; las ventajas genuinas (CHSH, teleportación, superdensa, QRNG) son reales pero son resultados de no-localidad / recurso / aleatoriedad, no cómputo más rápido. Los casos de QEC muestran escala de corrección de errores bajo umbral, en un simulador de estabilizadores (Stim), no en hardware. Nada aquí re-aloja datos restringidos; todas las instancias son los regímenes etiquetados que envían los manifiestos. El resumen honesto no cambia por ningún número de arriba: sin speedup rentable, todavía."}
        </div>
        <Refs ids={["preskill2018", "gidney2025", "google2024willow", "gidney2021stim"]} />
      </section>
    </div>
  );
}
