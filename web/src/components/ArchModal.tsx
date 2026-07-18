import { type ReactElement, useEffect, useState } from "react";
import { useUI } from "../lib/ui";
import {
  AppLifecycleDiagram,
  DataContractDiagram,
  ScienceDiagram,
  ThreeLaneDiagram,
  WebAppFlowDiagram,
} from "../viz/diagrams";

interface Slide {
  id: string;
  label: { en: string; es: string };
  body: { en: string; es: string };
  diagram: (p: { lang: "en" | "es" }) => ReactElement;
}

// The five mandatory ADR-0058 tabs, in order. Never fewer.
const SLIDES: Slide[] = [
  {
    id: "app",
    label: { en: "The app + build", es: "La app + diseño" },
    body: {
      en: "What QLab is and how it was built. It is a static quantum-computing lab: 20 use-cases, each a real circuit run pitting a quantum method against an honest classical baseline. The design-build lifecycle runs left→right — research the algorithm and its equations into a fiche, implement it as a Problem plus Solver adapters, precompute (bake) every solver into a seeded JSON trace, build the SPA overlaying that data, and deploy to GitHub Pages — then iterate. The six pages are one workbench (App) plus five doc pages that illustrate the method with the same themed diagrams.",
      es: "Qué es QLab y cómo se construyó. Es un laboratorio cuántico estático: 20 casos, cada uno una ejecución real de un circuito que enfrenta un método cuántico contra una línea base clásica honesta. El ciclo de diseño-construcción va de izquierda→derecha — investigar el algoritmo y sus ecuaciones en una ficha, implementarlo como un Problem más adaptadores Solver, precomputar cada solver en una traza JSON con semilla, construir la SPA superponiendo esos datos y desplegar en GitHub Pages — y luego iterar. Las seis páginas son un banco de trabajo (App) más cinco páginas-doc que ilustran el método con los mismos diagramas temáticos.",
    },
    diagram: AppLifecycleDiagram,
  },
  {
    id: "lanes",
    label: { en: "Lanes — web/offline/compute", es: "Carriles — web/offline/cómputo" },
    body: {
      en: "Where every piece of work runs. The WEB lane re-simulates small clean unitary circuits live in the visitor's browser with a hand-written exact state-vector engine (Qiskit cannot run in the browser — no Pyodide wheels). The OFFLINE lane runs the real heavy engines (Qiskit+Aer, PennyLane, Cirq, Stim) in a local .venv whenever a case needs noise, feed-forward, an optimization loop or >12 qubits, and commits a seeded trace + manifest. The COMPUTE lane (dormant, opt-in, local-only) can replay a real QPU job. All three emit one artifact shape, so the static SPA animates any of them through a single render path — 'live' is slider-responsiveness, not a different model.",
      es: "Dónde se ejecuta cada pieza de trabajo. El carril WEB re-simula circuitos unitarios pequeños y limpios en vivo en el navegador con un motor de statevector exacto escrito a mano (Qiskit no puede ejecutarse en el navegador — sin wheels de Pyodide). El carril OFFLINE ejecuta los motores reales pesados (Qiskit+Aer, PennyLane, Cirq, Stim) en un .venv local cuando un caso necesita ruido, feed-forward, un loop de optimización o >12 qubits, y commitea una traza con semilla + manifiesto. El carril CÓMPUTO (inactivo, opcional, solo local) puede reproducir un trabajo de QPU real. Los tres emiten una sola forma de artefacto, así que la SPA estática anima cualquiera por un único render — 'vivo' es responder al slider, no otro modelo.",
    },
    diagram: ThreeLaneDiagram,
  },
  {
    id: "web",
    label: { en: "Web-app flow", es: "Flujo de la app web" },
    body: {
      en: "How the SPA works. In the App workbench the case selector and variant bar drive the view; moving a slider re-runs the engine live (liveTrace.ts) for live-eligible cases, otherwise it replays the committed trace with a step scrubber — both feed exactly one render path. At build time a prebuild step (copy-data.mjs) overlays the seeded traces and manifests into dist/, and a TypeScript mirror of the Python schema (contract.types.ts) gates the build so the web can never silently drift from the engine. The result is a single static bundle — no server, no database, no secrets — served by GitHub Pages with a 404.html deep-link fallback.",
      es: "Cómo funciona la SPA. En el banco de trabajo App, el selector de casos y la barra de variantes manejan la vista; mover un slider vuelve a ejecutar el motor en vivo (liveTrace.ts) para casos elegibles, si no reproduce la traza commiteada con un scrubber paso a paso — ambos alimentan un único render. En el build, un paso prebuild (copy-data.mjs) superpone las trazas y manifiestos con semilla en dist/, y un espejo TypeScript del esquema Python (contract.types.ts) controla el build para que la web no se desincronice del motor. El resultado es un único bundle estático — sin servidor, sin base de datos, sin secretos — servido por GitHub Pages con un fallback de deep-link 404.html.",
    },
    diagram: WebAppFlowDiagram,
  },
  {
    id: "science",
    label: { en: "The science", es: "La ciencia" },
    body: {
      en: "The actual methods, with their real equations. Interference is the one-qubit interferometer H·P(φ)·H, whose P(0)=cos²(φ/2) shows that amplitudes (not probabilities) combine and can cancel. QAOA alternates a cost layer C=Σ½(1−Z_uZ_v) and a mixer B=ΣX_i for p layers, a classical loop tuning (γ,β). Grover applies G=D·O (oracle then diffuser) for k*≈(π/4)√(N/M) iterations, a quadratic speedup. VQE minimizes ⟨ψ(θ)|H|ψ(θ)⟩≥E₀ on the real H₂ Hamiltonian. Every circuit solver funnels through one tracer (circuit_trace.py) with one seeded RNG, and every case bakes in the honest verdict: at lab scale the classical answer is usually trivial and optimal.",
      es: "Los métodos reales, con sus ecuaciones reales. La interferencia es el interferómetro de un qubit H·P(φ)·H, cuyo P(0)=cos²(φ/2) muestra que las amplitudes (no las probabilidades) se combinan y pueden cancelarse. QAOA alterna una capa de costo C=Σ½(1−Z_uZ_v) y un mezclador B=ΣX_i por p capas, con un loop clásico afinando (γ,β). Grover aplica G=D·O (oráculo y luego difusor) por k*≈(π/4)√(N/M) iteraciones, un speedup cuadrático. VQE minimiza ⟨ψ(θ)|H|ψ(θ)⟩≥E₀ sobre el Hamiltoniano real de H₂. Todo solver de circuito pasa por un trazador (circuit_trace.py) con un RNG con semilla, y cada caso incorpora el veredicto honesto: a escala de laboratorio la respuesta clásica suele ser trivial y óptima.",
    },
    diagram: ScienceDiagram,
  },
  {
    id: "data",
    label: { en: "Data contracts / design", es: "Contratos de datos / diseño" },
    body: {
      en: "How the system is designed to be correct. Two data contracts decouple the engine from the web: the artifact contract (qlab-trace/1) is a replayable recording — per step the full statevector, per qubit the Bloch vector and probabilities, and the final histogram, as plain JSON with no Qiskit type; the index contract (qlab-manifest/1) records the lane verdict, the seed/shots/params, the viz bindings and the provenance, and is the web's catalog. A TypeScript mirror gates the build. The lane is chosen by a measured gate (classify_lane): a case runs live only if qubits≤12, unitary-only, run_ms≤1500 and trace≤1 MB — the verdict and its numbers go into the manifest and CI fails the build on any mislabel.",
      es: "Cómo el sistema está diseñado para ser correcto. Dos contratos de datos desacoplan el motor de la web: el contrato de artefacto (qlab-trace/1) es una grabación reproducible — por paso el statevector completo, por qubit el vector de Bloch y las probabilidades, y el histograma final, como JSON plano sin tipo de Qiskit; el contrato de índice (qlab-manifest/1) registra el veredicto de carril, el seed/shots/params, los bindings de viz y la procedencia, y es el catálogo de la web. Un espejo TypeScript controla el build. El carril lo elige una compuerta medida (classify_lane): un caso se ejecuta en vivo solo si qubits≤12, solo-unitario, run_ms≤1500 y traza≤1 MB — el veredicto y sus números van al manifiesto y CI rompe el build ante cualquier mal etiquetado.",
    },
    diagram: DataContractDiagram,
  },
];

export function ArchModal({ onClose }: { onClose: () => void }) {
  const { lang } = useUI();
  const en = lang === "en";
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const slide = SLIDES[active];
  const Diagram = slide.diagram;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <strong>{en ? "How QLab works — architecture" : "Cómo funciona QLab — arquitectura"}</strong>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-tabs">
          {SLIDES.map((s, i) => (
            <button key={s.id} className={`modal-tab ${i === active ? "on" : ""}`} onClick={() => setActive(i)}>
              {s.label[lang]}
            </button>
          ))}
        </div>
        <div className="modal-body">
          <div className="arch-wrap"><Diagram lang={lang} /></div>
          <p>{slide.body[lang]}</p>
        </div>
      </div>
    </div>
  );
}
