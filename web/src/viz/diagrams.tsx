// Shared themed architecture diagrams (ADR-0058). Used both inline on the doc pages and in the ⓘ modal.
// Every diagram styles via the .arch-* CSS tokens so it tracks light/dark automatically.

type Lang = "en" | "es";

function Arrowhead({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0 0 L6 3 L0 6 Z" className="arch-arrowhead" />
      </marker>
    </defs>
  );
}

/** Browser-live · local-precompute · dormant real-hardware → the qlab-trace contract → static SPA. */
export function ThreeLaneDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "qa-lane";
  return (
    <svg viewBox="0 0 760 300" className="arch-svg" role="img"
         aria-label={en ? "QLab three-lane architecture" : "Arquitectura de tres carriles"}>
      <rect className="arch-box" x="14" y="20" width="190" height="62" rx="8" />
      <text className="arch-t" x="109" y="44" textAnchor="middle">{en ? "Browser — live lane" : "Navegador — carril vivo"}</text>
      <text className="arch-s" x="109" y="62" textAnchor="middle">{en ? "exact state-vector (TS) · ≤12 q" : "statevector exacto (TS) · ≤12 q"}</text>
      <rect className="arch-box arch-box-key" x="14" y="118" width="190" height="62" rx="8" />
      <text className="arch-t" x="109" y="142" textAnchor="middle">{en ? "Local — precompute" : "Local — precómputo"}</text>
      <text className="arch-s" x="109" y="160" textAnchor="middle">Qiskit·PennyLane·Cirq·Stim</text>
      <rect className="arch-box arch-box-dim" x="14" y="216" width="190" height="62" rx="8" />
      <text className="arch-t arch-dim" x="109" y="240" textAnchor="middle">{en ? "Real hardware — replay" : "Hardware real — replay"}</text>
      <text className="arch-s arch-dim" x="109" y="258" textAnchor="middle">{en ? "IBM/Braket/Azure · dormant" : "IBM/Braket/Azure · inactivo"}</text>
      {[51, 149, 247].map((y, i) => <path key={i} className="arch-arrow" d={`M204 ${y} L300 150`} markerEnd={`url(#${m})`} />)}
      <rect className="arch-contract" x="300" y="104" width="190" height="92" rx="10" />
      <text className="arch-t" x="395" y="132" textAnchor="middle">qlab-trace/1</text>
      <text className="arch-s" x="395" y="152" textAnchor="middle">{en ? "statevector · Bloch" : "vector · Bloch"}</text>
      <text className="arch-s" x="395" y="168" textAnchor="middle">{en ? "counts · seeded" : "conteos · con semilla"}</text>
      <text className="arch-s arch-em" x="395" y="186" textAnchor="middle">{en ? "replay = truth" : "replay = verdad"}</text>
      <path className="arch-arrow" d="M490 150 L556 150" markerEnd={`url(#${m})`} />
      <rect className="arch-spa" x="556" y="104" width="190" height="92" rx="10" />
      <text className="arch-t" x="651" y="138" textAnchor="middle">{en ? "Static SPA" : "SPA estática"}</text>
      <text className="arch-s" x="651" y="158" textAnchor="middle">React · GitHub Pages</text>
      <text className="arch-s" x="651" y="174" textAnchor="middle">{en ? "animates the trace" : "anima la traza"}</text>
      <Arrowhead id={m} />
    </svg>
  );
}

/** Problem + Solver adapters → registry → single pipeline → trace bundle + manifest. */
export function EngineDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "qa-eng";
  return (
    <svg viewBox="0 0 760 230" className="arch-svg" role="img"
         aria-label={en ? "Problem × Solver engine flow" : "Flujo del motor Problem × Solver"}>
      <rect className="arch-box arch-box-key" x="12" y="18" width="186" height="48" rx="8" />
      <text className="arch-t" x="105" y="40" textAnchor="middle">Problem</text>
      <text className="arch-s" x="105" y="56" textAnchor="middle">{en ? "formulation · variants" : "formulación · variantes"}</text>
      <rect className="arch-box" x="12" y="92" width="186" height="62" rx="8" />
      <text className="arch-t" x="105" y="114" textAnchor="middle">{en ? "Solver adapters" : "Adaptadores Solver"}</text>
      <text className="arch-s" x="105" y="130" textAnchor="middle">Qiskit·PennyLane·Cirq</text>
      <text className="arch-s" x="105" y="144" textAnchor="middle">Stim · classical</text>
      <path className="arch-arrow" d="M198 42 L262 96" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M198 123 L262 110" markerEnd={`url(#${m})`} />
      <rect className="arch-box" x="262" y="80" width="150" height="48" rx="8" />
      <text className="arch-t" x="337" y="100" textAnchor="middle">registry</text>
      <text className="arch-s" x="337" y="116" textAnchor="middle">solvers_for(problem)</text>
      <path className="arch-arrow" d="M412 104 L470 104" markerEnd={`url(#${m})`} />
      <rect className="arch-contract" x="470" y="80" width="150" height="48" rx="8" />
      <text className="arch-t" x="545" y="100" textAnchor="middle">pipeline</text>
      <text className="arch-s" x="545" y="116" textAnchor="middle">{en ? "one execution path" : "un solo camino"}</text>
      <path className="arch-arrow" d="M545 128 L545 168" markerEnd={`url(#${m})`} />
      <rect className="arch-box" x="430" y="168" width="230" height="46" rx="8" />
      <text className="arch-t" x="545" y="188" textAnchor="middle">trace bundle + manifest</text>
      <text className="arch-s" x="545" y="204" textAnchor="middle">{en ? "uniform JSON · web renders it" : "JSON uniforme · la web lo renderiza"}</text>
      <Arrowhead id={m} />
    </svg>
  );
}

/** A circuit run → per-step record → JSON contract → TS mirror → the renderers. */
export function TraceContractDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "qa-trc";
  return (
    <svg viewBox="0 0 760 220" className="arch-svg" role="img"
         aria-label={en ? "Trace contract flow" : "Flujo del contrato de traza"}>
      <rect className="arch-box arch-box-key" x="12" y="86" width="150" height="48" rx="8" />
      <text className="arch-t" x="87" y="106" textAnchor="middle">{en ? "Circuit run" : "Corrida"}</text>
      <text className="arch-s" x="87" y="122" textAnchor="middle">{en ? "(params, seed)" : "(params, semilla)"}</text>
      <path className="arch-arrow" d="M162 110 L214 110" markerEnd={`url(#${m})`} />
      <rect className="arch-box" x="214" y="64" width="170" height="92" rx="8" />
      <text className="arch-t" x="299" y="86" textAnchor="middle">{en ? "Per step" : "Por paso"}</text>
      <text className="arch-s" x="299" y="106" textAnchor="middle">statevector (2ⁿ)</text>
      <text className="arch-s" x="299" y="122" textAnchor="middle">Bloch · probabilities</text>
      <text className="arch-s" x="299" y="138" textAnchor="middle">+ measurement counts</text>
      <path className="arch-arrow" d="M384 110 L436 110" markerEnd={`url(#${m})`} />
      <rect className="arch-contract" x="436" y="78" width="150" height="64" rx="8" />
      <text className="arch-t" x="511" y="100" textAnchor="middle">qlab-trace/1</text>
      <text className="arch-s" x="511" y="118" textAnchor="middle">{en ? "JSON · no Qiskit type" : "JSON · sin tipo Qiskit"}</text>
      <text className="arch-s arch-em" x="511" y="134" textAnchor="middle">{en ? "TS mirror (ADR-0057)" : "espejo TS (ADR-0057)"}</text>
      <path className="arch-arrow" d="M586 110 L638 110" markerEnd={`url(#${m})`} />
      <rect className="arch-spa" x="638" y="86" width="112" height="48" rx="8" />
      <text className="arch-t" x="694" y="106" textAnchor="middle">{en ? "Renderers" : "Renderers"}</text>
      <text className="arch-s" x="694" y="122" textAnchor="middle">{en ? "animate it" : "lo animan"}</text>
      <Arrowhead id={m} />
    </svg>
  );
}

/** The measured live/precompute gate: four conditions decide the lane. */
export function GateDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "qa-gate";
  return (
    <svg viewBox="0 0 760 240" className="arch-svg" role="img"
         aria-label={en ? "Live vs precompute gate" : "Compuerta vivo vs precómputo"}>
      <rect className="arch-box arch-box-key" x="250" y="14" width="260" height="86" rx="8" />
      <text className="arch-t" x="380" y="36" textAnchor="middle">{en ? "classify_lane — all four?" : "classify_lane — ¿las cuatro?"}</text>
      <text className="arch-s" x="380" y="55" textAnchor="middle">qubits ≤ 12 · unitary-only</text>
      <text className="arch-s" x="380" y="71" textAnchor="middle">run_ms ≤ 1500 · trace ≤ 1 MB</text>
      <text className="arch-s arch-em" x="380" y="90" textAnchor="middle">{en ? "measured, not guessed" : "medido, no adivinado"}</text>
      <path className="arch-arrow" d="M320 100 L210 150" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M440 100 L550 150" markerEnd={`url(#${m})`} />
      <text className="arch-s arch-em" x="250" y="128" textAnchor="middle">{en ? "all hold" : "todas"}</text>
      <text className="arch-s" x="512" y="128" textAnchor="middle">{en ? "any fails" : "falla una"}</text>
      <rect className="arch-box" x="96" y="150" width="220" height="56" rx="8" style={{ stroke: "#3fb950" }} />
      <text className="arch-t" x="206" y="174" textAnchor="middle" style={{ fill: "#3fb950" }}>LIVE</text>
      <text className="arch-s" x="206" y="192" textAnchor="middle">{en ? "in-browser re-sim" : "re-sim en navegador"}</text>
      <rect className="arch-box" x="444" y="150" width="220" height="56" rx="8" />
      <text className="arch-t arch-em" x="554" y="174" textAnchor="middle">PRECOMPUTE</text>
      <text className="arch-s" x="554" y="192" textAnchor="middle">{en ? "committed trace, replayed" : "traza commiteada, replay"}</text>
      <Arrowhead id={m} />
    </svg>
  );
}

/** Static deploy: precompute commits traces → Vite build overlays data → GitHub Pages → browser. */
export function DeployDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "qa-dep";
  const boxes = [
    { x: 12, key: true, t: ".venv precompute", s: en ? "traces + manifests" : "trazas + manifiestos" },
    { x: 198, key: false, t: "git", s: en ? "committed JSON" : "JSON commiteado" },
    { x: 384, key: false, t: "Vite build", s: en ? "+ data overlay" : "+ overlay de datos" },
    { x: 570, key: false, t: "GitHub Pages", s: en ? "static · CDN" : "estático · CDN" },
  ];
  return (
    <svg viewBox="0 0 760 150" className="arch-svg" role="img"
         aria-label={en ? "Static deploy flow" : "Flujo de deploy estático"}>
      {boxes.map((b, i) => (
        <g key={i}>
          <rect className={`arch-box ${b.key ? "arch-box-key" : ""}`} x={b.x} y="46" width="160" height="58" rx="8" />
          <text className="arch-t" x={b.x + 80} y="70" textAnchor="middle">{b.t}</text>
          <text className="arch-s" x={b.x + 80} y="88" textAnchor="middle">{b.s}</text>
          {i < boxes.length - 1 && <path className="arch-arrow" d={`M${b.x + 160} 75 L${b.x + 186} 75`} markerEnd={`url(#${m})`} />}
        </g>
      ))}
      <Arrowhead id={m} />
    </svg>
  );
}
