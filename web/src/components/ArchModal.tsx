import { type ReactElement, useEffect, useState } from "react";
import { useUI } from "../lib/ui";
import {
  DeployDiagram,
  EngineDiagram,
  GateDiagram,
  ThreeLaneDiagram,
  TraceContractDiagram,
} from "../viz/diagrams";

interface Slide {
  id: string;
  label: { en: string; es: string };
  body: { en: string; es: string };
  diagram: (p: { lang: "en" | "es" }) => ReactElement;
}

const SLIDES: Slide[] = [
  {
    id: "lanes",
    label: { en: "Three lanes", es: "Tres carriles" },
    body: {
      en: "Where things run. A live lane re-simulates small circuits in your browser; a local precompute lane runs the real engines offline and commits a seeded trace; a dormant real-hardware lane can replay a QPU job. All three feed one trace contract the static SPA animates.",
      es: "Dónde corre cada cosa. Un carril vivo re-simula circuitos pequeños en tu navegador; un carril de precómputo local corre los motores reales offline y commitea una traza con semilla; un carril de hardware real (inactivo) puede reproducir un trabajo de QPU. Los tres alimentan un contrato de traza que la SPA estática anima.",
    },
    diagram: ThreeLaneDiagram,
  },
  {
    id: "engine",
    label: { en: "The engine", es: "El motor" },
    body: {
      en: "How it stays extensible. A Problem declares what to compute; Solver adapters wrap one real framework each; the registry attaches the applicable solvers and a single pipeline runs them. Adding a framework is one adapter — nothing in core, pipeline or web changes.",
      es: "Cómo se mantiene extensible. Un Problem declara qué computar; los adaptadores Solver envuelven un framework real cada uno; el registry engancha los solvers aplicables y un único pipeline los corre. Agregar un framework es un adaptador — nada en core, pipeline o web cambia.",
    },
    diagram: EngineDiagram,
  },
  {
    id: "trace",
    label: { en: "Trace contract", es: "Contrato de traza" },
    body: {
      en: "What flows between Python and the browser. Each step records the full statevector, the per-qubit Bloch vector and the probabilities, plus the measurement counts — as plain JSON with no Qiskit type. A TypeScript mirror keeps the web in lockstep; drift fails the build.",
      es: "Qué fluye entre Python y el navegador. Cada paso registra el statevector completo, el vector de Bloch por qubit y las probabilidades, más los conteos de medición — como JSON plano sin ningún tipo de Qiskit. Un espejo TypeScript mantiene la web sincronizada; la divergencia rompe el build.",
    },
    diagram: TraceContractDiagram,
  },
  {
    id: "gate",
    label: { en: "The measured gate", es: "La compuerta medida" },
    body: {
      en: "How live vs precompute is decided — by measurement, not taste. A case runs live only if it is ≤12 qubits, unitary-only, fast (≤1.5 s build) and small (≤1 MB trace). Otherwise it is precomputed and replayed. CI fails the build if a live-tagged case breaches a gate.",
      es: "Cómo se decide vivo vs precómputo — por medición, no por gusto. Un caso corre vivo solo si es ≤12 qubits, solo-unitario, rápido (≤1.5 s de build) y pequeño (traza ≤1 MB). Si no, se precomputa y se reproduce. CI rompe el build si un caso etiquetado vivo viola una compuerta.",
    },
    diagram: GateDiagram,
  },
  {
    id: "deploy",
    label: { en: "Deploy", es: "Deploy" },
    body: {
      en: "How it ships. The precompute lane commits traces to git; the Vite build overlays that data and emits a static bundle; GitHub Pages serves it from a CDN. No server, no database, no secrets in the published site.",
      es: "Cómo se publica. El carril de precómputo commitea trazas a git; el build de Vite superpone esos datos y emite un bundle estático; GitHub Pages lo sirve desde un CDN. Sin servidor, sin base de datos, sin secretos en el sitio publicado.",
    },
    diagram: DeployDiagram,
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
          <strong>{en ? "How QLab works" : "Cómo funciona QLab"}</strong>
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
