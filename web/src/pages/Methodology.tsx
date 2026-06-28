import { type ReactNode } from "react";
import { Eq, type TabDef, Tabs } from "../components/Tabs";
import { Refs } from "../lib/citations";
import { useUI } from "../lib/ui";

type Lang = "en" | "es";

/* ──────────────────────────────────────────────────────────────────────────
   The honest scope callout — exactly one per method tab (ADR-0017 §2). Uses the
   shell .callout token (theme-aware), with a bold quantum-vs-classical verdict.
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
   to a CSS var (zero hex); labels are real domain flows, not filler.
   ════════════════════════════════════════════════════════════════════════ */

/** H builds superposition; CNOT after it builds the Bell pair |Φ⁺⟩ — and the
 *  per-qubit Bloch vectors collapse to the origin (the entanglement signature). */
function BellDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <svg viewBox="0 0 760 230" className="arch-svg" role="img"
         aria-label={en ? "Bell-pair circuit and the Bloch collapse" : "Circuito del par de Bell y colapso de Bloch"}>
      <defs><Head id="m-bell" /></defs>
      {/* circuit */}
      <text className="arch-t" x="14" y="22">{en ? "Circuit: H₀ then CNOT(0→1)" : "Circuito: H₀ luego CNOT(0→1)"}</text>
      <line className="circ-wire" x1="40" y1="56" x2="300" y2="56" />
      <line className="circ-wire" x1="40" y1="100" x2="300" y2="100" />
      <text className="circ-qlabel" x="18" y="60">q₀</text>
      <text className="circ-qlabel" x="18" y="104">q₁</text>
      {/* H on q0 */}
      <rect className="circ-box" x="78" y="40" width="32" height="32" rx="4" />
      <text className="circ-glabel" x="94" y="61" textAnchor="middle">H</text>
      {/* CNOT */}
      <line className="circ-link" x1="200" y1="56" x2="200" y2="100" />
      <circle className="circ-ctrl" cx="200" cy="56" r="5" />
      <circle className="circ-target-o" cx="200" cy="100" r="11" />
      <line className="circ-plus" x1="200" y1="91" x2="200" y2="109" />
      <line className="circ-plus" x1="191" y1="100" x2="209" y2="100" />
      <text className="arch-s" x="170" y="138" textAnchor="middle">{en ? "|00⟩ → |Φ⁺⟩" : "|00⟩ → |Φ⁺⟩"}</text>

      {/* two Bloch spheres: collapse to origin */}
      <text className="arch-t" x="420" y="22">{en ? "Per-qubit Bloch vectors" : "Vectores de Bloch por qubit"}</text>
      <circle cx="470" cy="110" r="54" className="bloch-outline" />
      <ellipse cx="470" cy="110" rx="54" ry="18" className="bloch-equator" />
      <line x1="470" y1="56" x2="470" y2="164" className="bloch-axis" />
      <circle cx="470" cy="110" r="5" className="bloch-vhead" />
      <text className="arch-s" x="470" y="190" textAnchor="middle">q₀: |r|→0</text>

      <circle cx="640" cy="110" r="54" className="bloch-outline" />
      <ellipse cx="640" cy="110" rx="54" ry="18" className="bloch-equator" />
      <line x1="640" y1="56" x2="640" y2="164" className="bloch-axis" />
      <circle cx="640" cy="110" r="5" className="bloch-vhead" />
      <text className="arch-s" x="640" y="190" textAnchor="middle">q₁: |r|→0</text>
      <text className="arch-em" x="555" y="214" textAnchor="middle">{en ? "pure global state, maximally mixed parts = entanglement" : "estado global puro, partes máximamente mezcladas = entrelazamiento"}</text>
    </svg>
  );
}

/** The Hadamard sandwich + phase oracle that powers BV / Deutsch–Jozsa: the
 *  ancilla in |−⟩ turns a bit-flip into a phase (kickback); final H interferes. */
function OracleDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <svg viewBox="0 0 760 230" className="arch-svg" role="img"
         aria-label={en ? "Phase-kickback oracle sandwich" : "Sándwich de oráculo con phase kickback"}>
      <defs><Head id="m-or" /></defs>
      {/* input register */}
      <line className="circ-wire" x1="60" y1="60" x2="700" y2="60" />
      <line className="circ-wire" x1="60" y1="96" x2="700" y2="96" />
      <text className="circ-qlabel" x="18" y="64">|0⟩ⁿ</text>
      <line className="circ-wire" x1="60" y1="150" x2="700" y2="150" />
      <text className="circ-qlabel" x="18" y="154">|1⟩</text>
      {/* H^n */}
      <rect className="circ-box" x="96" y="44" width="34" height="68" rx="4" />
      <text className="circ-glabel" x="113" y="84" textAnchor="middle">Hⁿ</text>
      {/* ancilla H */}
      <rect className="circ-box" x="96" y="134" width="34" height="32" rx="4" />
      <text className="circ-glabel" x="113" y="155" textAnchor="middle">H</text>
      {/* oracle */}
      <rect className="arch-contract" x="300" y="40" width="120" height="130" rx="8" />
      <text className="arch-t" x="360" y="98" textAnchor="middle">Uf</text>
      <text className="arch-s" x="360" y="118" textAnchor="middle">{en ? "phase" : "fase"} (−1)^f(x)</text>
      {/* final H^n */}
      <rect className="circ-box" x="560" y="44" width="34" height="68" rx="4" />
      <text className="circ-glabel" x="577" y="84" textAnchor="middle">Hⁿ</text>
      {/* measurement */}
      <rect className="circ-box" x="640" y="44" width="44" height="68" rx="4" />
      <text className="circ-glabel sm" x="662" y="83" textAnchor="middle">{en ? "read" : "lee"}</text>
      <text className="arch-em" x="200" y="206" textAnchor="middle">{en ? "uniform superposition" : "superposición uniforme"}</text>
      <text className="arch-em" x="500" y="206" textAnchor="middle">{en ? "interference → answer in 1 query" : "interferencia → respuesta en 1 consulta"}</text>
    </svg>
  );
}

/** QPE: counting register in superposition, controlled-U^{2^j} write the phase
 *  ramp by kickback, inverse QFT focuses it onto a bitstring m → φ̂ = m/2ᵗ. */
function QpeDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <svg viewBox="0 0 760 240" className="arch-svg" role="img"
         aria-label={en ? "Quantum phase estimation flow" : "Flujo de estimación de fase cuántica"}>
      <defs><Head id="m-qpe" /></defs>
      <rect className="arch-box arch-box-key" x="14" y="40" width="160" height="62" rx="8" />
      <text className="arch-t" x="94" y="64" textAnchor="middle">{en ? "t counting qubits" : "t qubits de conteo"}</text>
      <text className="arch-s" x="94" y="84" textAnchor="middle">Hᵗ → superposition</text>
      <rect className="arch-box" x="14" y="138" width="160" height="62" rx="8" />
      <text className="arch-t" x="94" y="162" textAnchor="middle">{en ? "eigenstate |ψ⟩" : "autoestado |ψ⟩"}</text>
      <text className="arch-s" x="94" y="182" textAnchor="middle">U|ψ⟩=e²ᵖⁱᵠ|ψ⟩</text>

      <path className="arch-arrow" d="M174 71 L250 110" markerEnd="url(#m-qpe)" />
      <path className="arch-arrow" d="M174 169 L250 130" markerEnd="url(#m-qpe)" />
      <rect className="arch-contract" x="250" y="86" width="180" height="68" rx="8" />
      <text className="arch-t" x="340" y="110" textAnchor="middle">{en ? "controlled-U^{2ʲ}" : "U^{2ʲ} controlada"}</text>
      <text className="arch-s" x="340" y="130" textAnchor="middle">{en ? "writes phase ramp" : "escribe rampa de fase"}</text>
      <text className="arch-s arch-em" x="340" y="146" textAnchor="middle">{en ? "by kickback" : "por kickback"}</text>

      <path className="arch-arrow" d="M430 120 L490 120" markerEnd="url(#m-qpe)" />
      <rect className="arch-box" x="490" y="86" width="120" height="68" rx="8" />
      <text className="arch-t" x="550" y="116" textAnchor="middle">QFT⁻¹</text>
      <text className="arch-s" x="550" y="136" textAnchor="middle">{en ? "ramp → m" : "rampa → m"}</text>

      <path className="arch-arrow" d="M610 120 L668 120" markerEnd="url(#m-qpe)" />
      <rect className="arch-spa" x="668" y="86" width="84" height="68" rx="8" />
      <text className="arch-t" x="710" y="112" textAnchor="middle">φ̂</text>
      <text className="arch-s" x="710" y="132" textAnchor="middle">= m/2ᵗ</text>
      <text className="arch-s" x="380" y="224" textAnchor="middle">{en ? "Shor = QPE on the modular-multiply unitary U_a (order finding)" : "Shor = QPE sobre el unitario de multiplicación modular U_a (búsqueda de orden)"}</text>
    </svg>
  );
}

/** QAOA hybrid loop: a depth-p ansatz alternates cost & mixer; a classical
 *  optimizer climbs F(γ,β); the most-probable bitstring is the proposed cut. */
function QaoaDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <svg viewBox="0 0 760 240" className="arch-svg" role="img"
         aria-label={en ? "QAOA hybrid optimization loop" : "Bucle híbrido de optimización QAOA"}>
      <defs><Head id="m-qaoa" /></defs>
      <rect className="arch-box arch-box-key" x="18" y="44" width="150" height="62" rx="8" />
      <text className="arch-t" x="93" y="68" textAnchor="middle">|+⟩ⁿ</text>
      <text className="arch-s" x="93" y="88" textAnchor="middle">Hⁿ|0⟩ⁿ</text>
      <path className="arch-arrow" d="M168 75 L228 75" markerEnd="url(#m-qaoa)" />
      <rect className="arch-contract" x="228" y="40" width="130" height="70" rx="8" />
      <text className="arch-t" x="293" y="64" textAnchor="middle">e^{"−iγH_C"}</text>
      <text className="arch-s" x="293" y="84" textAnchor="middle">{en ? "cost phase" : "fase de costo"}</text>
      <text className="arch-s" x="293" y="100" textAnchor="middle">× p {en ? "layers" : "capas"}</text>
      <path className="arch-arrow" d="M358 75 L418 75" markerEnd="url(#m-qaoa)" />
      <rect className="arch-contract" x="418" y="40" width="130" height="70" rx="8" />
      <text className="arch-t" x="483" y="64" textAnchor="middle">e^{"−iβH_M"}</text>
      <text className="arch-s" x="483" y="84" textAnchor="middle">{en ? "mixer" : "mezclador"}</text>
      <path className="arch-arrow" d="M548 75 L608 75" markerEnd="url(#m-qaoa)" />
      <rect className="arch-box" x="608" y="44" width="134" height="62" rx="8" />
      <text className="arch-t" x="675" y="68" textAnchor="middle">{en ? "measure ⟨H_C⟩" : "medir ⟨H_C⟩"}</text>
      <text className="arch-s" x="675" y="88" textAnchor="middle">F(γ,β)</text>
      {/* classical optimizer feedback */}
      <path className="arch-arrow" d="M675 106 L675 170 L293 170 L293 110" markerEnd="url(#m-qaoa)" />
      <rect className="arch-box arch-box-dim" x="300" y="150" width="368" height="40" rx="8" />
      <text className="arch-t" x="484" y="174" textAnchor="middle">{en ? "classical optimizer tunes (γ,β) — grid 24×24 = 576 evals" : "optimizador clásico ajusta (γ,β) — grilla 24×24 = 576 evals"}</text>
      <text className="arch-em" x="380" y="220" textAnchor="middle">{en ? "argmax bitstring = proposed cut" : "bitstring argmax = corte propuesto"}</text>
    </svg>
  );
}

/** VQE: a 1-parameter ansatz (HF + DoubleExcitation θ) lowered onto a smooth
 *  energy well; the variational principle floors it at E₀. */
function VqeDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  // a single smooth energy well E(θ), with E0 floor line
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = -Math.PI + (2 * Math.PI * i) / 60;
    const e = -1.137 + 0.34 * (1 - Math.cos(t)); // toy well, min at t=0
    const x = 80 + (i / 60) * 580;
    const y = 40 + (e + 1.137) * 150; // map energy → y
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 760 230" className="arch-svg" role="img"
         aria-label={en ? "VQE energy landscape and the variational floor" : "Paisaje de energía VQE y el piso variacional"}>
      <defs><Head id="m-vqe" /></defs>
      {/* axes */}
      <line className="bloch-axis" x1="80" y1="40" x2="80" y2="190" />
      <line className="bloch-axis" x1="80" y1="190" x2="680" y2="190" />
      <text className="viz-axis" x="60" y="44">E</text>
      <text className="viz-axis" x="664" y="206">θ</text>
      <text className="viz-axis" x="370" y="206" textAnchor="middle">−π … 0 … π</text>
      {/* E0 floor */}
      <line className="zne-ideal" x1="80" y1="40" x2="680" y2="40" />
      <text className="zne-label" x="86" y="36">E₀ (FCI) — variational floor: E(θ) ≥ E₀</text>
      {/* energy curve */}
      <polyline points={pts.join(" ")} className="zne-fit" fill="none" />
      {/* the VQE minimum marker */}
      <circle className="zne-mitig" cx="380" cy="40" r="6" />
      <text className="arch-em" x="392" y="44">min_θ E(θ) → chemical accuracy</text>
      <text className="arch-s" x="380" y="222" textAnchor="middle">{en ? "H₂ / STO-3G · 4 qubits · HF + DoubleExcitation(θ) · 100-pt θ scan" : "H₂ / STO-3G · 4 qubits · HF + DoubleExcitation(θ) · barrido de 100 pts en θ"}</text>
    </svg>
  );
}

/** QML: a 2-qubit feature map embeds x; the fidelity kernel K(x,x') feeds a
 *  classical SVM — and is benchmarked against a classical RBF kernel. */
function QmlDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <svg viewBox="0 0 760 220" className="arch-svg" role="img"
         aria-label={en ? "Quantum-kernel pipeline" : "Pipeline de kernel cuántico"}>
      <defs><Head id="m-qml" /></defs>
      <rect className="arch-box arch-box-key" x="14" y="80" width="140" height="58" rx="8" />
      <text className="arch-t" x="84" y="104" textAnchor="middle">x ∈ ℝ²</text>
      <text className="arch-s" x="84" y="124" textAnchor="middle">{en ? "2-D points" : "puntos 2-D"}</text>
      <path className="arch-arrow" d="M154 109 L210 109" markerEnd="url(#m-qml)" />
      <rect className="arch-contract" x="210" y="74" width="160" height="70" rx="8" />
      <text className="arch-t" x="290" y="98" textAnchor="middle">{en ? "feature map" : "mapa de características"}</text>
      <text className="arch-s" x="290" y="118" textAnchor="middle">φ(x): angle + IsingZZ</text>
      <text className="arch-s arch-em" x="290" y="134" textAnchor="middle">{en ? "2 qubits" : "2 qubits"}</text>
      <path className="arch-arrow" d="M370 109 L426 109" markerEnd="url(#m-qml)" />
      <rect className="arch-box" x="426" y="74" width="150" height="70" rx="8" />
      <text className="arch-t" x="501" y="98" textAnchor="middle">K(x,x′)</text>
      <text className="arch-s" x="501" y="118" textAnchor="middle">|⟨φ(x)|φ(x′)⟩|²</text>
      <text className="arch-s" x="501" y="134" textAnchor="middle">{en ? "fidelity Gram" : "Gram de fidelidad"}</text>
      <path className="arch-arrow" d="M576 109 L632 109" markerEnd="url(#m-qml)" />
      <rect className="arch-box" x="632" y="74" width="116" height="70" rx="8" />
      <text className="arch-t" x="690" y="104" textAnchor="middle">SVM</text>
      <text className="arch-s" x="690" y="124" textAnchor="middle">precomputed</text>
      <text className="arch-s arch-em" x="290" y="38" textAnchor="middle">{en ? "benchmarked against classical RBF-SVM on identical data" : "comparado con SVM-RBF clásico sobre los mismos datos"}</text>
      <line className="arch-arrow" x1="290" y1="46" x2="290" y2="72" markerEnd="url(#m-qml)" />
    </svg>
  );
}

/** ZNE vs QEC: mitigation extrapolates ⟨O⟩(λ) to λ=0 (bias reduction); QEC
 *  drives logical error down with code distance below threshold. */
function QecDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <svg viewBox="0 0 760 240" className="arch-svg" role="img"
         aria-label={en ? "ZNE extrapolation and the QEC threshold" : "Extrapolación ZNE y el umbral de QEC"}>
      <defs><Head id="m-qec" /></defs>
      {/* left: ZNE */}
      <text className="arch-t" x="40" y="24">{en ? "Mitigation — ZNE" : "Mitigación — ZNE"}</text>
      <line className="bloch-axis" x1="40" y1="40" x2="40" y2="180" />
      <line className="bloch-axis" x1="40" y1="180" x2="320" y2="180" />
      <text className="viz-axis" x="20" y="48">⟨O⟩</text>
      <text className="viz-axis" x="300" y="196">λ</text>
      {/* data points falling with λ, fit back to λ=0 */}
      <line className="zne-fit" x1="40" y1="56" x2="300" y2="150" />
      <circle className="zne-pt" cx="120" cy="92" r="5" />
      <circle className="zne-pt" cx="200" cy="121" r="5" />
      <circle className="zne-pt" cx="280" cy="143" r="5" />
      <circle className="zne-mitig" cx="40" cy="56" r="6" />
      <text className="zne-label" x="48" y="52">E₀ {en ? "(extrapolated)" : "(extrapolado)"}</text>
      <text className="arch-s" x="120" y="200" textAnchor="middle">λ=1</text>
      <text className="arch-s" x="200" y="200" textAnchor="middle">λ=3</text>
      <text className="arch-s" x="280" y="200" textAnchor="middle">λ=5</text>
      <text className="arch-em" x="180" y="224" textAnchor="middle">{en ? "bias reduction, NOT correction" : "reducción de sesgo, NO corrección"}</text>

      {/* right: QEC threshold crossover */}
      <text className="arch-t" x="440" y="24">{en ? "Correction — surface-code threshold" : "Corrección — umbral del código de superficie"}</text>
      <line className="bloch-axis" x1="440" y1="40" x2="440" y2="180" />
      <line className="bloch-axis" x1="440" y1="180" x2="730" y2="180" />
      <text className="viz-axis" x="416" y="48">p_L</text>
      <text className="viz-axis" x="712" y="196">p</text>
      {/* d=3 line */}
      <polyline points="455,150 540,120 620,86 700,60" className="zne-ideal" fill="none" />
      <text className="arch-s" x="704" y="58">d=3</text>
      {/* d=5 line (crosses below threshold, steeper above) */}
      <polyline points="455,168 540,128 620,72 700,40" className="zne-fit" fill="none" />
      <text className="arch-em" x="704" y="40">d=5</text>
      {/* threshold marker */}
      <line className="bloch-axis" x1="565" y1="40" x2="565" y2="180" />
      <text className="zne-label" x="568" y="54">p_th</text>
      <text className="arch-em" x="500" y="118" textAnchor="middle" transform="rotate(-30 500 118)">{en ? "below: d↑ helps" : "abajo: d↑ ayuda"}</text>
      <text className="arch-s" x="585" y="224" textAnchor="middle">{en ? "above threshold: more qubits = more failure" : "sobre el umbral: más qubits = más fallos"}</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   The page.
   ════════════════════════════════════════════════════════════════════════ */
export function Methodology() {
  const { lang } = useUI();
  const en = lang === "en";
  const refLabel = en ? "References" : "Referencias";

  const tabs: TabDef[] = [
    /* ─────────────────────────── 1 · Gates & entanglement ──────────────── */
    {
      id: "gates",
      label: en ? "Gates & entanglement" : "Compuertas y entrelazamiento",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "Everything QLab runs is built from two primitives: single-qubit rotations and one two-qubit entangler. A pure single-qubit state is a point on the Bloch sphere |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩, whose three coordinates are exactly the Pauli expectation values (⟨X⟩, ⟨Y⟩, ⟨Z⟩); for a pure state |r| = 1, so the state sits on the sphere, and a gate U is the corresponding rigid rotation of that vector. The build's gate set is X, Y, Z (π-rotations about the axes), H (a pole → the equator), S and T (Z-rotations adding phase π/2 and π/4), and the continuous RX, RY, RZ. The committed single-qubit traces verify each landing exactly: X → (0,0,−1) = |1⟩, H → (1,0,0) = |+⟩, H·S → (0,1,0) = |+i⟩, RY(π/3) → (0.866, 0, 0.5)."
              : "Todo lo que corre QLab se construye con dos primitivas: rotaciones de un qubit y un único entrelazador de dos qubits. Un estado puro de un qubit es un punto en la esfera de Bloch |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩, cuyas tres coordenadas son justamente los valores esperados de Pauli (⟨X⟩, ⟨Y⟩, ⟨Z⟩); para un estado puro |r| = 1, así que el estado está sobre la esfera, y una compuerta U es la rotación rígida correspondiente de ese vector. El conjunto de compuertas del build es X, Y, Z (rotaciones π sobre los ejes), H (un polo → el ecuador), S y T (rotaciones-Z que añaden fase π/2 y π/4), y las continuas RX, RY, RZ. Las trazas commiteadas de un qubit verifican cada destino exacto: X → (0,0,−1) = |1⟩, H → (1,0,0) = |+⟩, H·S → (0,1,0) = |+i⟩, RY(π/3) → (0.866, 0, 0.5)."}
          </p>
          <Eq
            tex={String.raw`U=\tfrac{1}{\sqrt2}\!\begin{bmatrix}1&1\\1&-1\end{bmatrix}\!\equiv H,\qquad \mathbf r=(\langle X\rangle,\langle Y\rangle,\langle Z\rangle),\ \ \lvert\mathbf r\rvert=1\ \text{(pure)}`}
            caption={{
              en: "The Hadamard, and the Bloch vector as the triple of Pauli expectation values — pure states sit on the unit sphere, mixed states inside it.",
              es: "La Hadamard, y el vector de Bloch como la terna de valores esperados de Pauli — los estados puros están en la esfera unitaria, los mixtos dentro.",
            }}
          />
          <p>
            {en
              ? "Entanglement is the second resource, and it needs exactly one two-qubit gate. The build constructs the four Bell states from |00⟩: a Hadamard on qubit 0 followed by CNOT(0→1) gives |Φ⁺⟩; a Z on qubit 0 flips it to |Φ⁻⟩, and an X on qubit 1 maps the Φ family to the Ψ family. The committed traces sample 2048 shots at seed 42 and verify the perfect correlations: |Φ⁺⟩ returns only 00 and 11 at 0.5 each, |Ψ⁺⟩ only 01 and 10, never the cross terms. The hallmark to watch on the App is structural — after the CNOT the per-qubit Bloch vectors shrink toward the origin: each qubit becomes maximally mixed even though the global two-qubit state stays pure. That impossibility (pure whole, mixed parts) is precisely what 'cannot be factored into independent qubit states' means."
              : "El entrelazamiento es el segundo recurso, y necesita exactamente una compuerta de dos qubits. El build construye los cuatro estados de Bell desde |00⟩: una Hadamard en el qubit 0 seguida de CNOT(0→1) da |Φ⁺⟩; una Z en el qubit 0 lo invierte a |Φ⁻⟩, y una X en el qubit 1 lleva la familia Φ a la familia Ψ. Las trazas commiteadas muestrean 2048 shots con semilla 42 y verifican las correlaciones perfectas: |Φ⁺⟩ devuelve solo 00 y 11 al 0.5 cada uno, |Ψ⁺⟩ solo 01 y 10, nunca los términos cruzados. La señal a observar en la App es estructural — tras la CNOT los vectores de Bloch por qubit se encogen hacia el origen: cada qubit se vuelve máximamente mezclado aunque el estado global de dos qubits siga puro. Esa imposibilidad (todo puro, partes mezcladas) es exactamente lo que significa 'no se puede factorizar en estados de qubits independientes'."}
          </p>
          <Eq
            tex={String.raw`\lvert\Phi^\pm\rangle=\tfrac{\lvert00\rangle\pm\lvert11\rangle}{\sqrt2},\quad \lvert\Psi^\pm\rangle=\tfrac{\lvert01\rangle\pm\lvert10\rangle}{\sqrt2},\quad \lvert\Phi^+\rangle=\mathrm{CNOT}\,(H\otimes I)\lvert00\rangle`}
            caption={{
              en: "The four maximally-entangled Bell states and the exact construction of |Φ⁺⟩ — the entanglement primitive every later case reuses.",
              es: "Los cuatro estados de Bell máximamente entrelazados y la construcción exacta de |Φ⁺⟩ — la primitiva de entrelazamiento que reutiliza cada caso posterior.",
            }}
          />
          <div className="fig-svg wide"><BellDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "H₀ then CNOT(0→1) turns |00⟩ into the Bell pair; the per-qubit Bloch vectors collapse to the origin — the entanglement signature (pure whole, maximally-mixed parts)."
              : "H₀ luego CNOT(0→1) convierte |00⟩ en el par de Bell; los vectores de Bloch por qubit colapsan al origen — la firma del entrelazamiento (todo puro, partes máximamente mezcladas)."}</p>
          </div>
          <p>
            {en
              ? "QLab scales the idea to three qubits, where there are two inequivalent species. The GHZ state (|000⟩+|111⟩)/√2 is maximal but fragile — measuring one qubit destroys all the entanglement — while the W state (|001⟩+|010⟩+|100⟩)/√3 is robust and survives the loss of a qubit. The Dür–Vidal–Cirac result proves these cannot be converted into one another by local operations and classical communication, so they are genuinely distinct resources, not two descriptions of the same thing. Both run live: GHZ-3 returns only 000 and 111, W-3 returns 001/010/100 at 1/3 each — exactly the structure the build claims."
              : "QLab escala la idea a tres qubits, donde existen dos especies no equivalentes. El estado GHZ (|000⟩+|111⟩)/√2 es máximo pero frágil — medir un qubit destruye todo el entrelazamiento — mientras que el estado W (|001⟩+|010⟩+|100⟩)/√3 es robusto y sobrevive la pérdida de un qubit. El resultado de Dür–Vidal–Cirac prueba que no pueden convertirse uno en otro por operaciones locales y comunicación clásica, así que son recursos genuinamente distintos, no dos descripciones de lo mismo. Ambos corren en vivo: GHZ-3 devuelve solo 000 y 111, W-3 devuelve 001/010/100 a 1/3 cada uno — exactamente la estructura que afirma el build."}
          </p>
          <Callout
            title={en ? "Quantum vs classical —" : "Cuántico vs clásico —"}
            pt={en
              ? "Entanglement is the concept these cases teach, the foundation everything else builds on — not a speedup."
              : "El entrelazamiento es el concepto que enseñan estos casos, la base sobre la que se construye todo lo demás — no una aceleración."}>
            {en
              ? "at 2–4 qubits a classical computer simply writes the 2ⁿ amplitude vector down — instantly and exactly — so there is no advantage here. By Holevo's bound one qubit also stores no more retrievable classical information than one bit."
              : "con 2–4 qubits una computadora clásica simplemente escribe el vector de 2ⁿ amplitudes — al instante y exacto — así que aquí no hay ventaja. Por la cota de Holevo un qubit tampoco almacena más información clásica recuperable que un bit."}
          </Callout>
          <Refs ids={["nielsen2010", "dvc2000", "holevo1973", "epr1935"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────────── 2 · Oracle algorithms ─────────────────── */
    {
      id: "oracle",
      label: en ? "Oracle algorithms" : "Algoritmos de oráculo",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "The oracle algorithms are the cleanest demonstrations of interference, and the family where a genuine — if query-model — separation first appears. An oracle encodes an unknown function f as a phase: with the answer qubit (ancilla) prepared in |−⟩, the oracle's bit-flip becomes a sign on the input branch (phase kickback), so Uf maps |x⟩|−⟩ → (−1)^{f(x)}|x⟩|−⟩. Sandwiching the oracle between two layers of Hadamards then converts those invisible phases into a definite, readable bitstring through interference. The build implements each oracle as real CNOTs (no pre-encoded answer) and runs them live on n+1 ≤ 7 qubits."
              : "Los algoritmos de oráculo son las demostraciones más limpias de interferencia, y la familia donde aparece por primera vez una separación genuina — aunque del modelo de consultas. Un oráculo codifica una función desconocida f como fase: con el qubit de respuesta (ancilla) preparado en |−⟩, el bit-flip del oráculo se vuelve un signo en la rama de entrada (phase kickback), así que Uf lleva |x⟩|−⟩ → (−1)^{f(x)}|x⟩|−⟩. Encajar el oráculo entre dos capas de Hadamards convierte esas fases invisibles en un bitstring definido y legible mediante interferencia. El build implementa cada oráculo con CNOTs reales (sin respuesta pre-codificada) y los corre en vivo sobre n+1 ≤ 7 qubits."}
          </p>
          <Eq
            tex={String.raw`U_f\lvert x\rangle\lvert-\rangle=(-1)^{f(x)}\lvert x\rangle\lvert-\rangle,\qquad H^{\otimes n}\Bigl(2^{-n/2}\!\sum_x(-1)^{s\cdot x}\lvert x\rangle\Bigr)=\lvert s\rangle`}
            caption={{
              en: "Phase kickback (left) and the Bernstein–Vazirani interference identity (right): a single Hadamard sandwich reads the hidden string s in ONE query.",
              es: "Phase kickback (izq.) y la identidad de interferencia de Bernstein–Vazirani (der.): un solo sándwich de Hadamards lee la cadena oculta s en UNA consulta.",
            }}
          />
          <div className="fig-svg wide"><OracleDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "The Hadamard sandwich: H^n builds the uniform superposition, the phase oracle Uf stamps (−1)^{f(x)}, and a final H^n interferes the branches into the answer."
              : "El sándwich de Hadamards: H^n construye la superposición uniforme, el oráculo de fase Uf estampa (−1)^{f(x)}, y un H^n final interfiere las ramas hacia la respuesta."}</p>
          </div>
          <p>
            {en
              ? "Bernstein–Vazirani hides a string s inside f(x) = s·x mod 2 and recovers it in a single quantum query, where any classical algorithm needs n (one per bit). The build runs strings of 3–6 bits and recovers each deterministically — s=101, s=0111, …, s=111111 — the histogram collapsing from uniform to a single spike at s. Deutsch–Jozsa is the sibling promise problem: f is promised constant or balanced, and one query plus interference decides which (the amplitude on |0…0⟩ is 2^{−n}Σ(−1)^{f(x)} — exactly 1 for constant, exactly 0 for balanced). A deterministic classical algorithm may need 2ⁿ⁻¹+1 queries to be certain — the historical first exponential query separation."
              : "Bernstein–Vazirani esconde una cadena s dentro de f(x) = s·x mod 2 y la recupera en una sola consulta cuántica, donde cualquier algoritmo clásico necesita n (una por bit). El build corre cadenas de 3–6 bits y recupera cada una de forma determinista — s=101, s=0111, …, s=111111 — el histograma colapsa de uniforme a un único pico en s. Deutsch–Jozsa es el problema-promesa hermano: f se promete constante o balanceada, y una consulta más interferencia decide cuál (la amplitud en |0…0⟩ es 2^{−n}Σ(−1)^{f(x)} — exactamente 1 para constante, exactamente 0 para balanceada). Un algoritmo clásico determinista puede necesitar 2ⁿ⁻¹+1 consultas para estar seguro — la primera separación exponencial de consultas de la historia."}
          </p>
          <Eq
            tex={String.raw`\text{amp}(0^n)=2^{-n}\!\sum_x(-1)^{f(x)}=\begin{cases}\pm1 & f\ \text{constant}\\[2pt]0 & f\ \text{balanced}\end{cases},\qquad y\cdot s\equiv0\ (\mathrm{mod}\,2)`}
            caption={{
              en: "Deutsch–Jozsa's all-zeros amplitude decides constant vs balanced in one query; Simon's runs each yield a y orthogonal to the hidden period s.",
              es: "La amplitud de todos-ceros de Deutsch–Jozsa decide constante vs balanceada en una consulta; cada corrida de Simon entrega un y ortogonal al período oculto s.",
            }}
          />
          <p>
            {en
              ? "Simon's algorithm is the bridge to Shor. Its oracle is 2-to-1 with a hidden period s (f(x) = f(x⊕s)); each run yields a random y with y·s ≡ 0 (mod 2), and about n−1 independent y's pin s down uniquely by Gaussian elimination over GF(2). It needs O(n) quantum queries versus ~O(2^{n/2}) classical collision search — the first provably exponential separation, and the direct conceptual ancestor of Shor's period-finding. The build runs n=2–3 (4–6 qubits), reads the input-register marginal, and solves GF(2) for the unique non-zero s; the classical baseline hunts for a collision instead."
              : "El algoritmo de Simon es el puente hacia Shor. Su oráculo es 2-a-1 con un período oculto s (f(x) = f(x⊕s)); cada corrida entrega un y aleatorio con y·s ≡ 0 (mod 2), y unos n−1 y's independientes fijan s de forma única por eliminación gaussiana sobre GF(2). Necesita O(n) consultas cuánticas frente a ~O(2^{n/2}) de búsqueda de colisiones clásica — la primera separación exponencial demostrable, y el ancestro conceptual directo de la búsqueda de orden de Shor. El build corre n=2–3 (4–6 qubits), lee la marginal del registro de entrada y resuelve GF(2) para el único s no nulo; el baseline clásico busca una colisión en su lugar."}
          </p>
          <Callout
            title={en ? "Quantum vs classical —" : "Cuántico vs clásico —"}
            pt={en
              ? "These are real query-complexity separations — but they live in the oracle model, on contrived problems, not tasks you would pay for."
              : "Son separaciones reales de complejidad de consultas — pero viven en el modelo de oráculo, en problemas artificiales, no tareas que pagarías."}>
            {en
              ? "BV needs 1 query vs n classical; Deutsch–Jozsa 1 vs up to 2ⁿ⁻¹+1; Simon O(n) vs ~2^{n/2}. At the sizes a browser can run, the classical wall-time is still instant — what they teach honestly is interference and phase kickback, not a practical speedup."
              : "BV necesita 1 consulta vs n clásicas; Deutsch–Jozsa 1 vs hasta 2ⁿ⁻¹+1; Simon O(n) vs ~2^{n/2}. A los tamaños que un navegador puede correr, el tiempo clásico sigue siendo instantáneo — lo que enseñan honestamente es interferencia y phase kickback, no una aceleración práctica."}
          </Callout>
          <Refs ids={["bernstein1997", "deutsch1992", "simon1997", "nielsen2010"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────────── 3 · QFT / QPE / Shor ──────────────────── */
    {
      id: "qft",
      label: "QFT · QPE · Shor",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "The quantum Fourier transform is the change of basis at the heart of the famous speedups. It sends a basis state |k⟩ to a phase-ramp superposition QFT|k⟩ = (1/√N)Σ e^{2πi kj/N}|j⟩, built circuit-by-circuit from one Hadamard per qubit, a ladder of controlled-phase rotations CP(π/2^{t−c}), and bit-reversal swaps — O(n²) gates total. The build self-validates each run against the analytic DFT |u[j]| = (1/√N)e^{2πikj/N} (both sign conventions) and reports the fidelity, which is 1.000 across every committed variant (n=3 and n=4, 7–14 gates). The honest catch is in the output: a measurement returns one sample, so the transformed amplitudes are unreadable — the QFT is exponentially cheap to apply but cannot replace a classical FFT, which returns the full readable spectrum in O(n·2ⁿ)."
              : "La transformada cuántica de Fourier es el cambio de base en el corazón de las aceleraciones famosas. Envía un estado base |k⟩ a una superposición de rampa de fase QFT|k⟩ = (1/√N)Σ e^{2πi kj/N}|j⟩, construida circuito a circuito con una Hadamard por qubit, una escalera de rotaciones de fase controladas CP(π/2^{t−c}), y swaps de inversión de bits — O(n²) compuertas en total. El build autovalida cada corrida contra la DFT analítica |u[j]| = (1/√N)e^{2πikj/N} (ambas convenciones de signo) y reporta la fidelidad, que es 1.000 en cada variante commiteada (n=3 y n=4, 7–14 compuertas). El truco honesto está en la salida: una medición devuelve una muestra, así que las amplitudes transformadas no son legibles — la QFT es exponencialmente barata de aplicar pero no reemplaza un FFT clásico, que devuelve el espectro legible completo en O(n·2ⁿ)."}
          </p>
          <Eq
            tex={String.raw`\mathrm{QFT}\,\lvert k\rangle=\tfrac{1}{\sqrt N}\sum_{j=0}^{N-1}e^{2\pi i\,kj/N}\lvert j\rangle,\qquad N=2^n,\ \ O(n^2)\ \text{gates}`}
            caption={{
              en: "The QFT maps a basis state to a uniform-magnitude phase ramp whose slope encodes k — applied in O(n²) gates vs the FFT's O(n·2ⁿ), but unreadable in one measurement.",
              es: "La QFT mapea un estado base a una rampa de fase de magnitud uniforme cuya pendiente codifica k — aplicada en O(n²) compuertas vs O(n·2ⁿ) del FFT, pero ilegible en una medición.",
            }}
          />
          <p>
            {en
              ? "Quantum phase estimation is the QFT's first real application: given a unitary U and an eigenstate |ψ⟩ with U|ψ⟩ = e^{2πiφ}|ψ⟩, it reads the eigenphase φ. With t counting qubits in superposition, controlled-U^{2^j} writes the phase ramp e^{2πiφ2^j} onto counting qubit j by kickback, and an inverse QFT focuses that ramp onto a bitstring m, giving φ̂ = m/2ᵗ at resolution 2^{−t}. The build uses U = P(2πφ) with eigenstate |1⟩ so the true φ is known and the estimate verifiable. The committed traces show both regimes exactly: the exact cases (φ = 1/4, 5/8, 3/16) land with probability 1.00, while the finite-precision cases (φ = 0.3, 0.8, 0.1) land on the nearest m/2ᵗ bin with the textbook dominant probability (0.58–0.88) and the rest spread over neighbors."
              : "La estimación cuántica de fase es la primera aplicación real de la QFT: dado un unitario U y un autoestado |ψ⟩ con U|ψ⟩ = e^{2πiφ}|ψ⟩, lee la fase propia φ. Con t qubits de conteo en superposición, U^{2^j} controlada escribe la rampa de fase e^{2πiφ2^j} en el qubit de conteo j por kickback, y una QFT inversa enfoca esa rampa en un bitstring m, dando φ̂ = m/2ᵗ con resolución 2^{−t}. El build usa U = P(2πφ) con autoestado |1⟩ de modo que la φ verdadera es conocida y la estimación verificable. Las trazas commiteadas muestran ambos regímenes exactos: los casos exactos (φ = 1/4, 5/8, 3/16) caen con probabilidad 1.00, mientras que los de precisión finita (φ = 0.3, 0.8, 0.1) caen en el bin m/2ᵗ más cercano con la probabilidad dominante de libro (0.58–0.88) y el resto repartido en vecinos."}
          </p>
          <Eq
            tex={String.raw`U\lvert\psi\rangle=e^{2\pi i\varphi}\lvert\psi\rangle\ \xrightarrow{\ \text{QPE}\ }\ \hat\varphi=\tfrac{m}{2^{t}},\qquad U_a\lvert y\rangle=\lvert a\,y\bmod N\rangle\ \Rightarrow\ e^{2\pi i s/r}`}
            caption={{
              en: "QPE reads φ to t bits; Shor is QPE on the modular-multiply unitary U_a, whose eigenphases s/r give the order r, then factors via gcd(a^{r/2}±1, N).",
              es: "QPE lee φ con t bits; Shor es QPE sobre el unitario de multiplicación modular U_a, cuyas fases propias s/r dan el orden r, luego factoriza vía gcd(a^{r/2}±1, N).",
            }}
          />
          <div className="fig-svg wide"><QpeDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "QPE: counting qubits in superposition, controlled-U^{2ʲ} write the phase ramp by kickback, the inverse QFT focuses it onto m → φ̂ = m/2ᵗ. Shor applies this to U_a."
              : "QPE: qubits de conteo en superposición, U^{2ʲ} controlada escribe la rampa de fase por kickback, la QFT inversa la enfoca en m → φ̂ = m/2ᵗ. Shor lo aplica a U_a."}</p>
          </div>
          <p>
            {en
              ? "Shor's factoring is QPE applied to order-finding. It reduces factoring N to finding the multiplicative order r of a base a (the smallest r with aʳ ≡ 1 mod N): QPE on the modular-multiplication unitary U_a|y⟩ = |a·y mod N⟩ yields a phase ≈ s/r, continued fractions recover r, and the factors fall out of gcd(a^{r/2}±1, N) when r is even and a^{r/2} ≢ −1. The build runs the real order-finding for N=15 across bases a ∈ {2,4,7,8,11,13}, constructing U_a as a genuine 16×16 permutation unitary and its controlled powers — recovering r = 2 or 4 and factoring 15 = 3×5 on all six (base 14 is excluded because 14 ≡ −1 yields only the trivial factor)."
              : "La factorización de Shor es QPE aplicada a la búsqueda de orden. Reduce factorizar N a hallar el orden multiplicativo r de una base a (el menor r con aʳ ≡ 1 mod N): QPE sobre el unitario de multiplicación modular U_a|y⟩ = |a·y mod N⟩ entrega una fase ≈ s/r, las fracciones continuas recuperan r, y los factores salen de gcd(a^{r/2}±1, N) cuando r es par y a^{r/2} ≢ −1. El build corre la búsqueda de orden real para N=15 en las bases a ∈ {2,4,7,8,11,13}, construyendo U_a como un unitario de permutación 16×16 genuino y sus potencias controladas — recuperando r = 2 o 4 y factorizando 15 = 3×5 en las seis (la base 14 se excluye porque 14 ≡ −1 da solo el factor trivial)."}
          </p>
          <Callout
            title={en ? "Quantum vs classical —" : "Cuántico vs clásico —"}
            pt={en
              ? "'Quantum breaks encryption soon' is not supported by the resource numbers; harvest-now-decrypt-later is a real policy concern, not a near-term capability."
              : "'Lo cuántico rompe la criptografía pronto' no lo respaldan los números de recursos; cosechar-ahora-descifrar-después es una preocupación de política real, no una capacidad cercana."}>
            {en
              ? "the QFT is unreadable in one shot, QPE is finite-precision, and order-finding genuinely works — but factoring 15 is trivial classically, and a cryptographically relevant Shor (RSA-2048) needs on the order of 10⁶ noisy physical qubits plus full fault tolerance (Gidney 2025), three-to-four orders beyond today's ~100-qubit machines."
              : "la QFT es ilegible de un tiro, QPE es de precisión finita, y la búsqueda de orden sí funciona — pero factorizar 15 es trivial clásicamente, y un Shor criptográficamente relevante (RSA-2048) necesita del orden de 10⁶ qubits físicos ruidosos más tolerancia a fallos completa (Gidney 2025), tres-a-cuatro órdenes más allá de las máquinas de ~100 qubits de hoy."}
          </Callout>
          <Refs ids={["coppersmith1994", "kitaev1995", "shor1997", "gidney2025", "nielsen2010"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────────── 4 · Grover ────────────────────────────── */
    {
      id: "grover",
      label: en ? "Grover search" : "Búsqueda de Grover",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "Grover's search is the most broadly applicable quantum algorithm, because 'find the marked item in an unstructured set' hides inside countless problems. Given only an oracle that recognizes a marked item w among N = 2ⁿ items, it finds one in ~(π/4)√(N/M) oracle queries (M = number marked), against the classical ~N/2 average scan — the famous quadratic speedup. The build implements the real oracle (a phase flip |w⟩ → −|w⟩) and the real diffuser (inversion about the mean, H^n X^n MCZ X^n H^n), and runs it live so the iteration count itself is an exposed control."
              : "La búsqueda de Grover es el algoritmo cuántico más ampliamente aplicable, porque 'encontrar el ítem marcado en un conjunto sin estructura' se esconde en innumerables problemas. Dado solo un oráculo que reconoce un ítem marcado w entre N = 2ⁿ ítems, encuentra uno en ~(π/4)√(N/M) consultas (M = número de marcados), frente al barrido clásico promedio ~N/2 — la famosa aceleración cuadrática. El build implementa el oráculo real (un flip de fase |w⟩ → −|w⟩) y el difusor real (inversión sobre la media, H^n X^n MCZ X^n H^n), y lo corre en vivo para que el conteo de iteraciones sea un control expuesto."}
          </p>
          <Eq
            tex={String.raw`G=D\cdot O,\qquad \sin\theta=\sqrt{M/N},\qquad P_{\text{marked}}(k)=\sin^2\!\bigl((2k+1)\theta\bigr)`}
            caption={{
              en: "One Grover iteration G = diffuser·oracle is a rotation by 2θ in the marked/unmarked plane; after k iterations the marked probability is sin²((2k+1)θ).",
              es: "Una iteración de Grover G = difusor·oráculo es una rotación por 2θ en el plano marcado/no-marcado; tras k iteraciones la probabilidad marcada es sin²((2k+1)θ).",
            }}
          />
          <p>
            {en
              ? "Geometrically, one Grover iteration G = D·O is a rotation by 2θ in the 2-D plane spanned by the uniform marked and unmarked states, where sin θ = √(M/N). After k iterations the marked amplitude is sin((2k+1)θ), so the success probability rises, peaks, and — crucially — turns back down if you over-rotate. The optimal stopping point is k* = round((π/2 − θ)/(2θ)) ≈ (π/4)√(N/M). The committed traces reproduce the exact textbook values: N=4, M=1 is exact in one iteration (P = 1.000); N=8 reaches 0.945 at k=2; N=16 reaches 0.961 at k=3; a two-marked N=8 case hits 1.000 in a single iteration."
              : "Geométricamente, una iteración de Grover G = D·O es una rotación por 2θ en el plano 2-D generado por los estados uniformes marcado y no-marcado, donde sin θ = √(M/N). Tras k iteraciones la amplitud marcada es sin((2k+1)θ), así que la probabilidad de éxito sube, llega al máximo, y — crucialmente — vuelve a bajar si te sobre-rotas. El punto óptimo de parada es k* = round((π/2 − θ)/(2θ)) ≈ (π/4)√(N/M). Las trazas commiteadas reproducen los valores exactos de libro: N=4, M=1 es exacto en una iteración (P = 1.000); N=8 alcanza 0.945 en k=2; N=16 alcanza 0.961 en k=3; un caso N=8 de dos marcados llega a 1.000 en una sola iteración."}
          </p>
          <Eq
            tex={String.raw`k^*=\operatorname{round}\!\left(\frac{\pi/2-\theta}{2\theta}\right)\approx\frac{\pi}{4}\sqrt{\frac{N}{M}}`}
            caption={{
              en: "The optimal iteration count — run past k* and the marked amplitude falls back (the over-rotation you can watch live on the App).",
              es: "El conteo óptimo de iteraciones — pásate de k* y la amplitud marcada vuelve a caer (la sobre-rotación que puedes ver en vivo en la App).",
            }}
          />
          <p>
            {en
              ? "On the App the trace is stepped per iteration: the marked-state amplitude bar grows while the others shrink, and the diffuser visibly reflects every amplitude about its average ('inversion about the mean'). Pushing the iteration count past k* in the live lane lets you watch the amplitude over-rotate and fall — the failure mode Grover is famous for, and a knob that is a real engine input, not a label. The classical baseline scans items in random order until it hits a marked one, recording its query count beside Grover's."
              : "En la App la traza se recorre por iteración: la barra de amplitud del estado marcado crece mientras las demás se encogen, y el difusor refleja visiblemente cada amplitud sobre su promedio ('inversión sobre la media'). Empujar el conteo de iteraciones más allá de k* en el carril vivo permite ver la amplitud sobre-rotar y caer — el modo de falla por el que Grover es famoso, y una perilla que es entrada real del motor, no una etiqueta. El baseline clásico recorre ítems en orden aleatorio hasta dar con uno marcado, registrando su conteo de consultas junto al de Grover."}
          </p>
          <Callout
            title={en ? "Quantum vs classical —" : "Cuántico vs clásico —"}
            pt={en
              ? "Grover teaches amplitude amplification; the advantage shows only at scales far beyond what NISQ hardware can run noiselessly."
              : "Grover enseña amplificación de amplitud; la ventaja aparece solo a escalas mucho más allá de lo que el hardware NISQ puede correr sin ruido."}>
            {en
              ? "the quadratic ~√N vs classical ~N/2 is a real and broadly useful asymptotic — but at the tiny N a browser can simulate, the classical scan is still instant and cheaper in wall-time."
              : "el cuadrático ~√N vs ~N/2 clásico es una asintótica real y ampliamente útil — pero a la N pequeña que un navegador puede simular, el barrido clásico sigue siendo instantáneo y más barato en tiempo."}
          </Callout>
          <Refs ids={["grover1996", "nielsen2010"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────────── 5 · QAOA (learned) ────────────────────── */
    {
      id: "qaoa",
      label: "QAOA",
      badge: en ? "learned" : "aprendido",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "The Quantum Approximate Optimization Algorithm is the first of QLab's learned methods: a hybrid loop where a parameterized quantum circuit is tuned by a classical optimizer. The build attacks MaxCut — partition a graph's vertices into two sets to maximize the edges crossing the partition — which is NP-hard in general and the canonical QAOA benchmark. The cut value is encoded as a cost Hamiltonian H_C summing ½(1 − Z_u Z_v) over edges, and QAOA prepares a depth-p ansatz that alternates a cost-phase e^{−iγH_C} and a mixer e^{−iβH_M} (H_M = ΣX_i) on the uniform superposition."
              : "El Algoritmo de Optimización Aproximada Cuántica es el primero de los métodos aprendidos de QLab: un bucle híbrido donde un circuito cuántico parametrizado es ajustado por un optimizador clásico. El build ataca MaxCut — partir los vértices de un grafo en dos conjuntos para maximizar las aristas que cruzan la partición — que es NP-difícil en general y el benchmark canónico de QAOA. El valor del corte se codifica como un Hamiltoniano de costo H_C que suma ½(1 − Z_u Z_v) sobre las aristas, y QAOA prepara un ansatz de profundidad p que alterna una fase de costo e^{−iγH_C} y un mezclador e^{−iβH_M} (H_M = ΣX_i) sobre la superposición uniforme."}
          </p>
          <Eq
            tex={String.raw`H_C=\!\!\sum_{(u,v)\in E}\!\!\tfrac{1-Z_uZ_v}{2},\qquad \lvert\gamma,\beta\rangle=e^{-i\beta H_M}e^{-i\gamma H_C}\,H^{\otimes n}\lvert0\rangle^{\otimes n}`}
            caption={{
              en: "The MaxCut cost Hamiltonian and the depth-1 QAOA ansatz: a cost phase then a mixer rotation on the uniform superposition (H_M = ΣX_i).",
              es: "El Hamiltoniano de costo de MaxCut y el ansatz QAOA de profundidad 1: una fase de costo y luego una rotación de mezcla sobre la superposición uniforme (H_M = ΣX_i).",
            }}
          />
          <p>
            {en
              ? "The classical optimizer tunes the angles (γ, β) to maximize the measured cost F(γ,β) = ⟨γ,β|H_C|γ,β⟩, and the proposed cut is read off the most-probable bitstring. The build runs p=1 with an exact statevector grid-search over (γ,β) — a deterministic 24×24 = 576-evaluation sweep — so the energy landscape on the App is the real, committed grid, not a cartoon. This is what 'learned' means here: there are no fixed gate angles; the angles are trained against a measured objective, and the (γ,β) landscape is the optimization surface the algorithm climbs."
              : "El optimizador clásico ajusta los ángulos (γ, β) para maximizar el costo medido F(γ,β) = ⟨γ,β|H_C|γ,β⟩, y el corte propuesto se lee del bitstring más probable. El build corre p=1 con una búsqueda exacta en grilla sobre (γ,β) por statevector — un barrido determinista de 24×24 = 576 evaluaciones — así que el paisaje de energía en la App es la grilla real commiteada, no una caricatura. Esto es lo que significa 'aprendido' aquí: no hay ángulos de compuerta fijos; los ángulos se entrenan contra un objetivo medido, y el paisaje (γ,β) es la superficie de optimización que el algoritmo escala."}
          </p>
          <Eq
            tex={String.raw`(\gamma^*,\beta^*)=\arg\max_{\gamma,\beta}\ F(\gamma,\beta),\qquad F(\gamma,\beta)=\langle\gamma,\beta\rvert H_C\lvert\gamma,\beta\rangle`}
            caption={{
              en: "The variational objective QAOA trains: the classical optimizer maximizes the measured cost over (γ,β); QLab grid-searches 576 points exactly.",
              es: "El objetivo variacional que entrena QAOA: el optimizador clásico maximiza el costo medido sobre (γ,β); QLab busca en grilla 576 puntos exactos.",
            }}
          />
          <div className="fig-svg wide"><QaoaDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "The QAOA hybrid loop: cost-phase and mixer build the ansatz, the measured ⟨H_C⟩ feeds a classical optimizer that tunes (γ,β); the argmax bitstring is the proposed cut."
              : "El bucle híbrido de QAOA: fase de costo y mezclador construyen el ansatz, el ⟨H_C⟩ medido alimenta un optimizador clásico que ajusta (γ,β); el bitstring argmax es el corte propuesto."}</p>
          </div>
          <p>
            {en
              ? "Across the build's six graphs — triangle (frustrated odd cycle, max cut 2), square (fully cuttable, 4), square-diag, bowtie, pentagon, and a 6-node 3-regular prism (max cut 7) — all three quantum frameworks (Qiskit, PennyLane, Cirq) reproduce the optimal cut on every graph, a genuine three-way cross-check where disagreement would be a bug. They use 3–6 qubits and 576 evaluations each (~150–1300 ms), versus brute force's exact optimum in microseconds. The (γ,β) landscape on the App shows how shallow and broad the optimum is at p=1 — the structural reason low-depth QAOA struggles."
              : "En los seis grafos del build — triángulo (ciclo impar frustrado, corte máx 2), cuadrado (totalmente cortable, 4), cuadrado-diag, corbatín, pentágono, y un prisma 3-regular de 6 nodos (corte máx 7) — los tres frameworks cuánticos (Qiskit, PennyLane, Cirq) reproducen el corte óptimo en cada grafo, un cross-check de tres vías genuino donde un desacuerdo sería un bug. Usan 3–6 qubits y 576 evaluaciones cada uno (~150–1300 ms), frente al óptimo exacto de fuerza bruta en microsegundos. El paisaje (γ,β) en la App muestra qué tan plano y ancho es el óptimo en p=1 — la razón estructural por la que QAOA de baja profundidad tiene dificultades."}
          </p>
          <Callout
            title={en ? "Quantum vs classical —" : "Cuántico vs clásico —"}
            pt={en
              ? "QAOA is a research/teaching object, not a solver, at this scale — the expected NISQ result."
              : "QAOA es un objeto de investigación/enseñanza, no un solver, a esta escala — el resultado NISQ esperado."}>
            {en
              ? "exact brute force returns the optimal cut in microseconds, and Goemans–Williamson guarantees a 0.878× SDP approximation; QAOA (p=1) matches but never beats them, at far higher cost. The literature (Barak & Marwaha) shows simple classical algorithms beat low-depth QAOA on these graph families."
              : "la fuerza bruta exacta da el corte óptimo en microsegundos, y Goemans–Williamson garantiza una aproximación SDP de 0.878×; QAOA (p=1) los iguala pero nunca los supera, a mucho mayor costo. La literatura (Barak & Marwaha) muestra que algoritmos clásicos simples superan a QAOA de baja profundidad en estas familias de grafos."}
          </Callout>
          <Refs ids={["farhi2014", "goemans1995", "barak2021", "pennylane2018"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────────── 6 · VQE (learned) ─────────────────────── */
    {
      id: "vqe",
      label: "VQE",
      badge: en ? "learned" : "aprendido",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "The Variational Quantum Eigensolver is QLab's second learned method and its quantum-chemistry case: it finds a molecule's ground-state energy by training a parameterized ansatz to minimize the measured energy expectation. The build runs the real hydrogen molecule H₂ across six bond lengths. Its Hamiltonian is the actual electronic Hamiltonian of H₂ in the STO-3G minimal basis, built by PennyLane's differentiable Hartree–Fock (no external chemistry backend) and Jordan–Wigner mapped to 4 qubits. The ansatz is the Hartree–Fock reference |1100⟩ plus a single DoubleExcitation(θ) — the one excitation that captures H₂'s correlation — so there is exactly one trainable parameter."
              : "El Solucionador Variacional Cuántico de Autovalores es el segundo método aprendido de QLab y su caso de química cuántica: halla la energía del estado fundamental de una molécula entrenando un ansatz parametrizado para minimizar el valor esperado de la energía medida. El build corre la molécula real de hidrógeno H₂ en seis distancias de enlace. Su Hamiltoniano es el Hamiltoniano electrónico real de H₂ en la base mínima STO-3G, construido por el Hartree–Fock diferenciable de PennyLane (sin backend de química externo) y mapeado por Jordan–Wigner a 4 qubits. El ansatz es la referencia de Hartree–Fock |1100⟩ más una única DoubleExcitation(θ) — la excitación que captura la correlación de H₂ — así que hay exactamente un parámetro entrenable."}
          </p>
          <Eq
            tex={String.raw`E(\theta)=\langle\psi(\theta)\rvert H\lvert\psi(\theta)\rangle\ \ge\ E_0,\qquad \lvert\psi(\theta)\rangle=\mathrm{DoubleExcitation}(\theta)\,\lvert\mathrm{HF}\rangle`}
            caption={{
              en: "The variational principle floors the energy at E₀ for any θ; the H₂ ansatz is the Hartree–Fock state plus one DoubleExcitation angle.",
              es: "El principio variacional acota la energía por E₀ para cualquier θ; el ansatz de H₂ es el estado de Hartree–Fock más un ángulo DoubleExcitation.",
            }}
          />
          <p>
            {en
              ? "The variational principle guarantees ⟨ψ(θ)|H|ψ(θ)⟩ ≥ E₀ for any θ — so the estimate can never dip below the true ground energy, and the minimum over θ is a rigorous upper bound. The build scans θ ∈ [−π, π] over 100 deterministic points and takes the minimum, then compares to the exact ground energy from diagonalizing the 16×16 Hamiltonian (full configuration interaction in this basis). This is the honest check: a learned method, but with a classically computable ground truth to grade it against."
              : "El principio variacional garantiza ⟨ψ(θ)|H|ψ(θ)⟩ ≥ E₀ para cualquier θ — así que la estimación nunca baja de la energía fundamental real, y el mínimo sobre θ es una cota superior rigurosa. El build barre θ ∈ [−π, π] en 100 puntos deterministas y toma el mínimo, luego lo compara con la energía fundamental exacta de diagonalizar el Hamiltoniano 16×16 (interacción de configuraciones completa en esta base). Esta es la verificación honesta: un método aprendido, pero con una verdad fundamental clásicamente computable contra la cual calificarlo."}
          </p>
          <Eq
            tex={String.raw`E_{\mathrm{VQE}}=\min_{\theta\in[-\pi,\pi]}E(\theta),\qquad \lvert E_{\mathrm{VQE}}-E_{\mathrm{FCI}}\rvert<1.6\times10^{-3}\ \mathrm{Ha}`}
            caption={{
              en: "VQE takes the minimum of the energy landscape and reaches chemical accuracy (<1.6 mHa) against exact diagonalization at every bond length.",
              es: "VQE toma el mínimo del paisaje de energía y alcanza precisión química (<1.6 mHa) frente a la diagonalización exacta en cada distancia de enlace.",
            }}
          />
          <div className="fig-svg wide"><VqeDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "The energy-vs-θ landscape is a single smooth well; VQE rolls to its bottom, always above the variational floor E₀ (FCI). Across bond lengths the minima trace the H₂ dissociation curve."
              : "El paisaje energía-vs-θ es un único pozo suave; VQE rueda a su fondo, siempre sobre el piso variacional E₀ (FCI). En las distancias de enlace los mínimos trazan la curva de disociación de H₂."}</p>
          </div>
          <p>
            {en
              ? "Across the six bond lengths R ∈ {0.5, 0.74, 1.0, 1.5, 2.0, 2.5} Å (0.74 ≈ equilibrium) the minima trace the H₂ dissociation curve, and VQE reaches chemical accuracy (< 1.6×10⁻³ Ha) at every point — the equilibrium energy −1.1373 Ha matches the textbook H₂/STO-3G value, with errors as small as 1–5×10⁻⁶ Ha near the bottom of the well. The energy-vs-θ landscape is a single smooth well that VQE rolls into; nothing here exhibits the pathology that makes VQE hard at scale, which is exactly the point of pairing it with the honest scope below."
              : "En las seis distancias R ∈ {0.5, 0.74, 1.0, 1.5, 2.0, 2.5} Å (0.74 ≈ equilibrio) los mínimos trazan la curva de disociación de H₂, y VQE alcanza precisión química (< 1.6×10⁻³ Ha) en cada punto — la energía de equilibrio −1.1373 Ha coincide con el valor de libro H₂/STO-3G, con errores tan pequeños como 1–5×10⁻⁶ Ha cerca del fondo del pozo. El paisaje energía-vs-θ es un único pozo suave en el que VQE rueda; nada aquí exhibe la patología que vuelve difícil a VQE a escala, que es justamente el punto de emparejarlo con el alcance honesto de abajo."}
          </p>
          <Callout
            title={en ? "Quantum vs classical —" : "Cuántico vs clásico —"}
            pt={en
              ? "Scaling VQE to molecules classical methods can't handle runs into barren plateaus (vanishing gradients) and deep ansätze — the open problem blocking a clean near-term chemistry advantage."
              : "Escalar VQE a moléculas que los métodos clásicos no pueden tratar choca con mesetas áridas (gradientes que se desvanecen) y ansätze profundos — el problema abierto que bloquea una ventaja química limpia a corto plazo."}>
            {en
              ? "VQE recovers the H₂ ground energy to chemical accuracy — a genuine learned method — but H₂ in a minimal basis is a 16×16 matrix a laptop diagonalizes in microseconds, so there is no advantage here; this is pedagogy."
              : "VQE recupera la energía fundamental de H₂ con precisión química — un método aprendido genuino — pero H₂ en base mínima es una matriz 16×16 que un laptop diagonaliza en microsegundos, así que aquí no hay ventaja; esto es pedagogía."}
          </Callout>
          <Refs ids={["peruzzo2014", "mcclean2018", "mcardle2020", "pennylane2018"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────────── 7 · Quantum ML (learned) ──────────────── */
    {
      id: "qml",
      label: en ? "Quantum ML" : "ML cuántico",
      badge: en ? "learned" : "aprendido",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "Quantum machine learning is the third learned method, and the build treats it as an explicit hype check. The approach is a quantum-kernel classifier: a quantum feature map embeds each classical 2-D point x into a quantum state |φ(x)⟩, and the fidelity kernel K(x,x') = |⟨φ(x)|φ(x')⟩|² is estimated on the device and fed to a classical SVM. The build's feature map uses 2 qubits — an angle embedding of (x₀, x₁) plus an IsingZZ(x₀·x₁) entangling term for a second-order feature — and computes each kernel entry as the probability of returning to |00⟩ after feature_map(a) then feature_map(b)†, i.e. the state fidelity."
              : "El aprendizaje automático cuántico es el tercer método aprendido, y el build lo trata como un chequeo explícito de hype. El enfoque es un clasificador de kernel cuántico: un mapa de características cuántico embebe cada punto clásico 2-D x en un estado |φ(x)⟩, y el kernel de fidelidad K(x,x') = |⟨φ(x)|φ(x')⟩|² se estima en el dispositivo y se alimenta a un SVM clásico. El mapa del build usa 2 qubits — un embedding de ángulo de (x₀, x₁) más un término entrelazante IsingZZ(x₀·x₁) para una característica de segundo orden — y computa cada entrada del kernel como la probabilidad de volver a |00⟩ tras feature_map(a) y luego feature_map(b)†, es decir la fidelidad de estado."}
          </p>
          <Eq
            tex={String.raw`\lvert\phi(x)\rangle=U_\phi(x)\lvert0\rangle,\qquad K(x,x')=\bigl\lvert\langle\phi(x)\mid\phi(x')\rangle\bigr\rvert^{2}=\Pr\!\bigl[\,\lvert00\rangle\ \text{after}\ U_\phi(x)^\dagger U_\phi(x')\bigr]`}
            caption={{
              en: "The quantum feature map and its fidelity kernel — the |00⟩ return probability after embedding x' then un-embedding x, fed as a precomputed Gram matrix to an SVM.",
              es: "El mapa de características cuántico y su kernel de fidelidad — la probabilidad de retorno a |00⟩ tras embeber x' y des-embeber x, dado como matriz de Gram precomputada a un SVM.",
            }}
          />
          <p>
            {en
              ? "The Gram matrix feeds sklearn.SVC(kernel='precomputed'), and the honest comparison is against a classical sklearn.SVC(kernel='rbf') on the same raw features. The build runs six datasets of increasing difficulty — linear, linear-hard (overlapping), circles (concentric), moons, xor (4 clusters), blobs — and reports train/test accuracy for both classifiers over identical splits at seed 42. The whole point is to put the two decision boundaries over the same points and let the accuracy speak."
              : "La matriz de Gram alimenta sklearn.SVC(kernel='precomputed'), y la comparación honesta es contra un clásico sklearn.SVC(kernel='rbf') sobre las mismas características crudas. El build corre seis datasets de dificultad creciente — linear, linear-hard (solapado), circles (concéntricos), moons, xor (4 clústeres), blobs — y reporta exactitud train/test para ambos clasificadores sobre las mismas particiones con semilla 42. El punto entero es poner las dos fronteras de decisión sobre los mismos puntos y dejar que la exactitud hable."}
          </p>
          <Eq
            tex={String.raw`K_{\text{quantum}}\ \text{vs}\ K_{\text{RBF}}(x,x')=e^{-\gamma\lVert x-x'\rVert^2}:\quad \text{moons}\ 0.875\ \text{vs}\ \mathbf{0.938}`}
            caption={{
              en: "Head-to-head on identical data: the quantum kernel ties or loses to the classical RBF kernel — on the harder 'moons' set the classical kernel wins 0.938 vs 0.875.",
              es: "Cara a cara con los mismos datos: el kernel cuántico empata o pierde contra el RBF clásico — en el set 'moons' más difícil el kernel clásico gana 0.938 vs 0.875.",
            }}
          />
          <div className="fig-svg wide"><QmlDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "The quantum-kernel pipeline: a 2-qubit feature map embeds x, the fidelity kernel K(x,x') forms a Gram matrix for a classical SVM — benchmarked against a classical RBF-SVM on identical data."
              : "El pipeline de kernel cuántico: un mapa de características de 2 qubits embebe x, el kernel de fidelidad K(x,x') forma una matriz de Gram para un SVM clásico — comparado con un SVM-RBF clásico sobre los mismos datos."}</p>
          </div>
          <p>
            {en
              ? "The committed results are unambiguous: both classifiers nail the easy and structured sets (linear, circles, xor, blobs all 1.00), they tie on linear-hard (0.875 each), and on the harder moons the classical RBF-SVM is strictly better (0.938 vs 0.875). The quantum kernel never wins. This matches the literature: provable quantum-kernel separations are contrived (built around problems like discrete-log), and on real data quantum kernels are competitive at best, usually worse, and bottlenecked by data loading."
              : "Los resultados commiteados son inequívocos: ambos clasificadores clavan los sets fáciles y estructurados (linear, circles, xor, blobs todos 1.00), empatan en linear-hard (0.875 cada uno), y en el moons más difícil el SVM-RBF clásico es estrictamente mejor (0.938 vs 0.875). El kernel cuántico nunca gana. Esto coincide con la literatura: las separaciones de kernel cuántico demostrables son artificiales (en torno a problemas como el logaritmo discreto), y en datos reales los kernels cuánticos son competitivos en el mejor caso, usualmente peores, y limitados por la carga de datos."}
          </p>
          <Callout
            title={en ? "Quantum vs classical —" : "Cuántico vs clásico —"}
            pt={en
              ? "QML is one of the most over-hyped areas of quantum computing; this case is built to show that honestly — kernel choice, not quantumness, drives most gains."
              : "El QML es una de las áreas más sobre-vendidas de la computación cuántica; este caso está hecho para mostrarlo honestamente — la elección del kernel, no lo cuántico, explica la mayoría de las mejoras."}>
            {en
              ? "the quantum-kernel classifier is a real learned method, but it shows no advantage over a standard classical SVM on these datasets and is sometimes worse, with no proven generic advantage at this scale."
              : "el clasificador de kernel cuántico es un método aprendido real, pero no muestra ventaja sobre un SVM clásico estándar en estos datasets y a veces es peor, sin ventaja genérica demostrada a esta escala."}
          </Callout>
          <Refs ids={["havlicek2019", "schuld2019", "huang2021", "pennylane2018"]} label={refLabel} />
        </div>
      ),
    },

    /* ─────────────────────────── 8 · Noise & QEC ───────────────────────── */
    {
      id: "qec",
      label: en ? "Noise & QEC" : "Ruido y QEC",
      content: (
        <div className="method-body">
          <p>
            {en
              ? "Real devices are noisy: gates and readout corrupt the result, pulling expectation values toward zero. The build splits the response into two genuinely different things — mitigation, which only reduces bias, and correction, which actually scales. The mitigation case runs a Bell pair (ideal ⟨Z₀Z₁⟩ = 1) under an Aer noise model (two-qubit depolarizing p on cx, one-qubit p/10 on single-qubit gates) in exact density-matrix simulation, so the result is deterministic with no shot noise. Zero-noise extrapolation (ZNE) then amplifies the noise by global gate folding U → U(U†U)ᵏ, which leaves the ideal output unchanged but multiplies the effective noise by λ = 2k+1, and linearly extrapolates the measured ⟨Z₀Z₁⟩ at λ ∈ {1,3,5} back to λ = 0."
              : "Los dispositivos reales tienen ruido: las compuertas y la lectura corrompen el resultado, empujando los valores esperados hacia cero. El build separa la respuesta en dos cosas genuinamente distintas — mitigación, que solo reduce el sesgo, y corrección, que sí escala. El caso de mitigación corre un par de Bell (ideal ⟨Z₀Z₁⟩ = 1) bajo un modelo de ruido Aer (depolarizante de dos qubits p en cx, de un qubit p/10 en compuertas de un qubit) en simulación exacta de matriz de densidad, así que el resultado es determinista sin ruido de muestreo. La extrapolación a ruido cero (ZNE) entonces amplifica el ruido por plegado global U → U(U†U)ᵏ, que deja la salida ideal sin cambios pero multiplica el ruido efectivo por λ = 2k+1, y extrapola linealmente el ⟨Z₀Z₁⟩ medido en λ ∈ {1,3,5} de vuelta a λ = 0."}
          </p>
          <Eq
            tex={String.raw`\rho\ \mapsto\ (1-p)\,\rho+p\,\tfrac{I}{2^{n}},\qquad E(\lambda)\approx E_0+c\,\lambda\ \big|_{\lambda=1,3,5}\ \xrightarrow{\ \text{fit}\ }\ E_0`}
            caption={{
              en: "Depolarizing noise (left) and the ZNE linear fit (right): fold the circuit to noise scales λ = 1,3,5, then extrapolate the intercept E₀ at λ = 0.",
              es: "Ruido depolarizante (izq.) y el ajuste lineal de ZNE (der.): pliega el circuito a escalas de ruido λ = 1,3,5, y extrapola el intercepto E₀ en λ = 0.",
            }}
          />
          <p>
            {en
              ? "The committed traces show ZNE working brilliantly at low noise and progressively less as noise grows: at p=0.01, depth 1 it cuts the error ~11× (noisy 0.970 → mitigated 0.997), but at p=0.05, depth 3 only ~1.5× (noisy 0.698 → 0.801). The linear extrapolation breaks down when the device is too noisy — the honest behavior of ZNE. The build implements the core technique directly rather than depending on Mitiq, which is GPL-3.0; the ZNE plot shows ⟨Z₀Z₁⟩ falling as λ rises, the intercept being the mitigated estimate."
              : "Las trazas commiteadas muestran ZNE funcionando brillantemente a bajo ruido y progresivamente menos al crecer el ruido: en p=0.01, profundidad 1 recorta el error ~11× (ruidoso 0.970 → mitigado 0.997), pero en p=0.05, profundidad 3 solo ~1.5× (ruidoso 0.698 → 0.801). La extrapolación lineal se rompe cuando el dispositivo es demasiado ruidoso — el comportamiento honesto de ZNE. El build implementa la técnica central directamente en lugar de depender de Mitiq, que es GPL-3.0; el gráfico de ZNE muestra ⟨Z₀Z₁⟩ cayendo al subir λ, siendo el intercepto la estimación mitigada."}
          </p>
          <Eq
            tex={String.raw`p_L\ \propto\ \Bigl(\tfrac{p}{p_{\mathrm{th}}}\Bigr)^{\lfloor(d+1)/2\rfloor},\qquad p<p_{\mathrm{th}}\Rightarrow d\!\uparrow\ \text{lowers}\ p_L`}
            caption={{
              en: "Below the surface-code threshold p_th (~0.5–1%), the logical error p_L falls exponentially with code distance d — the scaling that mitigation can never give.",
              es: "Bajo el umbral del código de superficie p_th (~0.5–1%), el error lógico p_L cae exponencialmente con la distancia de código d — el escalamiento que la mitigación nunca puede dar.",
            }}
          />
          <div className="fig-svg wide"><QecDiagram lang={lang} />
            <p className="fig-cap">{en
              ? "Left: ZNE extrapolates ⟨O⟩(λ) back to λ=0 — bias reduction, not correction. Right: the surface-code threshold — below p_th, a larger distance d lowers logical error; above it, more qubits add failure modes."
              : "Izq.: ZNE extrapola ⟨O⟩(λ) hasta λ=0 — reducción de sesgo, no corrección. Der.: el umbral del código de superficie — bajo p_th, una distancia d mayor baja el error lógico; sobre él, más qubits añaden modos de falla."}</p>
          </div>
          <p>
            {en
              ? "Correction is the real fix, and the build runs the genuine toolchain (Stim + PyMatching minimum-weight perfect matching). The distance-d repetition code (2d−1 qubits) corrects bit-flips: at p=0.05 the distance-5 logical error (0.0088) clearly beats distance-3 (0.0266) and both beat the unprotected qubit (0.093) — below threshold, more qubits = a better logical qubit. The rotated surface code corrects both bit- and phase-flips and exposes the threshold crossover directly: at p=0.005 d=5 beats d=3 (0.0057 vs 0.0080), but at p=0.02 d=5 is twice as bad (0.18 vs 0.092) — above threshold, scaling up loses. That crossing point is the number every fault-tolerance roadmap is fighting to get below, and the regime Google's Willow chip entered in 2024."
              : "La corrección es el arreglo real, y el build corre la cadena genuina (Stim + PyMatching, emparejamiento perfecto de peso mínimo). El código de repetición de distancia-d (2d−1 qubits) corrige bit-flips: en p=0.05 el error lógico de distancia-5 (0.0088) supera claramente a distancia-3 (0.0266) y ambos superan al qubit sin proteger (0.093) — bajo el umbral, más qubits = mejor qubit lógico. El código de superficie rotado corrige bit- y phase-flips y expone el cruce de umbral directamente: en p=0.005 d=5 supera a d=3 (0.0057 vs 0.0080), pero en p=0.02 d=5 es el doble de malo (0.18 vs 0.092) — sobre el umbral, escalar pierde. Ese punto de cruce es el número que toda hoja de ruta de tolerancia a fallos lucha por bajar, y el régimen al que entró el chip Willow de Google en 2024."}
          </p>
          <Callout
            title={en ? "Quantum vs classical —" : "Cuántico vs clásico —"}
            pt={en
              ? "QEC genuinely scales (Google Willow crossed threshold, 2024) — but that was ONE logical qubit; a useful machine needs hundreds-to-thousands, each ~1000 physical qubits, ~8 orders from useful."
              : "La QEC sí escala (Google Willow cruzó el umbral, 2024) — pero fue UN qubit lógico; una máquina útil necesita cientos-a-miles, cada uno ~1000 qubits físicos, a ~8 órdenes de ser útil."}>
            {en
              ? "ZNE is bias-reduction, NOT correction, and its sampling cost grows exponentially. At any classically-simulable scale a noiseless statevector simulator returns the exact answer for free — so mitigation only matters on hardware beyond classical reach, and even there it is a NISQ bridge, not a path to scalable computation."
              : "ZNE es reducción de sesgo, NO corrección, y su costo de muestreo crece exponencialmente. A cualquier escala clásicamente simulable un simulador de statevector sin ruido da la respuesta exacta gratis — así que la mitigación solo importa en hardware fuera del alcance clásico, y aun ahí es un puente NISQ, no un camino a computación escalable."}
          </Callout>
          <Refs ids={["temme2017", "giurgicatiron2020", "fowler2012", "google2024willow", "gidney2021stim"]} label={refLabel} />
        </div>
      ),
    },
  ];

  return (
    <div className="page-body prose">
      <div className="page-head">
        <h1>{en ? "Methodology" : "Metodología"}</h1>
        <p className="lede">
          {en
            ? <>One tab per method family — the formulation, the core math term by term with the build's exact constants (seed 42, the 24×24 = 576-eval QAOA grid, the 100-point VQE θ-scan, the λ = 1,3,5 ZNE folds), a hand-authored diagram, and the honest quantum-vs-classical verdict with sourced DOIs. This is methodology, <strong>not</strong> a results table: three families are learned/variational (QAOA, VQE, quantum ML), and none shows a practical speedup at lab scale.</>
            : <>Una pestaña por familia de método — la formulación, la matemática central término a término con las constantes exactas del build (semilla 42, la grilla QAOA de 24×24 = 576 evals, el barrido VQE de 100 puntos en θ, los plegados ZNE λ = 1,3,5), un diagrama hecho a mano, y el veredicto honesto cuántico-vs-clásico con DOIs citados. Esto es metodología, <strong>no</strong> una tabla de resultados: tres familias son aprendidas/variacionales (QAOA, VQE, ML cuántico), y ninguna muestra una aceleración práctica a escala de lab.</>}
        </p>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}
