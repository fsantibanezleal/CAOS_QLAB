import { useEffect, useState } from "react";
import type { Catalog } from "../lib/contract.types";
import { loadCatalog } from "../lib/data";
import { useUI } from "../lib/ui";
import { Refs } from "../lib/citations";
import { Eq, Tex } from "../components/Tabs";
import { ThreeLaneDiagram } from "../viz/diagrams";

type Lang = "en" | "es";

/* ──────────────────────────────────────────────────────────────────────────
   Hand-authored, theme-aware overview diagrams. They style ONLY via the .arch-*
   tokens (declared in index.css) so they track light/dark with zero hardcoded
   hex. Labels are real domain flows, not filler.
   ──────────────────────────────────────────────────────────────────────── */

/** The honest comparison loop: a Problem is attacked by a quantum solver AND a
 *  classical baseline; both report cost; the measured verdict decides. */
function ComparisonLoopDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "qa-cmp-loop";
  return (
    <svg viewBox="0 0 760 270" className="arch-svg" role="img"
         aria-label={en ? "Quantum-vs-classical comparison loop" : "Bucle de comparación cuántico vs clásico"}>
      <defs>
        <marker id={m} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" className="arch-arrowhead" />
        </marker>
      </defs>

      {/* Problem formulation */}
      <rect className="arch-box arch-box-key" x="14" y="98" width="176" height="74" rx="9" />
      <text className="arch-t" x="102" y="124" textAnchor="middle">{en ? "Problem" : "Problema"}</text>
      <text className="arch-s" x="102" y="142" textAnchor="middle">{en ? "formulation · variants" : "formulación · variantes"}</text>
      <text className="arch-s" x="102" y="158" textAnchor="middle">{en ? "+ observable" : "+ observable"}</text>

      {/* two solver lanes */}
      <path className="arch-arrow" d="M190 122 L286 70" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M190 150 L286 200" markerEnd={`url(#${m})`} />

      <rect className="arch-box" x="286" y="36" width="206" height="66" rx="9" />
      <text className="arch-t arch-em" x="389" y="60" textAnchor="middle">{en ? "Quantum solver" : "Solver cuántico"}</text>
      <text className="arch-s" x="389" y="78" textAnchor="middle">Qiskit·PennyLane·Cirq·Stim</text>
      <text className="arch-s" x="389" y="93" textAnchor="middle">{en ? "qubits · gates · shots" : "qubits · compuertas · shots"}</text>

      <rect className="arch-box" x="286" y="168" width="206" height="66" rx="9" />
      <text className="arch-t" x="389" y="192" textAnchor="middle">{en ? "Classical baseline" : "Baseline clásico"}</text>
      <text className="arch-s" x="389" y="210" textAnchor="middle">NumPy · scikit-learn</text>
      <text className="arch-s" x="389" y="225" textAnchor="middle">{en ? "exact / approx · wall-time" : "exacto / aprox · tiempo"}</text>

      {/* converge to verdict */}
      <path className="arch-arrow" d="M492 70 L572 122" markerEnd={`url(#${m})`} />
      <path className="arch-arrow" d="M492 200 L572 148" markerEnd={`url(#${m})`} />

      <rect className="arch-contract" x="572" y="100" width="174" height="70" rx="10" />
      <text className="arch-t" x="659" y="126" textAnchor="middle">{en ? "Measured verdict" : "Veredicto medido"}</text>
      <text className="arch-s arch-em" x="659" y="146" textAnchor="middle">{en ? "who wins, by how much" : "quién gana y por cuánto"}</text>
      <text className="arch-s" x="659" y="162" textAnchor="middle">{en ? "cost side by side" : "costos lado a lado"}</text>
    </svg>
  );
}

/** A qubit on the Bloch sphere + the interference picture: the two physical
 *  resources QLab teaches (superposition/entanglement vs constructive cancel). */
function PhysicsDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <svg viewBox="0 0 760 250" className="arch-svg" role="img"
         aria-label={en ? "Superposition, the Bloch sphere and interference" : "Superposición, la esfera de Bloch e interferencia"}>
      {/* Bloch sphere (left) */}
      <circle cx="150" cy="125" r="92" className="bloch-outline" />
      <ellipse cx="150" cy="125" rx="92" ry="30" className="bloch-equator" />
      <line x1="150" y1="33" x2="150" y2="217" className="bloch-axis" />
      <line x1="58" y1="125" x2="242" y2="125" className="bloch-axis" />
      <text className="bloch-ket" x="150" y="26" textAnchor="middle">|0⟩</text>
      <text className="bloch-ket" x="150" y="234" textAnchor="middle">|1⟩</text>
      <text className="bloch-ket" x="252" y="123" textAnchor="start">|+⟩</text>
      {/* state vector */}
      <line x1="150" y1="125" x2="206" y2="74" className="bloch-vector" />
      <circle cx="206" cy="74" r="4.5" className="bloch-vhead" />
      <text className="arch-s" x="150" y="248" textAnchor="middle">{en ? "one qubit = a point on the sphere" : "un qubit = un punto en la esfera"}</text>

      {/* interference (right) */}
      <text className="arch-t" x="540" y="34" textAnchor="middle">{en ? "interference" : "interferencia"}</text>
      {/* two amplitude waves */}
      <path className="bloch-traj" d="M380 80 q30 -26 60 0 q30 26 60 0 q30 -26 60 0 q30 26 60 0" />
      <path className="arch-arrow" style={{ strokeDasharray: "1" }} d="M380 130 q30 26 60 0 q30 -26 60 0 q30 26 60 0 q30 -26 60 0" />
      <text className="arch-s" x="370" y="84" textAnchor="end">a₁</text>
      <text className="arch-s" x="370" y="134" textAnchor="end">a₂</text>
      {/* sum bars */}
      <rect className="arch-contract" x="392" y="176" width="44" height="52" rx="4" />
      <rect className="arch-box" x="452" y="206" width="44" height="22" rx="4" />
      <rect className="arch-contract" x="512" y="170" width="44" height="58" rx="4" />
      <rect className="arch-box" x="572" y="214" width="44" height="14" rx="4" />
      <text className="arch-em" x="414" y="246" textAnchor="middle" style={{ font: "10px ui-monospace, monospace" }}>+</text>
      <text className="arch-s" x="474" y="246" textAnchor="middle">−</text>
      <text className="arch-em" x="534" y="246" textAnchor="middle" style={{ font: "10px ui-monospace, monospace" }}>+</text>
      <text className="arch-s" x="594" y="246" textAnchor="middle">−</text>
      <text className="arch-s" x="510" y="34" textAnchor="end">{en ? "amplitudes add / cancel" : "amplitudes suman / cancelan"}</text>
    </svg>
  );
}

const FRAMEWORKS: { name: string; role: { en: string; es: string } }[] = [
  { name: "Qiskit + Aer", role: { en: "IBM's SDK + high-performance simulator — circuits, statevector, noise models, real-hardware backends.", es: "SDK de IBM + simulador de alto rendimiento — circuitos, statevector, modelos de ruido, backends de hardware real." } },
  { name: "PennyLane", role: { en: "Differentiable QC — the variational / QML methods (VQE, QAOA, quantum kernels) with gradient-based training.", es: "QC diferenciable — los métodos variacionales / QML (VQE, QAOA, kernels cuánticos) con entrenamiento por gradiente." } },
  { name: "Cirq", role: { en: "Google's SDK — a second independent circuit engine that cross-checks the same problem from another implementation.", es: "SDK de Google — un segundo motor de circuitos independiente que valida el mismo problema desde otra implementación." } },
  { name: "Stim + PyMatching", role: { en: "Clifford simulator + decoder — error-correction at scale (repetition & surface codes), thousands of qubits.", es: "Simulador Clifford + decodificador — corrección de errores a escala (códigos de repetición y superficie), miles de qubits." } },
  { name: "NumPy / scikit-learn", role: { en: "The classical baselines — the spine of the lab: every quantum method is shown next to one, with its cost.", es: "Los baselines clásicos — la columna del lab: cada método cuántico se muestra junto a uno, con su costo." } },
];

export function Introduction() {
  const { lang } = useUI();
  const en = lang === "en";
  const [cat, setCat] = useState<Catalog | null>(null);
  useEffect(() => { loadCatalog().then(setCat).catch(() => {}); }, []);

  const nCases = cat?.count ?? 20;
  const nVariants = cat?.cases.reduce((s, c) => s + c.variants.length, 0) ?? 119;

  return (
    <div className="page-body prose">
      <div className="page-head">
        <h1>{en ? "Introduction" : "Introducción"}</h1>
        <p className="lede">
          {en
            ? <>QLab is a didactic quantum-computing laboratory: it runs the <em>real</em> frameworks on small problems, animates the quantum state on a Bloch sphere as <Tex tex={String.raw`\lvert\psi\rangle=\sum_x c_x\lvert x\rangle`} />, and — always — places each quantum method next to the classical baseline that is still, in 2025–2026, more practical at these scales. It is a teaching and workforce instrument, <strong>not</strong> a claim that quantum beats classical today.</>
            : <>QLab es un laboratorio didáctico de computación cuántica: corre los frameworks <em>reales</em> sobre problemas pequeños, anima el estado cuántico en una esfera de Bloch como <Tex tex={String.raw`\lvert\psi\rangle=\sum_x c_x\lvert x\rangle`} />, y — siempre — pone cada método cuántico junto al baseline clásico que en 2025–2026 sigue siendo más práctico a estas escalas. Es un instrumento de enseñanza y formación, <strong>no</strong> una afirmación de que lo cuántico le gane a lo clásico hoy.</>}
        </p>
      </div>

      {/* ── Overview pipeline SVG ─────────────────────────────────────────── */}
      <section className="doc-section">
        <h2>{en ? "The lab in one picture" : "El lab en una imagen"}</h2>
        <p>
          {en
            ? "Every case is a single honest experiment: a problem is formulated once, then attacked in parallel by a quantum solver and a classical baseline, each reporting its real cost. The measured verdict — who wins, by how much, at what cost — is the deliverable. The whole loop is reproducible from (parameters, seed)."
            : "Cada caso es un único experimento honesto: un problema se formula una vez y luego es atacado en paralelo por un solver cuántico y un baseline clásico, cada uno reportando su costo real. El veredicto medido — quién gana, por cuánto, a qué costo — es el entregable. Todo el bucle es reproducible a partir de (parámetros, semilla)."}
        </p>
        <div className="arch-wrap"><ComparisonLoopDiagram lang={lang} /></div>
        <p className="fine">
          {en
            ? "Read this as a contract, not a slogan: the quantum and classical lanes consume the same problem definition and write the same kind of result, so the comparison is apples-to-apples and on screen for every case."
            : "Léelo como un contrato, no un eslogan: los carriles cuántico y clásico consumen la misma definición del problema y escriben el mismo tipo de resultado, así que la comparación es justa y está en pantalla para cada caso."}
        </p>
        <Refs ids={["feynman1982", "preskill2018", "nielsen2010"]} label={en ? "Sources" : "Fuentes"} />
      </section>

      {/* ── 1. The industrial / quantum problem ───────────────────────────── */}
      <section className="doc-section">
        <h2>{en ? "1 · The problem — why a lab, and why now" : "1 · El problema — por qué un lab, y por qué ahora"}</h2>
        <p>
          {en
            ? "Quantum computing is the most over-marketed corner of computing. The best machines in 2025–2026 are real, impressive scientific instruments — IBM's Heron r2 (156 superconducting transmons), Google's Willow (105), Quantinuum's H2 (56 trapped ions, all-to-all), IonQ's Tempo (100), QuEra's neutral-atom arrays (256→3000+ atoms) — but they are not yet useful computers. The number that governs everything is the two-qubit gate error, today near 10⁻³ on the best pairs."
            : "La computación cuántica es el rincón más sobre-vendido de la computación. Las mejores máquinas en 2025–2026 son instrumentos científicos reales e impresionantes — Heron r2 de IBM (156 transmones superconductores), Willow de Google (105), H2 de Quantinuum (56 iones atrapados, todos-con-todos), Tempo de IonQ (100), arreglos de átomos neutros de QuEra (256→3000+ átomos) — pero todavía no son computadoras útiles. El número que gobierna todo es el error de compuerta de dos qubits, hoy cercano a 10⁻³ en los mejores pares."}
        </p>
        <p>
          {en
            ? <>That error sets how deep a circuit can go before noise destroys the signal. With per-gate error <Tex tex={String.raw`\varepsilon\approx10^{-3}`} />, a circuit of ~1000 two-qubit gates already accumulates order-1 expected error, so <em>useful</em> depth before noise dominates is in the low thousands of gates at best. Qubit count is the most over-marketed number: IBM's 1,121-qubit Condor is mostly a milestone, and IBM itself pivoted its useful roadmap to the 120–156-qubit Heron/Nighthawk line — because depth and fidelity, not raw count, gate what runs.</>
            : <>Ese error fija qué tan profundo puede ir un circuito antes de que el ruido destruya la señal. Con error por compuerta <Tex tex={String.raw`\varepsilon\approx10^{-3}`} />, un circuito de ~1000 compuertas de dos qubits ya acumula error esperado de orden 1, así que la profundidad <em>útil</em> antes de que el ruido domine está, en el mejor caso, en los miles bajos de compuertas. El conteo de qubits es el número más sobre-vendido: el Condor de 1121 qubits de IBM es sobre todo un hito, e IBM misma reorientó su hoja de ruta útil a la línea Heron/Nighthawk de 120–156 qubits — porque la profundidad y la fidelidad, no el conteo bruto, deciden qué corre.</>}
        </p>
        <p>
          {en
            ? "Most tutorials either stop at a toy circuit or imply an advantage that does not exist yet. The industrial problem QLab addresses is concrete: teams and students need to learn the real tools and read honest comparisons, so they can tell a delivered capability from a roadmap slide. The single most valuable thing these machines do in 2026 is advance error-correction science and train the people who might make them useful in the 2030s — which is exactly what a lab like this is for."
            : "La mayoría de los tutoriales se quedan en un circuito de juguete o insinúan una ventaja que aún no existe. El problema industrial que aborda QLab es concreto: los equipos y estudiantes necesitan aprender las herramientas reales y leer comparaciones honestas, para distinguir una capacidad entregada de una diapositiva de hoja de ruta. Lo más valioso que hacen estas máquinas en 2026 es avanzar la ciencia de corrección de errores y formar a las personas que podrían volverlas útiles en los 2030 — que es exactamente para lo que sirve un lab como este."}
        </p>
        <Refs ids={["preskill2018", "google2024willow", "kim2023"]} label={en ? "Sources" : "Fuentes"} />
      </section>

      {/* ── 2. The physics ────────────────────────────────────────────────── */}
      <section className="doc-section">
        <h2>{en ? "2 · The physics — superposition, entanglement, interference" : "2 · La física — superposición, entrelazamiento, interferencia"}</h2>
        <div className="fig-row">
          <div>
            <p>
              {en
                ? <>A qubit is a unit vector in a 2-dimensional complex space; a pure single-qubit state is a point on the Bloch sphere, and gates are unitary rotations of it. A Hadamard maps a pole to the equator — the equal superposition <Tex tex={String.raw`\lvert+\rangle`} /> — which is the first physical resource. Two qubits can share a state that does not factor into independent single-qubit states: entanglement, the second resource. The third — and the one that does the real work in the famous algorithms — is interference: probability amplitudes are complex numbers that add and cancel, so a well-designed circuit makes wrong answers destructively cancel while the right answer survives.</>
                : <>Un qubit es un vector unitario en un espacio complejo de dimensión 2; un estado puro de un qubit es un punto en la esfera de Bloch, y las compuertas son rotaciones unitarias. Una Hadamard lleva un polo al ecuador — la superposición uniforme <Tex tex={String.raw`\lvert+\rangle`} /> — que es el primer recurso físico. Dos qubits pueden compartir un estado que no se factoriza en estados individuales: el entrelazamiento, el segundo recurso. El tercero — y el que hace el trabajo real en los algoritmos famosos — es la interferencia: las amplitudes de probabilidad son números complejos que suman y cancelan, así que un circuito bien diseñado hace que las respuestas equivocadas se cancelen destructivamente mientras la correcta sobrevive.</>}
            </p>
          </div>
          <div className="fig-svg wide">
            <PhysicsDiagram lang={lang} />
            <p className="fig-cap">
              {en
                ? "Left: a single qubit lives on the Bloch sphere; gates rotate the vector. Right: amplitudes interfere — constructive (+) reinforces, destructive (−) cancels — the mechanism behind every quantum speedup."
                : "Izq.: un qubit vive en la esfera de Bloch; las compuertas rotan el vector. Der.: las amplitudes interfieren — constructiva (+) refuerza, destructiva (−) cancela — el mecanismo detrás de toda aceleración cuántica."}
            </p>
          </div>
        </div>
        <p>
          {en
            ? "The catch is measurement: you never read the amplitudes directly. A measurement returns a single classical bitstring with probability equal to the squared magnitude of its amplitude (the Born rule), then collapses the state. Everything an algorithm achieves it must achieve by shaping those probabilities before the measurement — which is why naïvely 'reading 2ⁿ amplitudes at once' is a myth, and why a classical computer can often match small quantum circuits by simply writing the 2ⁿ vector down."
            : "El truco es la medición: nunca lees las amplitudes directamente. Una medición devuelve una sola cadena de bits clásica con probabilidad igual al módulo al cuadrado de su amplitud (la regla de Born), y luego colapsa el estado. Todo lo que un algoritmo logra debe lograrlo dando forma a esas probabilidades antes de medir — por eso 'leer 2ⁿ amplitudes a la vez' es un mito, y por eso una computadora clásica a menudo iguala circuitos cuánticos pequeños con solo escribir el vector de 2ⁿ."}
        </p>
        <Refs ids={["nielsen2010", "feynman1965", "epr1935", "bell1964"]} label={en ? "Sources" : "Fuentes"} />
      </section>

      {/* ── 3. The governing math + symbol glossary ───────────────────────── */}
      <section className="doc-section">
        <h2>{en ? "3 · The governing math" : "3 · La matemática que lo gobierna"}</h2>
        <p>
          {en
            ? "A computation is a unitary acting on a state vector, followed by measurement. The three equations below are the spine of every case: the state and its Born-rule readout, the unitary evolution by a circuit of gates, and the entangling pair that no product state can reproduce."
            : "Una computación es un unitario actuando sobre un vector de estado, seguido de una medición. Las tres ecuaciones de abajo son la columna de cada caso: el estado y su lectura por la regla de Born, la evolución unitaria por un circuito de compuertas, y el par entrelazado que ningún estado producto puede reproducir."}
        </p>
        <Eq
          tex={String.raw`\lvert\psi\rangle=\sum_{x=0}^{2^n-1} c_x\,\lvert x\rangle,\quad \sum_x\lvert c_x\rvert^2=1,\qquad \Pr(x)=\lvert\langle x\lvert\psi\rangle\rvert^2`}
          caption={{
            en: "State of n qubits: a unit vector of 2ⁿ complex amplitudes; the Born rule turns amplitudes into measurement probabilities.",
            es: "Estado de n qubits: un vector unitario de 2ⁿ amplitudes complejas; la regla de Born convierte amplitudes en probabilidades de medición.",
          }}
        />
        <Eq
          tex={String.raw`\lvert\psi_{\mathrm{out}}\rangle=U_L\cdots U_2\,U_1\,\lvert\psi_{\mathrm{in}}\rangle,\qquad U_\ell^\dagger U_\ell=I`}
          caption={{
            en: "A circuit is an ordered product of unitary gates; each gate preserves the norm (reversible, no information lost until measurement).",
            es: "Un circuito es un producto ordenado de compuertas unitarias; cada compuerta preserva la norma (reversible, sin pérdida de información hasta medir).",
          }}
        />
        <Eq
          tex={String.raw`H=\tfrac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix},\qquad \lvert\Phi^+\rangle=\mathrm{CNOT}\,(H\otimes I)\lvert00\rangle=\tfrac{\lvert00\rangle+\lvert11\rangle}{\sqrt2}`}
          caption={{
            en: "Hadamard builds superposition; CNOT after it builds the Bell pair |Φ⁺⟩ — a maximally entangled state that does not factor into single-qubit states.",
            es: "La Hadamard construye superposición; la CNOT a continuación construye el par de Bell |Φ⁺⟩ — un estado máximamente entrelazado que no se factoriza en estados de un qubit.",
          }}
        />
        <h3>{en ? "Symbol glossary" : "Glosario de símbolos"}</h3>
        <div className="def-grid">
          {[
            ["|ψ⟩", en ? "a quantum state — a unit vector in a 2ⁿ-dim complex (Hilbert) space" : "un estado cuántico — un vector unitario en un espacio (de Hilbert) complejo de dimensión 2ⁿ"],
            ["n", en ? "number of qubits; the state vector has 2ⁿ complex amplitudes" : "número de qubits; el vector de estado tiene 2ⁿ amplitudes complejas"],
            ["cₓ", en ? "complex amplitude of basis state |x⟩; |cₓ|² is its measurement probability" : "amplitud compleja del estado base |x⟩; |cₓ|² es su probabilidad de medición"],
            ["|x⟩", en ? "a computational basis state, x an n-bit string (e.g. |010⟩)" : "un estado de la base computacional, x una cadena de n bits (p. ej. |010⟩)"],
            ["Pr(x)", en ? "Born-rule probability of reading bitstring x on measurement" : "probabilidad (regla de Born) de leer la cadena x al medir"],
            ["U, Uℓ", en ? "a unitary operator / the ℓ-th gate; U†U = I (reversible)" : "un operador unitario / la ℓ-ésima compuerta; U†U = I (reversible)"],
            ["U†", en ? "the conjugate transpose (adjoint) of U — the inverse of a unitary" : "la transpuesta conjugada (adjunta) de U — la inversa de un unitario"],
            ["L", en ? "circuit depth — the number of gates / layers applied" : "profundidad del circuito — número de compuertas / capas aplicadas"],
            ["H", en ? "the Hadamard gate — maps |0⟩→|+⟩, creates superposition" : "la compuerta Hadamard — lleva |0⟩→|+⟩, crea superposición"],
            ["CNOT", en ? "controlled-NOT — flips the target iff the control is |1⟩; entangles" : "NOT controlada — invierte el objetivo si el control es |1⟩; entrelaza"],
            ["|Φ⁺⟩", en ? "a Bell pair (½√2)(|00⟩+|11⟩) — maximally entangled two-qubit state" : "un par de Bell (½√2)(|00⟩+|11⟩) — estado de dos qubits máximamente entrelazado"],
            ["⊗", en ? "tensor product — combines independent subsystems into one space" : "producto tensorial — combina subsistemas independientes en un solo espacio"],
            ["I", en ? "the identity operator (do-nothing gate)" : "el operador identidad (compuerta que no hace nada)"],
            ["ε", en ? "two-qubit gate error rate (~10⁻³ on today's best hardware)" : "tasa de error de compuerta de dos qubits (~10⁻³ en el mejor hardware actual)"],
          ].map(([sym, def]) => (
            <div key={sym} className="cat-card-mini">
              <strong className="mono">{sym}</strong>
              <span>{def}</span>
            </div>
          ))}
        </div>
        <Refs ids={["nielsen2010", "feynman1982"]} label={en ? "Sources" : "Fuentes"} />
      </section>

      {/* ── 4. The end-to-end pipeline ────────────────────────────────────── */}
      <section className="doc-section">
        <h2>{en ? "4 · The end-to-end pipeline" : "4 · El pipeline de extremo a extremo"}</h2>
        <p>
          {en
            ? "Nothing on the published site computes physics on demand. A run is a pure function of (parameters, seed); the result is committed and the front end only animates it (replay = truth). The pipeline, in order:"
            : "Nada en el sitio publicado computa física a demanda. Una corrida es una función pura de (parámetros, semilla); el resultado se commitea y el front end solo lo anima (replay = verdad). El pipeline, en orden:"}
        </p>
        <ol className="gate-list">
          <li>{en
            ? <><strong>Formulate the problem.</strong> Pick a formulation (MaxCut, ground-state energy, search, …) and its variants and observable, independent of which method will attack it (the <em>Problem</em> abstraction).</>
            : <><strong>Formular el problema.</strong> Elegir una formulación (MaxCut, energía de estado base, búsqueda, …) con sus variantes y observable, independiente del método que la atacará (la abstracción <em>Problema</em>).</>}</li>
          <li>{en
            ? <><strong>Bind real solvers.</strong> Each <em>Solver</em> is a thin adapter over a real framework — quantum-sim (Qiskit-Aer, PennyLane), classical (NumPy/scikit-learn), optional quantum-hardware. A registry lists every solver that can attack the problem.</>
            : <><strong>Vincular solvers reales.</strong> Cada <em>Solver</em> es un adaptador delgado sobre un framework real — sim-cuántico (Qiskit-Aer, PennyLane), clásico (NumPy/scikit-learn), hardware-cuántico opcional. Un registro lista cada solver que puede atacar el problema.</>}</li>
          <li>{en
            ? <><strong>Classify the lane (measured, not guessed).</strong> Four conditions — qubits ≤ 12, unitary-only, run-time ≤ 1.5 s, trace ≤ 1 MB — decide whether the case runs <em>live</em> in the browser or must be <em>precomputed</em> offline.</>
            : <><strong>Clasificar el carril (medido, no adivinado).</strong> Cuatro condiciones — qubits ≤ 12, solo-unitario, tiempo ≤ 1,5 s, traza ≤ 1 MB — deciden si el caso corre <em>vivo</em> en el navegador o debe <em>precomputarse</em> offline.</>}</li>
          <li>{en
            ? <><strong>Run and trace.</strong> The engine executes the circuit and records, per step, the statevector, Bloch vectors and probabilities, plus the measurement counts — all under one JSON contract (qlab-trace), with no framework-specific type leaking through.</>
            : <><strong>Correr y trazar.</strong> El motor ejecuta el circuito y registra, por paso, el statevector, vectores de Bloch y probabilidades, más los conteos de medición — todo bajo un solo contrato JSON (qlab-trace), sin que se filtre ningún tipo específico del framework.</>}</li>
          <li>{en
            ? <><strong>Compare against the classical baseline.</strong> The same problem is also solved classically; both costs (qubits, gates, shots, wall-time) and answers are recorded side by side, and the head-to-head verdict is computed.</>
            : <><strong>Comparar contra el baseline clásico.</strong> El mismo problema también se resuelve clásicamente; ambos costos (qubits, compuertas, shots, tiempo) y respuestas se registran lado a lado, y se calcula el veredicto cara a cara.</>}</li>
          <li>{en
            ? <><strong>Commit + replay.</strong> The seeded trace + manifest are committed to the repo; the static SPA loads them and a single set of replay code animates the circuit, Bloch sphere, histogram and comparison panel — deterministic to screenshot.</>
            : <><strong>Commitear + replay.</strong> La traza con semilla + el manifiesto se commitean; la SPA estática los carga y un único conjunto de código de replay anima el circuito, la esfera de Bloch, el histograma y el panel de comparación — determinista para captura.</>}</li>
        </ol>
        <div className="arch-wrap"><ThreeLaneDiagram lang={lang} /></div>
        <p className="fine">
          {en
            ? "Three producers, one render path: the live (browser TypeScript) lane, the precompute (local .venv) lane and the dormant real-hardware lane all emit the same trace; the SPA does not know or care which produced it."
            : "Tres productores, un solo camino de render: el carril vivo (TypeScript del navegador), el carril de precómputo (.venv local) y el carril inactivo de hardware real emiten todos la misma traza; la SPA no sabe ni le importa cuál la produjo."}
        </p>
        <Refs ids={["feynman1982", "preskill2018", "qiskit2024"]} label={en ? "Sources" : "Fuentes"} />
      </section>

      {/* ── 5. Exact vs illustrative honesty ──────────────────────────────── */}
      <section className="doc-section">
        <h2>{en ? "5 · Exact vs illustrative — the honesty boundary" : "5 · Exacto vs ilustrativo — el límite de honestidad"}</h2>
        <p>
          {en
            ? "Two things in this lab are exact, and one is, by necessity, illustrative — and the difference is marked everywhere."
            : "Dos cosas en este lab son exactas, y una es, por necesidad, ilustrativa — y la diferencia se marca en todas partes."}
        </p>
        <p>
          {en
            ? <><strong>Exact:</strong> the quantum state evolution and the measurement statistics. The committed traces come from the real frameworks (Qiskit + Aer, PennyLane, Cirq, Stim) or a purpose-built exact state-vector engine; numbers are computed by those engines, never typed in. The classical baselines are real solvers too (brute force, Goemans–Williamson, full configuration interaction, kernel methods).</>
            : <><strong>Exacto:</strong> la evolución del estado cuántico y la estadística de medición. Las trazas commiteadas vienen de los frameworks reales (Qiskit + Aer, PennyLane, Cirq, Stim) o de un motor de statevector exacto hecho a medida; los números los calculan esos motores, nunca se escriben a mano. Los baselines clásicos también son solvers reales (fuerza bruta, Goemans–Williamson, interacción de configuraciones completa, métodos de kernel).</>}
        </p>
        <p>
          {en
            ? <><strong>Illustrative:</strong> the <em>scale</em>. Everything here runs at lab scale (a handful of qubits), where a classical computer simply writes the 2ⁿ amplitude vector down. Grover's √N, Shor's polynomial factoring and QAOA's approximation are real asymptotics that do <em>not</em> show up as a win at N this small — Shor here is a toy N=15, real RSA-2048 needs on the order of 10⁶ noisy physical qubits (Gidney 2025). The mechanism is exact; the advantage is illustrative of what larger, fault-tolerant machines might one day do.</>
            : <><strong>Ilustrativo:</strong> la <em>escala</em>. Todo aquí corre a escala de lab (un puñado de qubits), donde una computadora clásica simplemente escribe el vector de 2ⁿ amplitudes. El √N de Grover, la factorización polinomial de Shor y la aproximación de QAOA son asintóticas reales que <em>no</em> aparecen como ventaja a una N tan pequeña — Shor aquí es un juguete N=15, y el RSA-2048 real necesita del orden de 10⁶ qubits físicos ruidosos (Gidney 2025). El mecanismo es exacto; la ventaja es ilustrativa de lo que máquinas mayores y tolerantes a fallos podrían hacer algún día.</>}
        </p>
        <div className="callout">
          <strong>{en ? "The honest frame (2025–2026)." : "El marco honesto (2025–2026)."}</strong>{" "}
          {en
            ? "Does a quantum computer beat a classical one at anything you'd pay for? Not yet. Error correction crossed a genuine threshold (Google Willow, Dec 2024), but that was one logical qubit used as memory — about 8 orders of magnitude from breaking cryptography, and no useful computation. Of the cases shipped here, zero show a practical, pay-for-it speedup today; the quantum-vs-classical comparison is on screen for each so you can see exactly why."
            : "¿Una computadora cuántica le gana a una clásica en algo que pagarías? Todavía no. La corrección de errores cruzó un umbral real (Google Willow, dic 2024), pero fue un qubit lógico usado como memoria — a unos 8 órdenes de magnitud de romper criptografía, y sin computación útil. De los casos incluidos aquí, cero muestran una aceleración práctica y pagable hoy; la comparación cuántico-vs-clásico está en pantalla para cada uno para que veas exactamente por qué."}
          <span className="callout-pt">
            {en
              ? "That sentence is the reason QLab exists, and the reason every case ships with a classical solver."
              : "Esa frase es la razón de existir de QLab, y la razón de que cada caso incluya un solver clásico."}
          </span>
        </div>
        <Refs ids={["google2024willow", "gidney2025", "barak2021", "arute2019"]} label={en ? "Sources" : "Fuentes"} />
      </section>

      {/* ── The frameworks it consumes ────────────────────────────────────── */}
      <section className="doc-section">
        <h2>{en ? "The frameworks it actually consumes" : "Los frameworks que realmente consume"}</h2>
        <p>
          {en
            ? "Solvers are thin adapters over real, dedicated frameworks (the Problem × Solver pattern). Adding a framework is one more adapter and one registry line — not a rewrite of the engine, the pipeline or the web."
            : "Los solvers son adaptadores delgados sobre frameworks reales y dedicados (el patrón Problem × Solver). Agregar un framework es un adaptador más y una línea de registro — no una reescritura del motor, el pipeline o la web."}
        </p>
        <ul className="fw-list">
          {FRAMEWORKS.map((f) => (
            <li key={f.name}><strong>{f.name}</strong> — {en ? f.role.en : f.role.es}</li>
          ))}
        </ul>
        <Refs ids={["qiskit2024", "pennylane2018", "gidney2021stim"]} label={en ? "Sources" : "Fuentes"} />
      </section>

      {/* ── What you can explore ──────────────────────────────────────────── */}
      <section className="doc-section">
        <h2>{en ? "What you can explore" : "Lo que puedes explorar"}</h2>
        <p>
          {en
            ? `${nCases} worked cases across all six families (${nVariants} committed variant traces), each solved end-to-end by a quantum solver and a classical baseline:`
            : `${nCases} casos resueltos en las seis familias (${nVariants} trazas de variante commiteadas), cada uno resuelto de extremo a extremo por un solver cuántico y un baseline clásico:`}
        </p>
        <div className="cat-grid">
          {[
            ["Fundamentals", "Fundamentos", en ? "single-qubit gates & the Bloch sphere · superposition & quantum RNG · phase & interference" : "compuertas de un qubit y la esfera de Bloch · superposición y RNG cuántico · fase e interferencia"],
            ["Entanglement", "Entrelazamiento", en ? "Bell/GHZ/W states · CHSH · teleportation · superdense coding" : "estados Bell/GHZ/W · CHSH · teleportación · codificación superdensa"],
            ["Oracle algorithms", "Algoritmos de oráculo", "Deutsch–Jozsa · Bernstein–Vazirani · Simon"],
            ["Flagship algorithms", "Algoritmos insignia", en ? "Grover · QFT · phase estimation · Shor (toy N=15)" : "Grover · QFT · estimación de fase · Shor (juguete N=15)"],
            ["Variational", "Variacionales", en ? "MaxCut (QAOA) · VQE (H₂) · quantum-kernel ML" : "MaxCut (QAOA) · VQE (H₂) · ML con kernel cuántico"],
            ["Noise & QEC", "Ruido y QEC", en ? "noise + ZNE mitigation · repetition & surface codes" : "ruido + mitigación ZNE · códigos de repetición y superficie"],
          ].map(([enT, esT, body]) => (
            <div key={enT} className="cat-card-mini">
              <strong>{en ? enT : esT}</strong>
              <span>{body}</span>
            </div>
          ))}
        </div>
        <Refs ids={["deutsch1992", "grover1996", "shor1997", "farhi2014", "peruzzo2014"]} label={en ? "Sources" : "Fuentes"} />
      </section>

      {/* ── What this is — and is not ─────────────────────────────────────── */}
      <section className="doc-section">
        <h2>{en ? "What this is — and is not" : "Qué es — y qué no es"}</h2>
        <div className="isnot">
          <div className="is">
            <span className="tag is-tag">{en ? "IS" : "ES"}</span>
            <p>{en
              ? "A teaching + workforce lab that runs the real frameworks on small problems, animates the quantum state, and honestly compares quantum to classical with both costs on screen."
              : "Un laboratorio de enseñanza y formación que corre los frameworks reales sobre problemas pequeños, anima el estado cuántico y compara honestamente lo cuántico con lo clásico con ambos costos en pantalla."}</p>
          </div>
          <div className="isnt">
            <span className="tag isnt-tag">{en ? "IS NOT" : "NO ES"}</span>
            <p>{en
              ? "A claim that quantum beats classical today (it does not, at these scales); a production quantum-advantage engine; a service that runs arbitrary circuits on hardware for you."
              : "Una afirmación de que lo cuántico le gana a lo clásico hoy (no lo hace, a estas escalas); un motor de ventaja cuántica en producción; un servicio que corre circuitos arbitrarios en hardware por ti."}</p>
          </div>
        </div>
        <Refs ids={["preskill2018", "kim2023", "barak2021"]} label={en ? "Sources" : "Fuentes"} />
      </section>
    </div>
  );
}
