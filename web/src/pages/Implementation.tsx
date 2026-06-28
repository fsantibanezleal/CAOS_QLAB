import { type ReactNode } from "react";
import { Eq, type TabDef, Tabs } from "../components/Tabs";
import { Refs } from "../lib/citations";
import { useUI } from "../lib/ui";

type Lang = "en" | "es";

/* ──────────────────────────────────────────────────────────────────────────
   The honest where-it-works / where-it-fails callout — exactly one per engine
   tab (ADR-0017 §2). Two theme-aware columns, no hex.
   ──────────────────────────────────────────────────────────────────────── */
function WhereWorks({
  okHead, failHead, ok, fail,
}: { okHead: string; failHead: string; ok: ReactNode; fail: ReactNode }) {
  return (
    <div className="wf-grid">
      <div className="wf-card ok"><h5>{okHead}</h5><ul>{ok}</ul></div>
      <div className="wf-card fail"><h5>{failHead}</h5><ul>{fail}</ul></div>
    </div>
  );
}

/* The live/precompute boundary, stated as a chip pair per tab. */
function Boundary({ en, runs, live }: { en: boolean; runs: ReactNode; live: ReactNode }) {
  return (
    <div className="bound-row">
      <span className="bound-chip"><b>{en ? "runs in" : "corre en"}</b> {runs}</span>
      <span className="bound-chip"><b>{en ? "boundary" : "frontera"}</b> {live}</span>
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
   to a CSS var (zero hex); labels are real build flows, not filler.
   ════════════════════════════════════════════════════════════════════════ */

/** The full build architecture: offline-heavy engines → the committed contract
 *  (trace + manifest) → a thin live TS engine → static SPA on a CDN. The single
 *  artifact in the middle is what makes the deploy static and the render uniform. */
function ArchitectureDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "im-arch";
  return (
    <svg viewBox="0 0 760 380" className="arch-svg" role="img"
         aria-label={en ? "QLab build architecture: offline engines to committed contract to static SPA"
                        : "Arquitectura: motores offline al contrato commiteado a la SPA estática"}>
      <defs><Head id={m} /></defs>

      {/* ── OFFLINE column (heavy) ── */}
      <text className="arch-t" x="14" y="20">{en ? "OFFLINE — local .venv (heavy)" : "OFFLINE — .venv local (pesado)"}</text>
      <rect className="arch-box arch-box-key" x="14" y="32" width="176" height="40" rx="7" />
      <text className="arch-s" x="102" y="56" textAnchor="middle">Qiskit + Aer</text>
      <rect className="arch-box arch-box-key" x="14" y="78" width="176" height="40" rx="7" />
      <text className="arch-s" x="102" y="102" textAnchor="middle">PennyLane (autograd)</text>
      <rect className="arch-box arch-box-key" x="14" y="124" width="176" height="40" rx="7" />
      <text className="arch-s" x="102" y="148" textAnchor="middle">Cirq · Stim + PyMatching</text>
      <rect className="arch-box arch-box-key" x="14" y="170" width="176" height="40" rx="7" />
      <text className="arch-s" x="102" y="194" textAnchor="middle">NumPy / sklearn (classical)</text>

      {/* pipeline (single execution path) */}
      <path className="arch-arrow" d="M190 52 L236 116" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M190 98 L236 122" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M190 144 L236 128" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M190 190 L236 134" markerEnd={`url(#${m})`} />
      <rect className="arch-box" x="236" y="96" width="118" height="64" rx="8" />
      <text className="arch-t" x="295" y="120" textAnchor="middle">pipeline</text>
      <text className="arch-s" x="295" y="138" textAnchor="middle">{en ? "1 execution path" : "1 camino"}</text>
      <text className="arch-s arch-em" x="295" y="153" textAnchor="middle">seed · shots</text>

      {/* ── the committed contract (the seam) ── */}
      <path className="arch-arrow" d="M354 128 L402 128" markerEnd={`url(#${m})`} />
      <rect className="arch-contract" x="402" y="78" width="172" height="104" rx="10" />
      <text className="arch-t" x="488" y="102" textAnchor="middle">{en ? "committed artifact" : "artefacto commiteado"}</text>
      <text className="arch-s" x="488" y="122" textAnchor="middle">qlab-trace/1</text>
      <text className="arch-s" x="488" y="138" textAnchor="middle">qlab-manifest/1</text>
      <text className="arch-s" x="488" y="154" textAnchor="middle">{en ? "JSON · no Qiskit type" : "JSON · sin tipo Qiskit"}</text>
      <text className="arch-s arch-em" x="488" y="172" textAnchor="middle">{en ? "replay = truth" : "replay = verdad"}</text>

      {/* ── thin LIVE engine (browser) feeding the same renderer ── */}
      <text className="arch-t" x="586" y="20">{en ? "IN-BROWSER (thin)" : "EN NAVEGADOR (delgado)"}</text>
      <rect className="arch-box" x="586" y="32" width="160" height="46" rx="7" />
      <text className="arch-t" x="666" y="52" textAnchor="middle">{en ? "live state-vector" : "statevector vivo"}</text>
      <text className="arch-s" x="666" y="68" textAnchor="middle">TS · ≤12 q · exact</text>

      {/* SPA */}
      <path className="arch-arrow" d="M574 130 L640 130" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M666 78 L666 112" markerEnd={`url(#${m})`} />
      <rect className="arch-spa" x="586" y="112" width="160" height="64" rx="9" />
      <text className="arch-t" x="666" y="136" textAnchor="middle">{en ? "static SPA" : "SPA estática"}</text>
      <text className="arch-s" x="666" y="154" textAnchor="middle">React · GitHub Pages</text>
      <text className="arch-s arch-em" x="666" y="170" textAnchor="middle">{en ? "one renderer, both lanes" : "un renderer, ambos carriles"}</text>

      {/* dormant hardware lane */}
      <rect className="arch-box arch-box-dim" x="236" y="210" width="338" height="40" rx="7" />
      <text className="arch-t arch-dim" x="405" y="228" textAnchor="middle">{en ? "real-hardware lane — dormant" : "carril de hardware real — inactivo"}</text>
      <text className="arch-s arch-dim" x="405" y="243" textAnchor="middle">{en ? "IBM Open / Braket / Azure · local token · same trace + ran_on badge" : "IBM Open / Braket / Azure · token local · misma traza + badge ran_on"}</text>
      <path className="arch-arrow arch-dim" d="M488 210 L488 182" markerEnd={`url(#${m})`} />

      {/* the static / CDN footer flow */}
      <rect className="arch-box arch-box-key" x="14" y="296" width="150" height="46" rx="7" />
      <text className="arch-t" x="89" y="316" textAnchor="middle">git commit</text>
      <text className="arch-s" x="89" y="332" textAnchor="middle">{en ? "trace + manifest" : "traza + manifiesto"}</text>
      <path className="arch-arrow" d="M164 319 L210 319" markerEnd={`url(#${m})`} />
      <rect className="arch-box" x="210" y="296" width="150" height="46" rx="7" />
      <text className="arch-t" x="285" y="316" textAnchor="middle">Vite build</text>
      <text className="arch-s" x="285" y="332" textAnchor="middle">{en ? "+ data overlay" : "+ overlay de datos"}</text>
      <path className="arch-arrow" d="M360 319 L406 319" markerEnd={`url(#${m})`} />
      <rect className="arch-box" x="406" y="296" width="150" height="46" rx="7" />
      <text className="arch-t" x="481" y="316" textAnchor="middle">{en ? "catalog gen" : "gen. catálogo"}</text>
      <text className="arch-s" x="481" y="332" textAnchor="middle">{en ? "from manifests" : "de manifiestos"}</text>
      <path className="arch-arrow" d="M556 319 L602 319" markerEnd={`url(#${m})`} />
      <rect className="arch-spa" x="602" y="296" width="144" height="46" rx="7" />
      <text className="arch-t" x="674" y="316" textAnchor="middle">Pages · CDN</text>
      <text className="arch-s" x="674" y="332" textAnchor="middle">{en ? "static · no backend" : "estático · sin backend"}</text>
      <text className="arch-em" x="380" y="368" textAnchor="middle">{en ? "the heavy physics is offline; the browser only replays or re-sims clean unitaries" : "la física pesada es offline; el navegador solo hace replay o re-sim de unitarios limpios"}</text>
    </svg>
  );
}

/** The trace contract: a circuit run records per-step amplitudes/Bloch/probs,
 *  rounds to 6 dp, is JSON with no Qiskit type, and is mirrored 1:1 in TS. */
function TraceDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "im-trc";
  return (
    <svg viewBox="0 0 760 230" className="arch-svg" role="img"
         aria-label={en ? "Trace contract: per-step record to JSON to TS mirror to renderers"
                        : "Contrato de traza: registro por paso a JSON a espejo TS a renderers"}>
      <defs><Head id={m} /></defs>
      <rect className="arch-box arch-box-key" x="12" y="84" width="150" height="56" rx="8" />
      <text className="arch-t" x="87" y="106" textAnchor="middle">{en ? "circuit run" : "corrida"}</text>
      <text className="arch-s" x="87" y="124" textAnchor="middle">f(params, seed)</text>
      <path className="arch-arrow" d="M162 112 L214 112" markerEnd={`url(#${m})`} />
      <rect className="arch-box" x="214" y="58" width="178" height="108" rx="8" />
      <text className="arch-t" x="303" y="80" textAnchor="middle">{en ? "per step" : "por paso"}</text>
      <text className="arch-s" x="303" y="100" textAnchor="middle">statevector (2ⁿ ∈ ℂ)</text>
      <text className="arch-s" x="303" y="116" textAnchor="middle">Bloch ⟨X⟩⟨Y⟩⟨Z⟩ / qubit</text>
      <text className="arch-s" x="303" y="132" textAnchor="middle">{en ? "basis probabilities" : "probabilidades base"}</text>
      <text className="arch-s arch-em" x="303" y="150" textAnchor="middle">{en ? "+ final histogram" : "+ histograma final"}</text>
      <path className="arch-arrow" d="M392 112 L444 112" markerEnd={`url(#${m})`} />
      <rect className="arch-contract" x="444" y="74" width="158" height="76" rx="8" />
      <text className="arch-t" x="523" y="98" textAnchor="middle">qlab-trace/1</text>
      <text className="arch-s" x="523" y="116" textAnchor="middle">{en ? "JSON · 6-dp round" : "JSON · 6 dec."}</text>
      <text className="arch-s arch-em" x="523" y="134" textAnchor="middle">{en ? "TS mirror (ADR-0057)" : "espejo TS (ADR-0057)"}</text>
      <path className="arch-arrow" d="M602 112 L654 112" markerEnd={`url(#${m})`} />
      <rect className="arch-spa" x="654" y="84" width="96" height="56" rx="8" />
      <text className="arch-t" x="702" y="106" textAnchor="middle">{en ? "renderers" : "renderers"}</text>
      <text className="arch-s" x="702" y="124" textAnchor="middle">{en ? "animate it" : "lo animan"}</text>
      <text className="arch-em" x="380" y="206" textAnchor="middle">{en ? "no Qiskit type crosses the seam — the browser never imports a Python framework" : "ningún tipo de Qiskit cruza la costura — el navegador nunca importa un framework de Python"}</text>
    </svg>
  );
}

/** The measured gate: classify_lane reads four measurements; ALL pass → live,
 *  ANY fails → precompute. The verdict + numbers are written to the manifest. */
function GateDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "im-gate";
  return (
    <svg viewBox="0 0 760 250" className="arch-svg" role="img"
         aria-label={en ? "Measured live vs precompute gate" : "Compuerta medida vivo vs precómputo"}>
      <defs><Head id={m} /></defs>
      <rect className="arch-box arch-box-key" x="232" y="14" width="296" height="92" rx="9" />
      <text className="arch-t" x="380" y="36" textAnchor="middle">classify_lane — {en ? "all four hold?" : "¿las cuatro?"}</text>
      <text className="arch-s" x="380" y="56" textAnchor="middle">qubits ≤ 12 · unitary-only</text>
      <text className="arch-s" x="380" y="72" textAnchor="middle">run_ms ≤ 1500 · trace ≤ 1 MB</text>
      <text className="arch-s arch-em" x="380" y="92" textAnchor="middle">{en ? "measured, not guessed" : "medido, no adivinado"}</text>
      <path className="arch-arrow" d="M300 106 L196 156" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M460 106 L564 156" markerEnd={`url(#${m})`} />
      <text className="arch-s arch-em" x="232" y="134" textAnchor="middle">{en ? "ALL pass" : "TODAS"}</text>
      <text className="arch-s" x="528" y="134" textAnchor="middle">{en ? "ANY fails" : "FALLA una"}</text>
      <rect className="arch-box arch-box-key" x="86" y="156" width="218" height="56" rx="8" />
      <text className="arch-t arch-em" x="195" y="180" textAnchor="middle">LIVE</text>
      <text className="arch-s" x="195" y="198" textAnchor="middle">{en ? "in-browser re-sim (TS)" : "re-sim en navegador (TS)"}</text>
      <rect className="arch-box" x="456" y="156" width="218" height="56" rx="8" />
      <text className="arch-t" x="565" y="180" textAnchor="middle">PRECOMPUTE</text>
      <text className="arch-s" x="565" y="198" textAnchor="middle">{en ? "committed trace, replayed" : "traza commiteada, replay"}</text>
      <text className="arch-em" x="380" y="238" textAnchor="middle">{en ? "the verdict + numbers are written to the manifest; CI fails a mislabeled case" : "el veredicto + números se escriben al manifiesto; CI rompe un caso mal etiquetado"}</text>
    </svg>
  );
}

/** The Problem × Solver adapter seam: a Problem declares what; thin Solvers
 *  each wrap ONE framework; the registry self-attaches them; one pipeline runs. */
function EngineSeamDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "im-seam";
  return (
    <svg viewBox="0 0 760 240" className="arch-svg" role="img"
         aria-label={en ? "Problem x Solver adapter seam" : "Costura de adaptadores Problem x Solver"}>
      <defs><Head id={m} /></defs>
      <rect className="arch-box arch-box-key" x="12" y="22" width="180" height="52" rx="8" />
      <text className="arch-t" x="102" y="44" textAnchor="middle">Problem</text>
      <text className="arch-s" x="102" y="62" textAnchor="middle">{en ? "what to compute" : "qué computar"}</text>
      <rect className="arch-box" x="12" y="100" width="180" height="78" rx="8" />
      <text className="arch-t" x="102" y="122" textAnchor="middle">{en ? "Solver adapters" : "Adaptadores Solver"}</text>
      <text className="arch-s" x="102" y="140" textAnchor="middle">{en ? "1 framework each" : "1 framework c/u"}</text>
      <text className="arch-s" x="102" y="156" textAnchor="middle">run(...) → SolverResult</text>
      <text className="arch-s arch-em" x="102" y="172" textAnchor="middle">{en ? "guarded import" : "import protegido"}</text>
      <path className="arch-arrow" d="M192 48 L250 110" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M192 132 L250 124" markerEnd={`url(#${m})`} />
      <rect className="arch-box" x="250" y="96" width="150" height="58" rx="8" />
      <text className="arch-t" x="325" y="120" textAnchor="middle">registry</text>
      <text className="arch-s" x="325" y="138" textAnchor="middle">solvers_for(problem)</text>
      <path className="arch-arrow" d="M400 125 L456 125" markerEnd={`url(#${m})`} />
      <rect className="arch-contract" x="456" y="96" width="150" height="58" rx="8" />
      <text className="arch-t" x="531" y="120" textAnchor="middle">pipeline</text>
      <text className="arch-s" x="531" y="138" textAnchor="middle">{en ? "run all applicable" : "corre los aplicables"}</text>
      <path className="arch-arrow" d="M606 125 L654 125" markerEnd={`url(#${m})`} />
      <rect className="arch-spa" x="654" y="96" width="96" height="58" rx="8" />
      <text className="arch-t" x="702" y="120" textAnchor="middle">{en ? "bundle" : "bundle"}</text>
      <text className="arch-s" x="702" y="138" textAnchor="middle">+ manifest</text>
      <text className="arch-em" x="380" y="216" textAnchor="middle">{en ? "add a Solver + @register_solver → it appears the moment its trace is committed; zero web change"
                                                   : "agrega un Solver + @register_solver → aparece al commitear su traza; cero cambios en la web"}</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   The page.
   ════════════════════════════════════════════════════════════════════════ */
export function Implementation() {
  const { lang } = useUI();
  const en = lang === "en";
  const refLabel = en ? "References" : "Referencias";

  const tabs: TabDef[] = [
    /* ───────────────────── 1 · Architecture & determinism ───────────────── */
    {
      id: "architecture",
      label: en ? "Architecture" : "Arquitectura",
      content: (
        <div className="method-body">
          <div className="arch-banner">
            <span className="seal">{en ? "deterministic" : "determinista"}</span>
            <span>{en
              ? "Every run is a pure function of (params, seed). The only stochastic step is measurement sampling, routed through one seeded NumPy bit-generator (PCG64), so committed counts reproduce byte-for-byte; statevector evolution is exact. Re-running the offline pipeline reproduces the committed trace exactly."
              : "Cada corrida es función pura de (params, seed). El único paso estocástico es el muestreo de medición, por un único bit-generator NumPy con semilla (PCG64), así que los conteos commiteados reproducen byte a byte; la evolución del statevector es exacta. Re-correr el pipeline offline reproduce la traza commiteada exactamente."}</span>
          </div>
          <p>{en
            ? "QLab is built around one idea: the heavy quantum physics runs OFFLINE in a local Python environment, and the published web app is a thin static client. The four real simulation engines (Qiskit+Aer, PennyLane, Cirq/Stim, and the classical baselines in NumPy/scikit-learn) are funneled through a single pipeline that emits a uniform committed artifact — a trace plus a manifest. That artifact is the only thing the browser depends on; it carries no Qiskit type, so the web never imports a Python framework. A small, hand-written state-vector simulator in TypeScript re-runs the clean unitary cases live, sharing the exact same trace shape so one renderer animates both lanes."
            : "QLab se construye sobre una idea: la física cuántica pesada corre OFFLINE en un entorno Python local, y la web publicada es un cliente estático delgado. Los cuatro motores reales de simulación (Qiskit+Aer, PennyLane, Cirq/Stim y los baselines clásicos en NumPy/scikit-learn) pasan por un único pipeline que emite un artefacto uniforme commiteado — una traza más un manifiesto. Ese artefacto es lo único de lo que depende el navegador; no lleva ningún tipo de Qiskit, así que la web nunca importa un framework de Python. Un pequeño simulador de statevector escrito a mano en TypeScript re-corre en vivo los casos unitarios limpios, compartiendo exactamente la misma forma de traza, así que un solo renderer anima ambos carriles."}</p>
          <div className="fig-svg wide"><ArchitectureDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "Offline-heavy engines → one pipeline → the committed trace + manifest (the seam) → a thin live TS engine and a static SPA on a CDN. The real-hardware lane attaches at the same seam but stays dormant on the published site."
              : "Motores offline pesados → un pipeline → la traza + manifiesto commiteados (la costura) → un motor TS vivo delgado y una SPA estática en CDN. El carril de hardware real se engancha en la misma costura pero queda inactivo en el sitio publicado."}</p>
          </div>
          <Eq
            tex={String.raw`\text{trace}=\mathcal{R}(\text{params},\,\text{seed}),\qquad \mathcal{R}\ \text{deterministic};\quad \text{counts}\sim\mathrm{Multinomial}\!\big(\text{shots},\,\{p_b\}\big)_{\text{seed}}`}
            caption={{
              en: "The reproducibility contract: a trace is a deterministic function of (params, seed); only the measurement histogram is sampled, from a single seeded generator, so committed counts replay exactly.",
              es: "El contrato de reproducibilidad: una traza es función determinista de (params, seed); solo el histograma de medición se muestrea, de un único generador con semilla, así que los conteos commiteados reproducen exactamente.",
            }}
          />
          <ul className="sym-list">
            <li><b>𝓡</b>{en ? "the deterministic run map (evolve statevector, record per step)" : "el mapa de corrida determinista (evoluciona statevector, registra por paso)"}</li>
            <li><b>params</b>{en ? "gates, angles, graph, shots — the full case vector" : "compuertas, ángulos, grafo, shots — el vector del caso"}</li>
            <li><b>seed</b>{en ? "the integer seeding the NumPy PCG64 bit-generator" : "el entero que siembra el bit-generator PCG64 de NumPy"}</li>
            <li><b>p_b</b>{en ? "probability of basis state b = |⟨b|ψ⟩|²" : "probabilidad del estado base b = |⟨b|ψ⟩|²"}</li>
            <li><b>shots</b>{en ? "number of measurement samples drawn" : "número de muestras de medición"}</li>
          </ul>
          <Boundary en={en}
            runs={en ? "offline pipeline + thin browser client" : "pipeline offline + cliente delgado"}
            live={en ? "the committed trace/manifest JSON" : "el JSON traza/manifiesto commiteado"} />
          <Refs ids={["nielsen2010", "jones2019quest", "knuth1997", "ecma404"]} label={refLabel} />
        </div>
      ),
    },

    /* ───────────────────── 2 · Problem × Solver engine ──────────────────── */
    {
      id: "engine",
      label: en ? "Problem × Solver engine" : "Motor Problem × Solver",
      content: (
        <div className="method-body">
          <p>{en
            ? "QLab is not a folder of one-off scripts that each run a framework their own way; it is a small engine with one execution path. A Problem declares what to compute (its bilingual identity, its variant instances, the reported metric, a live_capable hint) and imports no quantum framework. A Solver is a thin adapter that wraps exactly ONE real framework to attack a problem and returns a uniform SolverResult — the answer value, its cost, an optional replay trace, and bilingual notes. Solvers come in three paradigms: quantum-sim (Qiskit-Aer, PennyLane, Cirq/qsim), quantum-hardware (a real QPU run with provenance), and classical (the honest still-more-practical baseline: brute force, Goemans–Williamson, exact diagonalization, FFT, sklearn)."
            : "QLab no es una carpeta de scripts sueltos que cada uno corre un framework a su manera; es un motor pequeño con un solo camino de ejecución. Un Problem declara qué computar (su identidad bilingüe, sus instancias variantes, la métrica reportada, un hint live_capable) y no importa ningún framework cuántico. Un Solver es un adaptador delgado que envuelve exactamente UN framework real para atacar un problema y devuelve un SolverResult uniforme — el valor de la respuesta, su costo, una traza de replay opcional y notas bilingües. Los solvers vienen en tres paradigmas: quantum-sim (Qiskit-Aer, PennyLane, Cirq/qsim), quantum-hardware (una corrida en QPU real con procedencia) y classical (el baseline honesto aún-más-práctico: fuerza bruta, Goemans–Williamson, diagonalización exacta, FFT, sklearn)."}</p>
          <pre className="code"><code>{`@register_solver
class QiskitQAOA(Solver):
    name, framework, paradigm = "qaoa-qiskit", "qiskit", QUANTUM_SIM
    def applicable(self, problem) -> bool:
        return problem.id == "maxcut"
    def run(self, problem, instance, seed, shots) -> SolverResult:
        ...  # the ONLY method that touches Qiskit`}</code></pre>
          <p>{en
            ? "Problems and solvers self-register via decorators. The pipeline asks the registry for the solvers applicable() to a case and calls solver.run(...) with a uniform signature; it never names a framework. A complex case is attacked by many solvers at once and compared head-to-head: MaxCut on one graph runs QAOA-Qiskit + QAOA-PennyLane + brute-force + greedy in one pass, the pipeline emits all four side by side plus a verdict (exact classical optimum = 4 in 0.013 ms; QAOA reached 4 but did not win), and the two independent QAOA frameworks cross-check each other on the cut value. The adapter boundary is deliberately thin and uniform, and the web never imports a framework — it renders the generic JSON trace, so a new solver appears the moment its trace is committed, with zero frontend change."
            : "Problemas y solvers se auto-registran por decoradores. El pipeline le pide al registry los solvers applicable() a un caso y llama solver.run(...) con una firma uniforme; nunca nombra un framework. Un caso complejo es atacado por muchos solvers a la vez y comparado cara a cara: MaxCut sobre un grafo corre QAOA-Qiskit + QAOA-PennyLane + fuerza bruta + greedy en una pasada, el pipeline emite los cuatro lado a lado más un veredicto (óptimo clásico exacto = 4 en 0.013 ms; QAOA llegó a 4 pero no ganó), y los dos frameworks QAOA independientes se validan cruzadamente en el valor del corte. El borde del adaptador es deliberadamente delgado y uniforme, y la web nunca importa un framework — renderiza la traza JSON genérica, así que un nuevo solver aparece al commitear su traza, sin cambio alguno en el frontend."}</p>
          <div className="fig-svg wide"><EngineSeamDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "The adapter seam: a Problem declares what; thin Solvers each wrap one framework behind run(...) → SolverResult; the registry self-attaches the applicable ones; the single pipeline runs them all and writes the bundle + manifest."
              : "La costura de adaptadores: un Problem declara qué; los Solvers delgados envuelven un framework cada uno tras run(...) → SolverResult; el registry engancha los aplicables; el único pipeline los corre todos y escribe el bundle + manifiesto."}</p>
          </div>
          <Eq
            tex={String.raw`\text{run}:\;(\,\text{Problem},\,\text{Instance},\,\text{seed},\,\text{shots}\,)\;\longrightarrow\;\text{SolverResult}=(\text{value},\,\text{cost},\,\text{trace}?,\,\text{notes})`}
            caption={{
              en: "The uniform adapter signature: every Solver — quantum-sim, quantum-hardware, or classical — maps the same inputs to the same SolverResult shape; the pipeline never branches on framework.",
              es: "La firma uniforme del adaptador: cada Solver — quantum-sim, quantum-hardware o clásico — mapea las mismas entradas a la misma forma SolverResult; el pipeline nunca ramifica por framework.",
            }}
          />
          <ul className="sym-list">
            <li><b>Problem</b>{en ? "solver-agnostic formulation + variant instances" : "formulación agnóstica al solver + instancias variantes"}</li>
            <li><b>Instance</b>{en ? "one concrete regime (e.g. a specific graph)" : "un régimen concreto (p. ej. un grafo específico)"}</li>
            <li><b>SolverResult</b>{en ? "uniform output: value, cost, optional trace, notes" : "salida uniforme: valor, costo, traza opcional, notas"}</li>
            <li><b>paradigm</b>{en ? "quantum-sim · quantum-hardware · classical" : "quantum-sim · quantum-hardware · classical"}</li>
            <li><b>applicable()</b>{en ? "predicate that self-attaches a solver to a problem" : "predicado que engancha un solver a un problema"}</li>
            <li><b>cost</b>{en ? "wall-time + shots/queries the method spent" : "tiempo + shots/consultas que gastó el método"}</li>
          </ul>
          <table className="impl-table">
            <thead><tr><th>{en ? "To add…" : "Para agregar…"}</th><th>{en ? "You write…" : "Escribes…"}</th><th>{en ? "You touch…" : "Tocas…"}</th></tr></thead>
            <tbody>
              <tr><td>{en ? "a framework/method" : "un framework/método"}</td><td><code>Solver</code> + <code>@register_solver</code></td><td>{en ? "nothing in core/pipeline/web" : "nada en core/pipeline/web"}</td></tr>
              <tr><td>{en ? "a problem" : "un problema"}</td><td><code>Problem</code> + <code>@register_problem</code></td><td>{en ? "nothing — solvers self-attach" : "nada — los solvers se enganchan solos"}</td></tr>
              <tr><td>{en ? "a hardware backend" : "un backend de hardware"}</td><td><code>Solver</code> · <code>paradigm="quantum-hardware"</code></td><td>{en ? "nothing — same trace, ran_on badge" : "nada — misma traza, badge ran_on"}</td></tr>
            </tbody>
          </table>
          <WhereWorks
            okHead={en ? "Where it works" : "Dónde funciona"}
            failHead={en ? "Where it does not" : "Dónde no"}
            ok={<>
              <li>{en ? "additive growth: one subclass + a decorator, nothing rewired" : "crecimiento aditivo: una subclase + un decorador, sin recablear"}</li>
              <li>{en ? "cross-checks: two engines on one problem must agree" : "validación cruzada: dos motores en un problema deben coincidir"}</li>
              <li>{en ? "graceful degradation: a missing optional dep disables only that adapter" : "degradación elegante: una dependencia faltante desactiva solo ese adaptador"}</li>
            </>}
            fail={<>
              <li>{en ? "a method that cannot return a uniform SolverResult does not fit the seam" : "un método que no puede devolver un SolverResult uniforme no entra en la costura"}</li>
              <li>{en ? "stateful interactive sessions (mid-run human input) are out of scope" : "sesiones interactivas con estado (input humano a mitad) están fuera de alcance"}</li>
            </>}
          />
          <Refs ids={["nielsen2010", "farhi2014", "goemans1995", "qiskit2024"]} label={refLabel} />
        </div>
      ),
    },

    /* ───────────────────── 3 · Live state-vector engine ─────────────────── */
    {
      id: "live",
      label: en ? "Live engine (TS)" : "Motor vivo (TS)",
      content: (
        <div className="method-body">
          <p>{en
            ? "The live lane is a purpose-built, exact state-vector simulator hand-written in TypeScript — not a third-party JS library and not Qiskit-in-the-browser (there are no usable Pyodide wheels for rustworkx/symengine/qiskit-aer). It holds the amplitudes ψ as a flat Float64Array of 2·2ⁿ reals (interleaved Re,Im). A single-qubit gate U on qubit q is applied in-place by iterating the 2ⁿ⁻¹ index pairs (i, i+2^q) that differ only in bit q, and overwriting each pair with the 2×2 matrix–vector product; a controlled gate restricts the update to the indices whose control bit is 1. This is the standard O(2ⁿ) per-gate Schrödinger update, and it is exact (no truncation). After each step the engine reads the per-qubit Bloch vector and the basis probabilities directly from ψ; measurement draws shots from the categorical distribution {|ψ_b|²} via one seeded PRNG so the live histogram matches the committed convention."
            : "El carril vivo es un simulador de statevector exacto, hecho a medida y escrito a mano en TypeScript — no una librería JS de terceros ni Qiskit-en-el-navegador (no hay wheels Pyodide usables para rustworkx/symengine/qiskit-aer). Mantiene las amplitudes ψ como un Float64Array plano de 2·2ⁿ reales (Re,Im intercalados). Una compuerta de un qubit U sobre el qubit q se aplica in-place iterando los 2ⁿ⁻¹ pares de índices (i, i+2^q) que difieren solo en el bit q, sobrescribiendo cada par con el producto matriz–vector 2×2; una compuerta controlada restringe la actualización a los índices cuyo bit de control es 1. Es la actualización de Schrödinger estándar O(2ⁿ) por compuerta, y es exacta (sin truncamiento). Tras cada paso el motor lee el vector de Bloch por qubit y las probabilidades base directamente de ψ; la medición toma shots de la distribución categórica {|ψ_b|²} con un PRNG con semilla para que el histograma vivo siga la convención commiteada."}</p>
          <Eq
            tex={String.raw`\psi'_{i}=U_{00}\psi_{i}+U_{01}\psi_{i+2^{q}},\quad \psi'_{i+2^{q}}=U_{10}\psi_{i}+U_{11}\psi_{i+2^{q}}\quad\forall\, i:\ (i\,\&\,2^{q})=0`}
            caption={{
              en: "The in-place single-qubit gate kernel: for every index pair differing only in bit q, apply the 2×2 gate matrix — the O(2ⁿ) exact Schrödinger update the live engine runs per gate.",
              es: "El kernel in-place de compuerta de un qubit: para cada par de índices que difiere solo en el bit q, aplica la matriz 2×2 — la actualización de Schrödinger exacta O(2ⁿ) que el motor vivo corre por compuerta.",
            }}
          />
          <Eq
            tex={String.raw`\langle Z\rangle_q=\!\!\sum_{b:\,b_q=0}\!\!|\psi_b|^2-\!\!\sum_{b:\,b_q=1}\!\!|\psi_b|^2,\qquad p_b=|\psi_b|^2,\qquad \textstyle\sum_b p_b=1`}
            caption={{
              en: "Read-out from the amplitudes: the reduced Bloch ⟨Z⟩ (and analogously ⟨X⟩,⟨Y⟩) and the basis probabilities are computed directly from ψ after each gate, no extra simulation.",
              es: "Lectura desde las amplitudes: el Bloch reducido ⟨Z⟩ (y análogamente ⟨X⟩,⟨Y⟩) y las probabilidades base se computan directo de ψ tras cada compuerta, sin simulación extra.",
            }}
          />
          <ul className="sym-list">
            <li><b>ψ</b>{en ? "amplitude array, 2·2ⁿ Float64 (Re,Im interleaved)" : "arreglo de amplitudes, 2·2ⁿ Float64 (Re,Im intercalados)"}</li>
            <li><b>q</b>{en ? "target qubit index; 2^q is its bit stride" : "índice del qubit objetivo; 2^q es su paso de bit"}</li>
            <li><b>U_jk</b>{en ? "entries of the 2×2 single-qubit gate matrix" : "entradas de la matriz 2×2 de la compuerta"}</li>
            <li><b>b</b>{en ? "a computational basis index 0…2ⁿ−1" : "un índice de base computacional 0…2ⁿ−1"}</li>
            <li><b>p_b</b>{en ? "measurement probability of basis state b" : "probabilidad de medición del estado base b"}</li>
            <li><b>⟨Z⟩_q</b>{en ? "reduced Pauli-Z expectation on qubit q" : "valor esperado reducido de Pauli-Z en el qubit q"}</li>
          </ul>
          <Boundary en={en}
            runs={en ? "the visitor's browser CPU" : "la CPU del navegador del visitante"}
            live={en ? "ψ stays in JS; ≤12 q ≈ 64 MB; nothing leaves the page" : "ψ vive en JS; ≤12 q ≈ 64 MB; nada sale de la página"} />
          <WhereWorks
            okHead={en ? "Where it works" : "Dónde funciona"}
            failHead={en ? "Where it fails" : "Dónde falla"}
            ok={<>
              <li>{en ? "clean unitary circuits ≤ 12 qubits — drag RY and the Bloch vector tips instantly" : "circuitos unitarios limpios ≤ 12 qubits — arrastra RY y el vector de Bloch responde al instante"}</li>
              <li>{en ? "exact: amplitudes are full-precision Float64, no truncation" : "exacto: amplitudes en Float64 completo, sin truncamiento"}</li>
              <li>{en ? "Bell/GHZ/W, oracles, QFT, Grover — the interactive cases" : "Bell/GHZ/W, oráculos, QFT, Grover — los casos interactivos"}</li>
            </>}
            fail={<>
              <li>{en ? "noise (needs a density-matrix / Aer model — not in the browser)" : "ruido (necesita matriz densidad / Aer — no en el navegador)"}</li>
              <li>{en ? "mid-circuit measurement + feed-forward (teleportation, QEC)" : "medición intermedia + feed-forward (teleportación, QEC)"}</li>
              <li>{en ? "optimization loops (VQE/QAOA training) and > 12 qubits → degrades gracefully to the precomputed trace" : "bucles de optimización (VQE/QAOA) y > 12 qubits → degrada al trace precomputado"}</li>
            </>}
          />
          <Refs ids={["nielsen2010", "jones2019quest", "qiskit2024"]} label={refLabel} />
        </div>
      ),
    },

    /* ───────────────────── 4 · Qiskit + Aer (precompute) ────────────────── */
    {
      id: "qiskit",
      label: "Qiskit + Aer",
      content: (
        <div className="method-body">
          <p>{en
            ? "The Qiskit adapter is the workhorse for the precompute lane. For ideal cases it uses the Aer statevector method and reads the same per-step record the live engine produces; for realistic noise it switches to the density-matrix method, evolving ρ instead of ψ so it can apply incoherent channels. The build models noise as composed Kraus channels — depolarizing on gates, amplitude/phase damping for T₁/T₂, and readout error — applied after each gate; the density matrix is exact for the modeled channels (no Monte-Carlo trajectory sampling). Because ρ has 4ⁿ entries (versus 2ⁿ for ψ), this is strictly an offline lane. The histogram is then sampled from diag(ρ) with the seeded generator, and the manifest records the noise model so the verdict is reproducible."
            : "El adaptador de Qiskit es el caballo de batalla del carril de precómputo. Para casos ideales usa el método statevector de Aer y lee el mismo registro por paso que produce el motor vivo; para ruido realista cambia al método de matriz densidad, evolucionando ρ en vez de ψ para poder aplicar canales incoherentes. El build modela el ruido como canales de Kraus compuestos — despolarizante en compuertas, amortiguamiento de amplitud/fase para T₁/T₂ y error de lectura — aplicados tras cada compuerta; la matriz densidad es exacta para los canales modelados (sin muestreo de trayectorias Monte-Carlo). Como ρ tiene 4ⁿ entradas (frente a 2ⁿ de ψ), es estrictamente un carril offline. El histograma se muestrea luego de diag(ρ) con el generador con semilla, y el manifiesto registra el modelo de ruido para que el veredicto sea reproducible."}</p>
          <Eq
            tex={String.raw`\rho'=\mathcal{E}(\rho)=\sum_k K_k\,\rho\,K_k^{\dagger},\qquad \sum_k K_k^{\dagger}K_k=\mathbb{I},\qquad \mathcal{E}_{\text{dep}}(\rho)=(1-p)\rho+\tfrac{p}{3}\!\!\sum_{P\in\{X,Y,Z\}}\!\!P\rho P`}
            caption={{
              en: "The noisy lane evolves a density matrix through Kraus channels (depolarizing shown); the completeness relation Σ Kₖ†Kₖ = I keeps ρ a valid state — exact for the modeled noise, hence offline.",
              es: "El carril ruidoso evoluciona una matriz densidad por canales de Kraus (despolarizante mostrado); la relación de completitud Σ Kₖ†Kₖ = I mantiene ρ un estado válido — exacto para el ruido modelado, por eso offline.",
            }}
          />
          <ul className="sym-list">
            <li><b>ρ</b>{en ? "density matrix, 2ⁿ×2ⁿ (4ⁿ entries)" : "matriz densidad, 2ⁿ×2ⁿ (4ⁿ entradas)"}</li>
            <li><b>𝓔</b>{en ? "a CPTP quantum channel (noise)" : "un canal cuántico CPTP (ruido)"}</li>
            <li><b>K_k</b>{en ? "Kraus operators of the channel" : "operadores de Kraus del canal"}</li>
            <li><b>p</b>{en ? "depolarizing probability per gate" : "probabilidad de despolarización por compuerta"}</li>
            <li><b>T₁ / T₂</b>{en ? "relaxation / dephasing times (damping channels)" : "tiempos de relajación / desfase (canales de amortiguamiento)"}</li>
          </ul>
          <Boundary en={en}
            runs={en ? "the local .venv (Aer)" : "el .venv local (Aer)"}
            live={en ? "precompute only — 4ⁿ ρ never enters the browser" : "solo precómputo — ρ de 4ⁿ nunca entra al navegador"} />
          <WhereWorks
            okHead={en ? "Where it works" : "Dónde funciona"}
            failHead={en ? "Where it fails" : "Dónde falla"}
            ok={<>
              <li>{en ? "realistic noise (depolarizing, T₁/T₂ damping, readout) — exact for the model" : "ruido realista (despolarizante, amortiguamiento T₁/T₂, lectura) — exacto para el modelo"}</li>
              <li>{en ? "ideal statevector cases share the live trace shape exactly" : "casos statevector ideales comparten la forma de traza viva exactamente"}</li>
              <li>{en ? "mid-circuit measurement + feed-forward (teleportation, repetition code)" : "medición intermedia + feed-forward (teleportación, código de repetición)"}</li>
            </>}
            fail={<>
              <li>{en ? "4ⁿ memory caps the density-matrix lane well below the statevector limit" : "la memoria 4ⁿ limita el carril de matriz densidad muy por debajo del statevector"}</li>
              <li>{en ? "not for the browser — too heavy to ship; lives in the precompute lane" : "no para el navegador — demasiado pesado; vive en el carril de precómputo"}</li>
            </>}
          />
          <Refs ids={["qiskit2024", "nielsen2010", "preskill2018", "temme2017"]} label={refLabel} />
        </div>
      ),
    },

    /* ───────────────────── 5 · PennyLane (differentiable) ───────────────── */
    {
      id: "pennylane",
      label: "PennyLane",
      content: (
        <div className="method-body">
          <p>{en
            ? "PennyLane is the differentiable adapter — the engine behind the variational cases (VQE, QAOA, quantum kernels). It exposes a quantum node (a circuit returning an expectation) that is differentiable end-to-end, so a classical optimizer can climb the cost landscape. The build evaluates analytic gradients with the parameter-shift rule: for a gate generated by a Pauli (eigenvalues ±½), the exact derivative of an expectation ⟨H⟩(θ) is the difference of the same circuit evaluated at θ ± π/2 — no finite-difference bias. VQE then minimizes the energy ⟨ψ(θ)|H|ψ(θ)⟩ for the H₂/STO-3G Hamiltonian (a Hartree–Fock reference plus one DoubleExcitation angle θ), bounded below by the true ground energy via the variational principle; QAOA maximizes the cut objective over (γ,β). Because both carry an optimization loop, they are precompute by the gate, and the committed trace replays the optimal-parameter circuit."
            : "PennyLane es el adaptador diferenciable — el motor tras los casos variacionales (VQE, QAOA, kernels cuánticos). Expone un nodo cuántico (un circuito que devuelve un valor esperado) diferenciable de extremo a extremo, así que un optimizador clásico puede subir el paisaje de costo. El build evalúa gradientes analíticos con la regla de desplazamiento de parámetros: para una compuerta generada por un Pauli (autovalores ±½), la derivada exacta de un valor esperado ⟨H⟩(θ) es la diferencia del mismo circuito evaluado en θ ± π/2 — sin sesgo de diferencias finitas. VQE entonces minimiza la energía ⟨ψ(θ)|H|ψ(θ)⟩ para el hamiltoniano H₂/STO-3G (una referencia Hartree–Fock más un ángulo DoubleExcitation θ), acotada por abajo por la energía fundamental verdadera vía el principio variacional; QAOA maximiza el objetivo de corte sobre (γ,β). Como ambos llevan un bucle de optimización, son precómputo por la compuerta, y la traza commiteada hace replay del circuito de parámetros óptimos."}</p>
          <Eq
            tex={String.raw`\frac{\partial\langle H\rangle}{\partial\theta}=\tfrac12\Big[\langle H\rangle\big(\theta+\tfrac{\pi}{2}\big)-\langle H\rangle\big(\theta-\tfrac{\pi}{2}\big)\Big]`}
            caption={{
              en: "The parameter-shift rule: the exact analytic gradient of an expectation w.r.t. a Pauli-generated gate angle is a half-difference of the circuit at θ ± π/2 — what makes the variational loop trainable without finite-difference error.",
              es: "La regla de desplazamiento de parámetros: el gradiente analítico exacto de un valor esperado respecto a un ángulo generado por Pauli es la semidiferencia del circuito en θ ± π/2 — lo que hace el bucle variacional entrenable sin error de diferencias finitas.",
            }}
          />
          <Eq
            tex={String.raw`E(\boldsymbol\theta)=\langle\psi(\boldsymbol\theta)|H|\psi(\boldsymbol\theta)\rangle\ \ge\ E_0,\qquad \boldsymbol\theta^\star=\arg\min_{\boldsymbol\theta}E(\boldsymbol\theta)`}
            caption={{
              en: "The variational principle that floors VQE: any trial energy is an upper bound on the true ground energy E₀, so minimizing E(θ) drives toward chemical accuracy.",
              es: "El principio variacional que pone piso a VQE: cualquier energía de prueba es cota superior de la energía fundamental verdadera E₀, así que minimizar E(θ) acerca a la precisión química.",
            }}
          />
          <ul className="sym-list">
            <li><b>θ</b>{en ? "a variational circuit parameter (ansatz angle)" : "un parámetro variacional del circuito (ángulo del ansatz)"}</li>
            <li><b>⟨H⟩</b>{en ? "expectation of the problem Hamiltonian" : "valor esperado del hamiltoniano del problema"}</li>
            <li><b>E₀</b>{en ? "true ground-state energy (variational floor)" : "energía fundamental verdadera (piso variacional)"}</li>
            <li><b>(γ,β)</b>{en ? "QAOA cost/mixer angles per layer" : "ángulos de costo/mezclador de QAOA por capa"}</li>
            <li><b>|ψ(θ)⟩</b>{en ? "the parametrized trial (ansatz) state" : "el estado de prueba parametrizado (ansatz)"}</li>
          </ul>
          <Boundary en={en}
            runs={en ? "the local .venv (autograd)" : "el .venv local (autograd)"}
            live={en ? "precompute — the (γ,β)/θ optimization loop is offline" : "precómputo — el bucle de optimización (γ,β)/θ es offline"} />
          <WhereWorks
            okHead={en ? "Where it works" : "Dónde funciona"}
            failHead={en ? "Where it fails" : "Dónde falla"}
            ok={<>
              <li>{en ? "exact analytic gradients (parameter-shift) — no finite-difference noise" : "gradientes analíticos exactos (parameter-shift) — sin ruido de diferencias finitas"}</li>
              <li>{en ? "VQE on H₂/STO-3G reaches chemical accuracy on 4 qubits" : "VQE en H₂/STO-3G alcanza precisión química en 4 qubits"}</li>
              <li>{en ? "cross-checks QAOA-Qiskit on the identical MaxCut objective" : "valida QAOA-Qiskit en el objetivo MaxCut idéntico"}</li>
            </>}
            fail={<>
              <li>{en ? "barren plateaus: gradients vanish exponentially for deep generic ansätze" : "mesetas estériles: los gradientes se desvanecen exponencialmente para ansätze profundos genéricos"}</li>
              <li>{en ? "the optimization loop forbids the live lane — always precompute" : "el bucle de optimización prohíbe el carril vivo — siempre precómputo"}</li>
            </>}
          />
          <Refs ids={["pennylane2018", "peruzzo2014", "farhi2014", "mcclean2018"]} label={refLabel} />
        </div>
      ),
    },

    /* ───────────────────── 6 · Stim + PyMatching ────────────────────────── */
    {
      id: "stim",
      label: "Stim + PyMatching",
      content: (
        <div className="method-body">
          <p>{en
            ? "Stim is the stabilizer adapter — the engine that makes quantum error correction tractable at code-relevant sizes. By the Gottesman–Knill theorem, a circuit built only from Clifford gates (H, S, CNOT) and measurements can be simulated classically in polynomial time, because the state is tracked as a set of n stabilizer generators (Pauli strings) rather than 2ⁿ amplitudes. Stim does exactly this with a bit-packed tableau, so distance-3/5 repetition and surface-code circuits run in milliseconds — far beyond the state-vector wall. The build samples detection events (parity flips between rounds) and feeds them to PyMatching, which decodes via minimum-weight perfect matching on the detector graph: it pairs up defects to infer the most-likely error chain and a correction. Sweeping physical error rate p reveals the threshold — below it, raising code distance d lowers the logical error; above it, more qubits make things worse."
            : "Stim es el adaptador estabilizador — el motor que hace tratable la corrección cuántica de errores a tamaños relevantes. Por el teorema de Gottesman–Knill, un circuito construido solo con compuertas de Clifford (H, S, CNOT) y mediciones se simula clásicamente en tiempo polinomial, porque el estado se rastrea como un conjunto de n generadores estabilizadores (cadenas de Pauli) en vez de 2ⁿ amplitudes. Stim hace justo esto con un tableau empaquetado en bits, así que circuitos de código de repetición/superficie de distancia 3/5 corren en milisegundos — mucho más allá del muro del statevector. El build muestrea eventos de detección (cambios de paridad entre rondas) y los pasa a PyMatching, que decodifica vía emparejamiento perfecto de peso mínimo en el grafo de detectores: empareja defectos para inferir la cadena de error más probable y una corrección. Barrer la tasa de error físico p revela el umbral — por debajo, subir la distancia d baja el error lógico; por encima, más qubits empeoran."}</p>
          <Eq
            tex={String.raw`p_L \;\propto\; \Big(\tfrac{p}{p_{\text{th}}}\Big)^{\lfloor (d+1)/2\rfloor},\qquad d\uparrow \Rightarrow p_L\downarrow \iff p<p_{\text{th}}`}
            caption={{
              en: "The QEC threshold law: the logical error rate falls exponentially in code distance d ONLY below the threshold p_th; above it, adding qubits increases failure. The Clifford restriction is what lets Stim simulate this at scale.",
              es: "La ley de umbral de QEC: la tasa de error lógico cae exponencialmente en la distancia d SOLO por debajo del umbral p_th; por encima, agregar qubits aumenta el fallo. La restricción de Clifford es lo que permite a Stim simular esto a escala.",
            }}
          />
          <ul className="sym-list">
            <li><b>p</b>{en ? "physical error rate per operation" : "tasa de error físico por operación"}</li>
            <li><b>p_L</b>{en ? "logical (post-correction) error rate" : "tasa de error lógico (post-corrección)"}</li>
            <li><b>p_th</b>{en ? "the code threshold (~1% for surface codes)" : "el umbral del código (~1% para códigos de superficie)"}</li>
            <li><b>d</b>{en ? "code distance (number of rounds/rows)" : "distancia del código (número de rondas/filas)"}</li>
            <li><b>{en ? "detector" : "detector"}</b>{en ? "a parity check whose flip signals an error" : "un chequeo de paridad cuyo cambio señala un error"}</li>
            <li><b>MWPM</b>{en ? "minimum-weight perfect matching (the decoder)" : "emparejamiento perfecto de peso mínimo (el decodificador)"}</li>
          </ul>
          <Boundary en={en}
            runs={en ? "the local .venv (Stim tableau)" : "el .venv local (tableau de Stim)"}
            live={en ? "precompute — Clifford-only; the trace carries the decoded verdict" : "precómputo — solo Clifford; la traza lleva el veredicto decodificado"} />
          <WhereWorks
            okHead={en ? "Where it works" : "Dónde funciona"}
            failHead={en ? "Where it fails" : "Dónde falla"}
            ok={<>
              <li>{en ? "Clifford circuits at hundreds–thousands of qubits in polynomial time" : "circuitos de Clifford a cientos–miles de qubits en tiempo polinomial"}</li>
              <li>{en ? "repetition + surface codes, threshold sweeps, MWPM decoding" : "códigos de repetición + superficie, barridos de umbral, decodificación MWPM"}</li>
              <li>{en ? "the only way to reach code-relevant sizes a state-vector cannot touch" : "la única vía a tamaños de código que un statevector no puede tocar"}</li>
            </>}
            fail={<>
              <li>{en ? "non-Clifford gates (T, arbitrary rotations) break the stabilizer formalism" : "compuertas no-Clifford (T, rotaciones arbitrarias) rompen el formalismo estabilizador"}</li>
              <li>{en ? "no continuous amplitudes — it tracks Pauli structure, not the wavefunction" : "sin amplitudes continuas — rastrea estructura de Pauli, no la función de onda"}</li>
            </>}
          />
          <Refs ids={["gidney2021stim", "gottesman1998", "aaronson2004", "higgott2022", "fowler2012"]} label={refLabel} />
        </div>
      ),
    },

    /* ───────────────────── 7 · The trace contract ───────────────────────── */
    {
      id: "trace",
      label: en ? "Trace contract" : "Contrato de traza",
      content: (
        <div className="method-body">
          <p>{en
            ? "The trace (schema qlab-trace/1) is the artifact every adapter produces and the only thing the browser depends on. It is a replayable recording of one circuit run: for every step (a gate, a barrier, a prepared state) it stores the full statevector (2ⁿ complex amplitudes), the per-qubit reduced Bloch vector [⟨X⟩,⟨Y⟩,⟨Z⟩], and the basis-state probabilities, plus the final measurement histogram. It is JSON-first and compact (amplitudes rounded to 6 decimals) and contains no Qiskit type, so the browser never depends on a Python library. A hand-maintained TypeScript mirror (the contract types) tracks the Python schema per ADR-0057; a divergence between the two is caught at build time, so the web and engine cannot drift apart silently."
            : "La traza (esquema qlab-trace/1) es el artefacto que produce cada adaptador y lo único de lo que depende el navegador. Es una grabación reproducible de una corrida: por cada paso (una compuerta, una barrera, un estado preparado) guarda el statevector completo (2ⁿ amplitudes complejas), el vector de Bloch reducido por qubit [⟨X⟩,⟨Y⟩,⟨Z⟩] y las probabilidades de los estados base, más el histograma final de medición. Es JSON-first y compacto (amplitudes redondeadas a 6 decimales) y no contiene ningún tipo de Qiskit, así que el navegador nunca depende de una librería de Python. Un espejo TypeScript mantenido a mano (los tipos del contrato) rastrea el esquema Python según ADR-0057; una divergencia entre ambos se detecta en build, así que web y motor no pueden separarse en silencio."}</p>
          <div className="fig-svg wide"><TraceDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "From a circuit run to the renderers: each step records statevector + Bloch + probabilities (and a final histogram), serialized to JSON with no Qiskit type, mirrored 1:1 in TypeScript, and animated by the same renderers for both lanes."
              : "De la corrida a los renderers: cada paso registra statevector + Bloch + probabilidades (y un histograma final), serializado a JSON sin tipo Qiskit, espejado 1:1 en TypeScript, y animado por los mismos renderers en ambos carriles."}</p>
          </div>
          <Eq
            tex={String.raw`\text{step}_t=\big\{\,\psi_t\in\mathbb{C}^{2^n},\ \mathbf r_q=(\langle X\rangle,\langle Y\rangle,\langle Z\rangle)_q,\ \{p_b\}\,\big\},\qquad \text{counts}=\text{hist}_{\text{final}}`}
            caption={{
              en: "The per-step record the trace contract stores: the full statevector, every qubit's reduced Bloch vector, and the basis probabilities — plus the final measurement counts. This is exactly what both lanes emit.",
              es: "El registro por paso que guarda el contrato de traza: el statevector completo, el vector de Bloch reducido de cada qubit y las probabilidades base — más los conteos finales de medición. Es exactamente lo que emiten ambos carriles.",
            }}
          />
          <ul className="sym-list">
            <li><b>ψ_t</b>{en ? "the statevector at step t (6-dp rounded)" : "el statevector en el paso t (6 dec.)"}</li>
            <li><b>r_q</b>{en ? "reduced Bloch vector of qubit q" : "vector de Bloch reducido del qubit q"}</li>
            <li><b>{"{p_b}"}</b>{en ? "the basis-state probability distribution" : "la distribución de probabilidad de los estados base"}</li>
            <li><b>counts</b>{en ? "final measurement histogram (seeded sample)" : "histograma final de medición (muestra con semilla)"}</li>
            <li><b>{en ? "TS mirror" : "espejo TS"}</b>{en ? "type-level copy of the schema, checked at build" : "copia a nivel de tipos del esquema, chequeada en build"}</li>
          </ul>
          <Boundary en={en}
            runs={en ? "written offline; read in the browser" : "escrito offline; leído en el navegador"}
            live={en ? "this JSON IS the live/precompute boundary — no framework crosses it" : "este JSON ES la frontera vivo/precómputo — ningún framework la cruza"} />
          <WhereWorks
            okHead={en ? "What it guarantees" : "Qué garantiza"}
            failHead={en ? "What it deliberately omits" : "Qué omite a propósito"}
            ok={<>
              <li>{en ? "one renderer for both lanes — identical trace shape" : "un renderer para ambos carriles — forma de traza idéntica"}</li>
              <li>{en ? "no Python dependency in the browser; no Pyodide" : "sin dependencia de Python en el navegador; sin Pyodide"}</li>
              <li>{en ? "build-time TS/Python schema sync (ADR-0057) prevents drift" : "sincronía de esquema TS/Python en build (ADR-0057) evita la deriva"}</li>
            </>}
            fail={<>
              <li>{en ? "no framework objects (Qiskit circuits, PennyLane tapes) — only plain data" : "sin objetos de framework (circuitos Qiskit, cintas PennyLane) — solo datos planos"}</li>
              <li>{en ? "amplitudes are rounded to 6 dp to keep the JSON compact (<~1 MB live)" : "las amplitudes se redondean a 6 dec. para mantener el JSON compacto (<~1 MB vivo)"}</li>
            </>}
          />
          <Refs ids={["ecma404", "nielsen2010", "qiskit2024"]} label={refLabel} />
        </div>
      ),
    },

    /* ───────────────────── 8 · The manifest contract ────────────────────── */
    {
      id: "manifest",
      label: en ? "Manifest contract" : "Contrato de manifiesto",
      content: (
        <div className="method-body">
          <p>{en
            ? "The manifest (schema qlab-manifest/1) is the index contract — one per (case, variant). It records the lane verdict and the measured numbers behind it (qubit count, run_ms, trace_bytes, unitary_only), the seed/shots/params that reproduce the trace, the viz bindings (which renderers the web mounts for this case), and the engine provenance plus version. The web app reads the set of manifests as its entire catalog — there is no database and no server. Adding a manifest adds a card; the viz bindings tell the SPA which views to assemble, so a case that wants a Bloch sphere, an amplitude/phase bar, and a histogram declares exactly those, and the renderer composition is data-driven rather than hard-coded per case."
            : "El manifiesto (esquema qlab-manifest/1) es el contrato índice — uno por (caso, variante). Registra el veredicto de carril y los números medidos detrás (cantidad de qubits, run_ms, trace_bytes, unitary_only), el seed/shots/params que reproducen la traza, los bindings de viz (qué renderers monta la web para este caso) y la procedencia del motor más versión. La web lee el conjunto de manifiestos como su catálogo entero — no hay base de datos ni servidor. Agregar un manifiesto agrega una tarjeta; los bindings de viz le dicen a la SPA qué vistas armar, así que un caso que quiere una esfera de Bloch, una barra de amplitud/fase y un histograma declara justo esos, y la composición de renderers es guiada por datos en vez de hard-coded por caso."}</p>
          <pre className="code"><code>{`{ "schema": "qlab-manifest/1",
  "case": "maxcut", "variant": "ring-6",
  "lane": "precompute",                 // the measured verdict
  "gate": { "qubits": 6, "run_ms": 41.2,
            "trace_bytes": 318204, "unitary_only": false },
  "repro": { "seed": 42, "shots": 2048, "params": { ... } },
  "viz": ["graph", "histogram", "landscape"],   // renderer bindings
  "engine": { "framework": "qiskit", "version": "1.x" } }`}</code></pre>
          <Eq
            tex={String.raw`\text{catalog}=\bigcup_{(\text{case},\text{variant})}\text{manifest}_{(\text{case},\text{variant})},\qquad \text{lane}\in\{\text{live},\,\text{precompute},\,\text{hardware}\}`}
            caption={{
              en: "The catalog is just the union of all manifests — no server, no database; the web reads the manifest set, and each manifest carries the lane verdict plus the viz bindings that compose its view.",
              es: "El catálogo es solo la unión de todos los manifiestos — sin servidor, sin base de datos; la web lee el conjunto, y cada manifiesto lleva el veredicto de carril más los bindings de viz que componen su vista.",
            }}
          />
          <ul className="sym-list">
            <li><b>lane</b>{en ? "the measured verdict: live / precompute / hardware" : "el veredicto medido: live / precompute / hardware"}</li>
            <li><b>gate.*</b>{en ? "the four measured numbers behind the verdict" : "los cuatro números medidos tras el veredicto"}</li>
            <li><b>repro</b>{en ? "seed, shots, params — replays the exact trace" : "seed, shots, params — reproduce la traza exacta"}</li>
            <li><b>viz</b>{en ? "renderer bindings (bloch, amp_phase, histogram, qsphere, graph, …)" : "bindings de renderers (bloch, amp_phase, histogram, qsphere, graph, …)"}</li>
            <li><b>engine</b>{en ? "framework + version provenance" : "procedencia de framework + versión"}</li>
          </ul>
          <Boundary en={en}
            runs={en ? "written offline; the web's only catalog" : "escrito offline; el único catálogo de la web"}
            live={en ? "no DB / no server — the manifest SET is the index" : "sin BD / sin servidor — el CONJUNTO de manifiestos es el índice"} />
          <WhereWorks
            okHead={en ? "What it enables" : "Qué habilita"}
            failHead={en ? "What it is not" : "Qué no es"}
            ok={<>
              <li>{en ? "data-driven views: viz bindings compose renderers per case" : "vistas guiadas por datos: los bindings componen renderers por caso"}</li>
              <li>{en ? "a serverless catalog — adding a manifest adds a card" : "un catálogo serverless — agregar un manifiesto agrega una tarjeta"}</li>
              <li>{en ? "an auditable verdict: the numbers behind the lane are recorded" : "un veredicto auditable: los números tras el carril quedan registrados"}</li>
            </>}
            fail={<>
              <li>{en ? "not a runtime API — it is committed static JSON, read at load" : "no es una API en runtime — es JSON estático commiteado, leído al cargar"}</li>
              <li>{en ? "it does not store amplitudes (those live in the trace)" : "no guarda amplitudes (esas viven en la traza)"}</li>
            </>}
          />
          <Refs ids={["ecma404", "nielsen2010"]} label={refLabel} />
        </div>
      ),
    },

    /* ───────────────────── 9 · The measured gate ────────────────────────── */
    {
      id: "gate",
      label: en ? "The measured gate" : "La compuerta medida",
      content: (
        <div className="method-body">
          <p>{en
            ? "Whether a case runs live in the browser or is precomputed is decided by measurement, not taste (classify_lane). A case runs live only if ALL FOUR conditions hold: qubits ≤ 12 (the 2ⁿ amplitudes must stay interactive in JS — ~12 q ≈ 64 MB); unitary-only (no realistic noise, which needs Aer; no mid-circuit measurement + feed-forward; no optimization loop); run_ms ≤ 1500 (the offline build time, used as a proxy for browser responsiveness); and trace_bytes ≤ ~1 MB. Otherwise the case is precompute. The verdict and the numbers behind it are written into the manifest, and CI fails the build if a live-tagged case breaches a gate — mislabeling cannot ship. Both lanes render through one code path, so the only visible difference to the visitor is whether they can re-simulate from scratch or replay a committed run."
            : "Si un caso corre vivo en el navegador o se precomputa lo decide la medición, no el gusto (classify_lane). Un caso corre vivo solo si se cumplen LAS CUATRO condiciones: qubits ≤ 12 (las 2ⁿ amplitudes deben seguir interactivas en JS — ~12 q ≈ 64 MB); solo-unitario (sin ruido realista, que necesita Aer; sin medición intermedia + feed-forward; sin bucle de optimización); run_ms ≤ 1500 (el tiempo de build offline, usado como proxy de la respuesta del navegador); y trace_bytes ≤ ~1 MB. En otro caso es precómputo. El veredicto y los números detrás se escriben en el manifiesto, y CI rompe el build si un caso etiquetado live viola una compuerta — el mal etiquetado no puede publicarse. Ambos carriles renderizan por un mismo camino, así que la única diferencia visible para el visitante es si puede re-simular desde cero o hacer replay de una corrida commiteada."}</p>
          <div className="fig-svg wide"><GateDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "classify_lane reads four measurements; ALL pass → LIVE (in-browser re-sim), ANY fails → PRECOMPUTE (committed trace, replayed). The verdict and its numbers are written to the manifest and enforced in CI."
              : "classify_lane lee cuatro mediciones; TODAS pasan → LIVE (re-sim en navegador), FALLA una → PRECOMPUTE (traza commiteada, replay). El veredicto y sus números se escriben al manifiesto y se aplican en CI."}</p>
          </div>
          <Eq
            tex={String.raw`\text{live}\iff (n\le 12)\,\wedge\,\text{unitary\_only}\,\wedge\,(t_{\text{run}}\le 1500\,\text{ms})\,\wedge\,(\text{bytes}\le 10^6)`}
            caption={{
              en: "The live predicate: a case is live iff all four measured conditions hold; any failure routes it to the precompute lane. The thresholds are constants, not opinions.",
              es: "El predicado de vivo: un caso es vivo si y solo si las cuatro condiciones medidas se cumplen; cualquier fallo lo enruta al carril de precómputo. Los umbrales son constantes, no opiniones.",
            }}
          />
          <ul className="sym-list">
            <li><b>n</b>{en ? "qubit count (≤ 12 for live; 2ⁿ ≈ 64 MB at 12)" : "cantidad de qubits (≤ 12 para vivo; 2ⁿ ≈ 64 MB en 12)"}</li>
            <li><b>unitary_only</b>{en ? "no noise / no feed-forward / no optimization loop" : "sin ruido / sin feed-forward / sin bucle de optimización"}</li>
            <li><b>t_run</b>{en ? "offline build time (ms), ≤ 1500 for live" : "tiempo de build offline (ms), ≤ 1500 para vivo"}</li>
            <li><b>bytes</b>{en ? "serialized trace size, ≤ ~1 MB for live" : "tamaño de la traza serializada, ≤ ~1 MB para vivo"}</li>
          </ul>
          <p className="honest-note"><strong>{en ? "Worked examples — " : "Ejemplos — "}</strong>{en
            ? "state-prep (≤ 4 q, pure unitary, ~1–2 ms, ~9 KB) → live; maxcut (≤ 6 q, but a p=1 QAOA carries an offline (γ,β) grid-search optimization loop, so unitary_only = false) → precompute, and the committed trace still replays the optimal-parameter circuit."
            : "state-prep (≤ 4 q, unitario puro, ~1–2 ms, ~9 KB) → vivo; maxcut (≤ 6 q, pero un QAOA p=1 lleva una búsqueda offline en grilla (γ,β), así que unitary_only = false) → precómputo, y la traza commiteada igual hace replay del circuito de parámetros óptimos."}</p>
          <Boundary en={en}
            runs={en ? "the gate runs offline; it decides the browser's lane" : "la compuerta corre offline; decide el carril del navegador"}
            live={en ? "live ⇒ ψ re-sims in JS · precompute ⇒ trace replays" : "vivo ⇒ ψ re-sim en JS · precómputo ⇒ replay de traza"} />
          <Refs ids={["nielsen2010", "preskill2018"]} label={refLabel} />
        </div>
      ),
    },

    /* ───────────────────── 10 · Real-hardware lane ──────────────────────── */
    {
      id: "hardware",
      label: en ? "Real-hardware lane" : "Carril de hardware real",
      content: (
        <div className="method-body">
          <p>{en
            ? "A case can be submitted to a real QPU; the returned counts are committed as a trace with a ran_on badge (e.g. IBM Heron r2 · ibm_kingston · 2026-…). This lane attaches at the exact same seam as the simulators — the same Solver interface, the same trace shape — so a hardware result renders identically to a simulated one, only labelled with its provenance. Crucially, it runs LOCALLY, with an access token pulled from the private vault; the published static site ships no secrets and makes no live hardware calls. The trace it produces is just data, so once committed it is served like any other case. The cheapest honest path is IBM Quantum Open: free, ~10 minutes of QPU per 28-day window on a 156-qubit Heron r2 — enough to commit a genuine ran-on-real-hardware moment without spending money."
            : "Un caso puede enviarse a una QPU real; los conteos devueltos se commitean como una traza con un badge ran_on (p. ej. IBM Heron r2 · ibm_kingston · 2026-…). Este carril se engancha en la misma costura que los simuladores — la misma interfaz Solver, la misma forma de traza — así que un resultado de hardware se renderiza idéntico a uno simulado, solo etiquetado con su procedencia. Crucialmente, corre LOCALMENTE, con un token de acceso del vault privado; el sitio estático publicado no lleva secretos ni hace llamadas en vivo a hardware. La traza que produce es solo datos, así que una vez commiteada se sirve como cualquier otro caso. El camino honesto más barato es IBM Quantum Open: gratis, ~10 minutos de QPU por ventana de 28 días en un Heron r2 de 156 qubits — suficiente para commitear un momento genuino de corrió-en-hardware-real sin gastar dinero."}</p>
          <Eq
            tex={String.raw`\widehat{\langle O\rangle}=\frac{1}{S}\sum_{s=1}^{S} O(b_s),\qquad \text{SE}\approx\frac{\sigma_O}{\sqrt{S}}\quad(\text{shot noise on real counts})`}
            caption={{
              en: "Real-hardware results are shot-limited: an observable is the sample mean over S measured bitstrings, with a 1/√S statistical error — the trace records the raw counts so the noise is honest, not hidden.",
              es: "Los resultados de hardware real están limitados por shots: un observable es la media muestral sobre S bitstrings medidos, con error estadístico 1/√S — la traza guarda los conteos crudos para que el ruido sea honesto, no oculto.",
            }}
          />
          <ul className="sym-list">
            <li><b>S</b>{en ? "number of shots run on the QPU" : "número de shots corridos en la QPU"}</li>
            <li><b>b_s</b>{en ? "the s-th measured bitstring" : "el s-ésimo bitstring medido"}</li>
            <li><b>O(b)</b>{en ? "the observable evaluated on a bitstring" : "el observable evaluado en un bitstring"}</li>
            <li><b>ran_on</b>{en ? "provenance badge: device, backend, date" : "badge de procedencia: dispositivo, backend, fecha"}</li>
            <li><b>SE</b>{en ? "standard error of the estimate (1/√S)" : "error estándar de la estimación (1/√S)"}</li>
          </ul>
          <Boundary en={en}
            runs={en ? "locally, with a vault token" : "localmente, con un token del vault"}
            live={en ? "dormant on the published site — committed counts only, zero live calls" : "inactivo en el sitio publicado — solo conteos commiteados, cero llamadas en vivo"} />
          <WhereWorks
            okHead={en ? "Where it works" : "Dónde funciona"}
            failHead={en ? "Where it does not" : "Dónde no"}
            ok={<>
              <li>{en ? "a genuine 'ran on real hardware' result, committed with provenance" : "un resultado genuino de 'corrió en hardware real', commiteado con procedencia"}</li>
              <li>{en ? "renders identically to simulation — same seam, same trace" : "se renderiza idéntico a la simulación — misma costura, misma traza"}</li>
              <li>{en ? "free via IBM Quantum Open (~10 min QPU / 28-day window)" : "gratis vía IBM Quantum Open (~10 min QPU / ventana de 28 días)"}</li>
            </>}
            fail={<>
              <li>{en ? "never live on the published site — no secrets ship, no runtime QPU calls" : "nunca en vivo en el sitio publicado — no se publican secretos ni llamadas a QPU"}</li>
              <li>{en ? "shot- and noise-limited: real counts carry 1/√S statistical error" : "limitado por shots y ruido: los conteos reales llevan error estadístico 1/√S"}</li>
            </>}
          />
          <Refs ids={["preskill2018", "kim2023", "arute2019", "google2024willow"]} label={refLabel} />
        </div>
      ),
    },

    /* ───────────────────── 11 · Deployment ──────────────────────────────── */
    {
      id: "deploy",
      label: en ? "Deployment" : "Despliegue",
      content: (
        <div className="method-body">
          <p>{en
            ? "QLab is a static product: no application server, no request-time database, no backend that simulates on demand. The React SPA is built by Vite and served from GitHub Pages. The offline pipeline commits trace bundles and manifests into the data tree; a prebuild copy step overlays them into the build output, and the catalog is generated from the manifest set. The deploy workflow publishes the built site to Pages on push to the main branch whenever the web sources, the committed artifacts, the manifests, or the engine change — so committing a new trace re-publishes the site. A deep-link fallback copies the entry HTML to a 404 page so client-side routes and refreshes do not 404 on Pages."
            : "QLab es un producto estático: sin servidor de aplicación, sin base de datos en tiempo de request, sin backend que simule a demanda. La SPA en React la construye Vite y se sirve desde GitHub Pages. El pipeline offline commitea bundles de trazas y manifiestos al árbol de datos; un paso de prebuild los superpone en la salida de build, y el catálogo se genera del conjunto de manifiestos. El workflow de deploy publica el sitio construido a Pages al hacer push a la rama principal cuando cambian las fuentes web, los artefactos commiteados, los manifiestos o el motor — así que commitear una traza nueva re-publica el sitio. Un fallback de deep-link copia el HTML de entrada a una página 404 para que las rutas y refrescos del cliente no den 404 en Pages."}</p>
          <p>{en
            ? "Reproducibility is a deploy guarantee, not a hope: what ships is the exact engine source plus seeded traces, and re-running the offline pipeline reproduces the committed bytes. CI guards reject a real secrets file, raw or heavy data blobs (npy/npz/h5/parquet), and any leaked local machine path in tracked files, so the static bundle stays clean and reproducible. The custom domain is set on the Actions deploy via the Pages API (a domain file alone does not set it on Actions deploys), overriding the wildcard, then the site is redeployed."
            : "La reproducibilidad es una garantía de deploy, no una esperanza: lo que se publica es el código exacto del motor más trazas con semilla, y re-correr el pipeline offline reproduce los bytes commiteados. Los guards de CI rechazan un archivo de secretos real, blobs de datos crudos o pesados (npy/npz/h5/parquet) y cualquier ruta local filtrada en archivos versionados, así que el bundle estático queda limpio y reproducible. El dominio personalizado se fija en el deploy de Actions vía la API de Pages (un archivo de dominio solo no lo fija en deploys de Actions), sobreescribiendo el comodín, y luego el sitio se re-despliega."}</p>
          <Eq
            tex={String.raw`\text{dist}=\text{Vite}\big(\text{web}\big)\ \cup\ \text{overlay}\big(\text{traces},\,\text{manifests}\big),\qquad \text{commit(trace)}\Rightarrow\text{re-publish}`}
            caption={{
              en: "The build identity: the published bundle is the Vite output unioned with the committed data overlay; committing a new trace triggers a re-publish — the site is a pure function of the repository.",
              es: "La identidad de build: el bundle publicado es la salida de Vite unida con el overlay de datos commiteado; commitear una traza nueva dispara una re-publicación — el sitio es función pura del repositorio.",
            }}
          />
          <ul className="sym-list">
            <li><b>dist</b>{en ? "the built static bundle served by Pages" : "el bundle estático construido que sirve Pages"}</li>
            <li><b>overlay</b>{en ? "prebuild step copying traces + manifests into the build" : "paso prebuild que copia trazas + manifiestos al build"}</li>
            <li><b>404 → entry</b>{en ? "SPA deep-link fallback for client routing" : "fallback de deep-link de la SPA para el ruteo del cliente"}</li>
            <li><b>{en ? "CI guards" : "guards de CI"}</b>{en ? "reject secrets, heavy blobs, leaked local paths" : "rechazan secretos, blobs pesados, rutas locales filtradas"}</li>
          </ul>
          <Boundary en={en}
            runs={en ? "GitHub Pages CDN — static files only" : "CDN de GitHub Pages — solo archivos estáticos"}
            live={en ? "no backend; the visitor's browser does all live compute" : "sin backend; el navegador del visitante hace todo el cómputo vivo"} />
          <WhereWorks
            okHead={en ? "What the static deploy buys" : "Qué da el deploy estático"}
            failHead={en ? "Its honest constraints" : "Sus restricciones honestas"}
            ok={<>
              <li>{en ? "zero hosting cost, CDN-fast, no server to maintain or secure" : "cero costo de hosting, rápido por CDN, sin servidor que mantener o asegurar"}</li>
              <li>{en ? "reproducible: re-running the pipeline reproduces the shipped bytes" : "reproducible: re-correr el pipeline reproduce los bytes publicados"}</li>
              <li>{en ? "no secrets in the bundle; CI enforces it" : "sin secretos en el bundle; CI lo aplica"}</li>
            </>}
            fail={<>
              <li>{en ? "no on-demand heavy simulation — anything beyond the live gate must be precomputed" : "sin simulación pesada a demanda — todo más allá de la compuerta viva debe precomputarse"}</li>
              <li>{en ? "no live QPU calls — real-hardware results are committed offline" : "sin llamadas a QPU en vivo — los resultados de hardware real se commitean offline"}</li>
            </>}
          />
          <Refs ids={["nielsen2010", "ecma404"]} label={refLabel} />
        </div>
      ),
    },
  ];

  return (
    <div className="page-body prose">
      <div className="page-head">
        <h1>{en ? "Implementation" : "Implementación"}</h1>
        <p className="lede">
          {en
            ? "How the lab is built — not a stack list. The heavy quantum physics runs offline in real frameworks behind a thin Problem × Solver adapter seam; a single pipeline emits a deterministic committed artifact (trace + manifest); a measured gate routes each case to a hand-written live state-vector engine in the browser or a replayed precompute, all rendered by one renderer; and the whole thing ships as a static site with no backend. Every run is a pure function of (params, seed) — replay = truth."
            : "Cómo está construido el lab — no una lista de stack. La física cuántica pesada corre offline en frameworks reales tras una costura delgada de adaptadores Problem × Solver; un único pipeline emite un artefacto commiteado determinista (traza + manifiesto); una compuerta medida enruta cada caso a un motor de statevector vivo escrito a mano en el navegador o a un replay precomputado, todo renderizado por un solo renderer; y todo se publica como sitio estático sin backend. Cada corrida es función pura de (params, seed) — replay = verdad."}
        </p>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}
