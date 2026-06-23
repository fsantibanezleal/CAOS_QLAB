import { useEffect, useState } from "react";
import type { Catalog } from "../lib/contract.types";
import { loadCatalog } from "../lib/data";
import { useUI } from "../lib/ui";

/** The three-lane architecture diagram (browser-live · local-precompute · real-hardware → one contract → SPA). */
function ArchitectureSVG({ lang }: { lang: "en" | "es" }) {
  const en = lang === "en";
  return (
    <svg viewBox="0 0 760 300" className="arch-svg" role="img"
         aria-label={en ? "QLab three-lane architecture" : "Arquitectura de tres carriles de QLab"}>
      {/* lanes */}
      <g>
        <rect className="arch-box" x="14" y="20" width="190" height="62" rx="8" />
        <text className="arch-t" x="109" y="44" textAnchor="middle">{en ? "Browser — live lane" : "Navegador — carril vivo"}</text>
        <text className="arch-s" x="109" y="62" textAnchor="middle">quantum-circuit (JS) · ≤12 qubits</text>

        <rect className="arch-box arch-box-key" x="14" y="118" width="190" height="62" rx="8" />
        <text className="arch-t" x="109" y="142" textAnchor="middle">{en ? "Local — precompute" : "Local — precómputo"}</text>
        <text className="arch-s" x="109" y="160" textAnchor="middle">Qiskit·PennyLane·Cirq·Stim (.venv)</text>

        <rect className="arch-box arch-box-dim" x="14" y="216" width="190" height="62" rx="8" />
        <text className="arch-t arch-dim" x="109" y="240" textAnchor="middle">{en ? "Real hardware — replay" : "Hardware real — replay"}</text>
        <text className="arch-s arch-dim" x="109" y="258" textAnchor="middle">{en ? "IBM/Braket/Azure · dormant" : "IBM/Braket/Azure · inactivo"}</text>
      </g>
      {/* arrows to contract */}
      {[51, 149, 247].map((y, i) => (
        <path key={i} className="arch-arrow" d={`M204 ${y} L300 150`} markerEnd="url(#qa-arrow)" />
      ))}
      {/* contract */}
      <rect className="arch-contract" x="300" y="104" width="190" height="92" rx="10" />
      <text className="arch-t" x="395" y="132" textAnchor="middle">qlab-trace/1</text>
      <text className="arch-s" x="395" y="152" textAnchor="middle">{en ? "statevector · Bloch" : "vector · Bloch"}</text>
      <text className="arch-s" x="395" y="168" textAnchor="middle">{en ? "counts · seeded" : "conteos · con semilla"}</text>
      <text className="arch-s arch-em" x="395" y="186" textAnchor="middle">{en ? "replay = truth" : "replay = verdad"}</text>
      {/* arrow to SPA */}
      <path className="arch-arrow" d="M490 150 L556 150" markerEnd="url(#qa-arrow)" />
      {/* SPA */}
      <rect className="arch-spa" x="556" y="104" width="190" height="92" rx="10" />
      <text className="arch-t" x="651" y="138" textAnchor="middle">{en ? "Static SPA" : "SPA estática"}</text>
      <text className="arch-s" x="651" y="158" textAnchor="middle">React · GitHub Pages</text>
      <text className="arch-s" x="651" y="174" textAnchor="middle">{en ? "animates the trace" : "anima la traza"}</text>
      <defs>
        <marker id="qa-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" className="arch-arrowhead" />
        </marker>
      </defs>
    </svg>
  );
}

const FRAMEWORKS: { name: string; role: { en: string; es: string } }[] = [
  { name: "Qiskit + Aer", role: { en: "IBM's SDK + high-perf simulator — circuits, statevector, noise models.", es: "SDK de IBM + simulador de alto rendimiento — circuitos, statevector, modelos de ruido." } },
  { name: "PennyLane", role: { en: "Differentiable QC — the variational/QML methods (VQE, QAOA, quantum kernels).", es: "QC diferenciable — los métodos variacionales/QML (VQE, QAOA, kernels cuánticos)." } },
  { name: "Cirq", role: { en: "Google's SDK — a second independent circuit engine for cross-checks.", es: "SDK de Google — un segundo motor de circuitos independiente para validación cruzada." } },
  { name: "Stim + PyMatching", role: { en: "Clifford + decoder — error-correction at scale (repetition & surface codes).", es: "Clifford + decodificador — corrección de errores a escala (códigos de repetición y superficie)." } },
  { name: "NumPy / scikit-learn", role: { en: "The classical baselines — the spine: every quantum method is shown next to one.", es: "Los baselines clásicos — la columna: cada método cuántico se muestra junto a uno." } },
];

export function Introduction() {
  const { lang } = useUI();
  const en = lang === "en";
  const [cat, setCat] = useState<Catalog | null>(null);
  useEffect(() => { loadCatalog().then(setCat).catch(() => {}); }, []);

  const nCases = cat?.count ?? 19;
  const nVariants = cat?.cases.reduce((s, c) => s + c.variants.length, 0) ?? 113;

  return (
    <div className="page doc-page">
      <div className="page-head">
        <h1>{en ? "Introduction" : "Introducción"}</h1>
        <p className="lede">
          {en
            ? "QLab is a didactic quantum-computing laboratory: it runs the real frameworks on small problems, animates the quantum state, and — always — shows each quantum method next to the classical baseline that is still, today, more practical."
            : "QLab es un laboratorio didáctico de computación cuántica: corre los frameworks reales sobre problemas pequeños, anima el estado cuántico y — siempre — muestra cada método cuántico junto al baseline clásico que hoy sigue siendo más práctico."}
        </p>
      </div>

      <section className="doc-section">
        <div className="callout">
          <strong>{en ? "The honest frame (2025–2026)." : "El marco honesto (2025–2026)."}</strong>{" "}
          {en
            ? "Quantum computers are real, impressive scientific instruments — not yet useful computers. The best machines have ~50–156 high-quality qubits with two-qubit error near 10⁻³, so circuits drown in noise after at most a few thousand operations. Error correction crossed a genuine threshold (Google Willow, Dec 2024), but that was one logical qubit — ~8 orders of magnitude from breaking cryptography. Does a quantum computer beat a classical one at anything you'd pay for? Not yet."
            : "Las computadoras cuánticas son instrumentos científicos reales e impresionantes — todavía no computadoras útiles. Las mejores tienen ~50–156 qubits de buena calidad con error de dos qubits cercano a 10⁻³, así que los circuitos se ahogan en ruido tras a lo sumo unos miles de operaciones. La corrección de errores cruzó un umbral real (Google Willow, dic 2024), pero fue un qubit lógico — a ~8 órdenes de magnitud de romper criptografía. ¿Una computadora cuántica le gana a una clásica en algo que pagarías? Todavía no."}
          <br />
          <span className="callout-pt">
            {en
              ? "That sentence is the reason QLab exists, and the reason every case ships with a classical solver."
              : "Esa frase es la razón de existir de QLab, y la razón de que cada caso incluya un solver clásico."}
          </span>
        </div>
      </section>

      <section className="doc-section">
        <h2>{en ? "How it runs — three lanes, one contract" : "Cómo corre — tres carriles, un contrato"}</h2>
        <p>
          {en
            ? "A run is a pure function of (parameters, seed). The heavy real engines run offline in a local Python .venv (the precompute lane) and commit a seeded trace — a statevector + Bloch vectors + measurement counts per step. The static site never computes physics; it replays that trace. A lightweight browser lane re-simulates small circuits live, and a real-hardware lane (dormant until approved) replays jobs from IBM/Braket/Azure through the same contract."
            : "Una corrida es una función pura de (parámetros, semilla). Los motores reales pesados corren offline en un .venv local de Python (el carril de precómputo) y commitean una traza con semilla — un statevector + vectores de Bloch + conteos de medición por paso. El sitio estático nunca computa física; reproduce esa traza. Un carril liviano en el navegador re-simula circuitos pequeños en vivo, y un carril de hardware real (inactivo hasta aprobarse) reproduce trabajos de IBM/Braket/Azure por el mismo contrato."}
        </p>
        <div className="arch-wrap"><ArchitectureSVG lang={lang} /></div>
        <p className="fine">
          {en
            ? "The single contract is the point of the design: replay = truth. The same trace feeds the circuit diagram, the Bloch sphere, the histogram and the comparison panel — no recomputation, deterministic to screenshot."
            : "El contrato único es la clave del diseño: replay = verdad. La misma traza alimenta el diagrama de circuito, la esfera de Bloch, el histograma y el panel de comparación — sin recomputar, determinista para captura."}
        </p>
      </section>

      <section className="doc-section">
        <h2>{en ? "The frameworks it actually consumes" : "Los frameworks que realmente consume"}</h2>
        <p>
          {en
            ? "Solvers are thin adapters over real, dedicated frameworks (the Problem × Solver pattern). Adding a framework is one more adapter — not a rewrite."
            : "Los solvers son adaptadores delgados sobre frameworks reales y dedicados (el patrón Problem × Solver). Agregar un framework es un adaptador más — no una reescritura."}
        </p>
        <ul className="fw-list">
          {FRAMEWORKS.map((f) => (
            <li key={f.name}><strong>{f.name}</strong> — {en ? f.role.en : f.role.es}</li>
          ))}
        </ul>
      </section>

      <section className="doc-section">
        <h2>{en ? "What you can explore" : "Lo que puedes explorar"}</h2>
        <p>
          {en
            ? `${nCases} worked cases across all six families (${nVariants} committed variant traces), each solved end-to-end by a quantum solver and a classical baseline:`
            : `${nCases} casos resueltos en las seis familias (${nVariants} trazas de variante commiteadas), cada uno resuelto de extremo a extremo por un solver cuántico y un baseline clásico:`}
        </p>
        <div className="cat-grid">
          {[
            ["Fundamentals", "Fundamentos", en ? "single-qubit gates & the Bloch sphere · quantum RNG" : "compuertas de un qubit y la esfera de Bloch · RNG cuántico"],
            ["Entanglement", "Entrelazamiento", en ? "Bell/GHZ/W states · CHSH · teleportation · superdense coding" : "estados Bell/GHZ/W · CHSH · teleportación · codificación superdensa"],
            ["Oracle algorithms", "Algoritmos de oráculo", "Deutsch–Jozsa · Bernstein–Vazirani · Simon"],
            ["Flagship algorithms", "Algoritmos insignia", en ? "Grover · QFT · phase estimation · Shor (toy)" : "Grover · QFT · estimación de fase · Shor (juguete)"],
            ["Variational", "Variacionales", en ? "MaxCut (QAOA) · VQE (H₂) · quantum-kernel ML" : "MaxCut (QAOA) · VQE (H₂) · ML con kernel cuántico"],
            ["Noise & QEC", "Ruido y QEC", en ? "noise + ZNE mitigation · repetition & surface codes" : "ruido + mitigación ZNE · códigos de repetición y superficie"],
          ].map(([enT, esT, body]) => (
            <div key={enT} className="cat-card-mini">
              <strong>{en ? enT : esT}</strong>
              <span>{body}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2>{en ? "What this is — and is not" : "Qué es — y qué no es"}</h2>
        <div className="isnot">
          <div className="is">
            <span className="tag is-tag">{en ? "IS" : "ES"}</span>
            <p>{en
              ? "A teaching + workforce lab that runs the real frameworks on small problems, animates the quantum state, and honestly compares quantum to classical."
              : "Un laboratorio de enseñanza y formación que corre los frameworks reales sobre problemas pequeños, anima el estado cuántico y compara honestamente lo cuántico con lo clásico."}</p>
          </div>
          <div className="isnt">
            <span className="tag isnt-tag">{en ? "IS NOT" : "NO ES"}</span>
            <p>{en
              ? "A claim that quantum beats classical today (it does not, at these scales); a production quantum-advantage engine; a service that runs arbitrary circuits on hardware for you."
              : "Una afirmación de que lo cuántico le gana a lo clásico hoy (no lo hace, a estas escalas); un motor de ventaja cuántica en producción; un servicio que corre circuitos arbitrarios en hardware por ti."}</p>
          </div>
        </div>
      </section>

      <section className="doc-section refs">
        <h3>{en ? "Sources" : "Fuentes"}</h3>
        <ul className="fine">
          <li>Google Quantum AI, “Quantum error correction below the surface code threshold,” <em>Nature</em> 638 (2024). doi:10.1038/s41586-024-08449-y</li>
          <li>Preskill, “Quantum Computing in the NISQ era and beyond,” <em>Quantum</em> 2, 79 (2018). doi:10.22331/q-2018-08-06-79</li>
          <li>IBM Quantum roadmap (Starling 2029 / Blue Jay 2033+) — vendor roadmap, treated as aspirational.</li>
          <li>{en ? "Full sourced assessment: " : "Evaluación completa con fuentes: "}<code>docs/state-of-the-art.md</code></li>
        </ul>
      </section>
    </div>
  );
}
