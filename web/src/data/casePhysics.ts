// Per-case physics annotations for the App workbench sidebar (ADR-0017 §3).
// Sourced verbatim-in-substance from docs/use-cases/*.md (the accurate wiki). These drive
// the live "quantum-vs-classical verdict" read-out: a crisp advantage class + a one-line
// defining relation + a teaching point. The per-variant numeric verdict still comes live
// from the committed bundle (bundle.comparison.verdict); this map adds the honest label.

import type { Bilingual } from "../lib/contract.types";

/** The honest advantage taxonomy used across the lab (docs/state-of-the-art.md §3). */
export type AdvantageClass =
  | "genuine" // quantum provably beats any classical strategy (CHSH, teleportation fidelity, superdense)
  | "exponential" // proven exponential query/oracle separation (Simon)
  | "quadratic" // asymptotic polynomial speedup (Grover)
  | "query" // query-complexity edge in the oracle model only (BV, Deutsch–Jozsa)
  | "subroutine" // no standalone edge; earns its keep only inside a larger algorithm (QFT, QPE, Shor)
  | "concept" // foundational concept, no advantage at simulable size (state prep, single qubit, RNG, interference, noise, QEC, VQE, QML, MaxCut)
  | "none"; // explicitly ties or loses to classical (QML, MaxCut at this scale)

export const ADVANTAGE_LABEL: Record<AdvantageClass, Bilingual> = {
  genuine: { en: "Genuine quantum edge", es: "Ventaja cuántica genuina" },
  exponential: { en: "Exponential separation", es: "Separación exponencial" },
  quadratic: { en: "Quadratic speedup", es: "Aceleración cuadrática" },
  query: { en: "Query-complexity edge", es: "Ventaja en complejidad de consultas" },
  subroutine: { en: "Subroutine — no standalone edge", es: "Subrutina — sin ventaja aislada" },
  concept: { en: "Foundational concept — no speedup", es: "Concepto fundacional — sin aceleración" },
  none: { en: "Ties or loses to classical", es: "Empata o pierde contra el clásico" },
};

/** Maps the advantage class to a theme-aware edge token (no hex; see index.css --edge-*). */
export const ADVANTAGE_EDGE: Record<AdvantageClass, "genuine" | "query" | "qec" | "classical"> = {
  genuine: "genuine",
  exponential: "genuine",
  quadratic: "query",
  query: "query",
  subroutine: "qec",
  concept: "classical",
  none: "classical",
};

export interface CasePhysics {
  advantage: AdvantageClass;
  /** A defining relation, rendered with KaTeX inline in the sidebar read-out. */
  relation: string;
  /** What the case teaches — the structural lesson (bilingual, dense, ≥1 sentence). */
  teaches: Bilingual;
  /** The honest scope / caveat that keeps the read-out from overclaiming. */
  honest: Bilingual;
}

export const CASE_PHYSICS: Record<string, CasePhysics> = {
  "state-prep": {
    advantage: "concept",
    relation: "|\\Phi^+\\rangle=\\tfrac{1}{\\sqrt2}(|00\\rangle+|11\\rangle)",
    teaches: {
      en: "Builds Bell / GHZ / W states from H and CX and watches entanglement appear — correlation no independent description of the qubits can reproduce. After CX the per-qubit Bloch vectors shrink to the origin (locally mixed, globally pure).",
      es: "Construye estados de Bell / GHZ / W a partir de H y CX y observa aparecer el entrelazamiento — correlación que ninguna descripción independiente de los qubits puede reproducir. Tras CX, los vectores de Bloch por qubit colapsan al origen (localmente mixtos, globalmente puros).",
    },
    honest: {
      en: "A classical machine stores all 2ⁿ amplitudes instantly at 2–4 qubits: no speedup here. Entanglement is the concept everything else builds on, not an advantage.",
      es: "Una máquina clásica guarda las 2ⁿ amplitudes al instante con 2–4 qubits: aquí no hay aceleración. El entrelazamiento es el concepto base de todo lo demás, no una ventaja.",
    },
  },
  chsh: {
    advantage: "genuine",
    relation: "S=2\\sqrt2\\;>\\;2",
    teaches: {
      en: "Measures the CHSH correlator under four angle settings. The quantum value S = 2√2 (Tsirelson) exceeds the local-hidden-variable bound S ≤ 2, ruling out local realism — the basis of the 2022 Nobel Prize.",
      es: "Mide el correlador CHSH bajo cuatro configuraciones de ángulo. El valor cuántico S = 2√2 (Tsirelson) supera la cota de variables ocultas locales S ≤ 2, descartando el realismo local — base del Premio Nobel 2022.",
    },
    honest: {
      en: "A genuine, uniquely-quantum edge — but it is a nonlocality result (and a real edge in the CHSH game, ~85.4% vs 75%), not a computational speedup.",
      es: "Una ventaja genuina y exclusivamente cuántica — pero es un resultado de no-localidad (y una ventaja real en el juego CHSH, ~85.4% vs 75%), no una aceleración computacional.",
    },
  },
  "deutsch-jozsa": {
    advantage: "query",
    relation: "1\\;\\text{query vs}\\;2^{n-1}{+}1",
    teaches: {
      en: "Decides whether an oracle f is constant or balanced. Phase kickback through a single H–oracle–H sandwich settles it in one quantum query; a classical algorithm may need up to 2ⁿ⁻¹+1 evaluations.",
      es: "Decide si un oráculo f es constante o balanceado. El phase kickback a través de un único sándwich H–oráculo–H lo resuelve en una consulta cuántica; un algoritmo clásico puede requerir hasta 2ⁿ⁻¹+1 evaluaciones.",
    },
    honest: {
      en: "A real query-complexity separation, but it lives in the oracle model; at simulable sizes the classical wall-time is equally instant.",
      es: "Una separación real en complejidad de consultas, pero vive en el modelo de oráculo; a tamaños simulables el tiempo de pared clásico es igual de instantáneo.",
    },
  },
  "bernstein-vazirani": {
    advantage: "query",
    relation: "1\\;\\text{query vs}\\;n",
    teaches: {
      en: "Recovers a hidden bit-string s in a single oracle query via phase kickback and interference, where any classical algorithm needs one query per bit (n total).",
      es: "Recupera una cadena oculta s en una sola consulta de oráculo mediante phase kickback e interferencia, donde cualquier algoritmo clásico necesita una consulta por bit (n en total).",
    },
    honest: {
      en: "A real n→1 query advantage in the oracle model; at these sizes classical wall-time is trivial either way. It teaches phase kickback honestly.",
      es: "Una ventaja real n→1 en el modelo de oráculo; a estos tamaños el tiempo de pared clásico es trivial de cualquier modo. Enseña el phase kickback con honestidad.",
    },
  },
  simon: {
    advantage: "exponential",
    relation: "O(n)\\;\\text{vs}\\;\\Theta(2^{n/2})",
    teaches: {
      en: "Finds a hidden period s with f(x)=f(x⊕s) using O(n) quantum queries plus a GF(2) linear solve, versus ~2ⁿ/² classical collision queries — the first proven exponential quantum–classical separation.",
      es: "Encuentra un período oculto s con f(x)=f(x⊕s) usando O(n) consultas cuánticas más una resolución lineal en GF(2), frente a ~2ⁿ/² consultas clásicas de colisión — la primera separación cuántico-clásica exponencial demostrada.",
    },
    honest: {
      en: "A genuine exponential query separation — though still in the oracle model, and the classical collision search is fast at the simulable n shown here.",
      es: "Una separación exponencial genuina en consultas — aún en el modelo de oráculo, y la búsqueda clásica de colisiones es rápida con los n simulables aquí mostrados.",
    },
  },
  grover: {
    advantage: "quadratic",
    relation: "\\sim\\!\\sqrt N\\;\\text{vs}\\;\\sim\\! N/2",
    teaches: {
      en: "Amplitude amplification: an oracle marks the target and a diffuser reflects about the mean, rotating amplitude onto the marked item so it is found in ~√N queries versus a classical ~N/2 scan.",
      es: "Amplificación de amplitud: un oráculo marca el objetivo y un difusor refleja respecto a la media, rotando amplitud hacia el ítem marcado para hallarlo en ~√N consultas frente a un escaneo clásico ~N/2.",
    },
    honest: {
      en: "A quadratic speedup — the most broadly useful quantum result — but asymptotic: at browser-simulable N the classical scan is still instant and cheaper in wall-time.",
      es: "Una aceleración cuadrática — el resultado cuántico más ampliamente útil — pero asintótica: con N simulable en navegador el escaneo clásico sigue siendo instantáneo y más barato en tiempo de pared.",
    },
  },
  qft: {
    advantage: "subroutine",
    relation: "O(n^2)\\;\\text{vs}\\;O(n\\,2^{n})",
    teaches: {
      en: "Applies the Fourier transform in O(n²) gates versus the classical FFT's O(n·2ⁿ) — exponentially cheaper to apply, encoding the spectrum in relative phases of the statevector.",
      es: "Aplica la transformada de Fourier en O(n²) puertas frente al O(n·2ⁿ) de la FFT clásica — exponencialmente más barato de aplicar, codificando el espectro en fases relativas del statevector.",
    },
    honest: {
      en: "Measurement returns one sample, so the transformed amplitudes are unreadable. That is why the QFT lives inside QPE and Shor, not as a faster spectrum calculator.",
      es: "La medición devuelve una sola muestra, así que las amplitudes transformadas son ilegibles. Por eso la QFT vive dentro de QPE y Shor, no como un calculador de espectros más rápido.",
    },
  },
  qpe: {
    advantage: "subroutine",
    relation: "\\hat\\varphi\\;\\text{to}\\;2^{-t}\\;\\text{bits}",
    teaches: {
      en: "Estimates an eigenphase φ of a unitary U to t bits (2⁻ᵗ resolution) using controlled-powers of U and an inverse QFT — the workhorse subroutine behind Shor and quantum chemistry.",
      es: "Estima una fase propia φ de un unitario U a t bits (resolución 2⁻ᵗ) usando potencias controladas de U y una QFT inversa — la subrutina caballo de batalla detrás de Shor y la química cuántica.",
    },
    honest: {
      en: "At this toy scale classical eigendecomposition returns φ exactly and instantly. QPE only earns its keep when U acts on an exponentially large space you cannot diagonalize.",
      es: "A esta escala de juguete la diagonalización clásica devuelve φ exacta e instantáneamente. QPE solo se gana su lugar cuando U actúa sobre un espacio exponencialmente grande imposible de diagonalizar.",
    },
  },
  shor: {
    advantage: "subroutine",
    relation: "N=15\\to 3\\times 5\\;(\\text{order-finding})",
    teaches: {
      en: "Factors N=15 by QPE order-finding on the real modular-multiplication unitary: find the period r of a^x mod N, then read the factors from gcd(a^{r/2}±1, N).",
      es: "Factoriza N=15 mediante búsqueda de orden con QPE sobre el unitario real de multiplicación modular: halla el período r de a^x mod N y lee los factores desde gcd(a^{r/2}±1, N).",
    },
    honest: {
      en: "A toy demonstration: RSA-2048 needs on the order of 10⁶ fault-tolerant qubits, so there is no near-term cryptographic threat. The exponential edge is real but asymptotic.",
      es: "Una demostración de juguete: RSA-2048 requiere del orden de 10⁶ qubits tolerantes a fallos, así que no hay amenaza criptográfica a corto plazo. La ventaja exponencial es real pero asintótica.",
    },
  },
  vqe: {
    advantage: "concept",
    relation: "E_0=\\min_{\\theta}\\langle\\psi(\\theta)|H|\\psi(\\theta)\\rangle",
    teaches: {
      en: "Variationally minimizes ⟨ψ(θ)|H|ψ(θ)⟩ over a parametrized ansatz to find the H₂ ground-state energy, matching full-CI to chemical accuracy along the dissociation curve (the first learned method).",
      es: "Minimiza variacionalmente ⟨ψ(θ)|H|ψ(θ)⟩ sobre un ansatz parametrizado para hallar la energía del estado base de H₂, igualando a FCI con precisión química a lo largo de la curva de disociación (el primer método aprendido).",
    },
    honest: {
      en: "H₂ in a minimal basis is a 4×4 problem classical diagonalization solves exactly — this is pedagogy and a NISQ template, not an advantage at this size.",
      es: "H₂ en base mínima es un problema 4×4 que la diagonalización clásica resuelve exactamente — esto es pedagogía y una plantilla NISQ, no una ventaja a este tamaño.",
    },
  },
  qml: {
    advantage: "none",
    relation: "K(x,x')=|\\langle\\phi(x)|\\phi(x')\\rangle|^2",
    teaches: {
      en: "Builds a quantum fidelity kernel K(x,x')=|⟨φ(x)|φ(x')⟩|² and feeds it to an SVM, compared head-to-head with a classical RBF-SVM on the same datasets (the second learned method).",
      es: "Construye un kernel cuántico de fidelidad K(x,x')=|⟨φ(x)|φ(x')⟩|² y lo alimenta a un SVM, comparado de tú a tú con un RBF-SVM clásico sobre los mismos datos (el segundo método aprendido).",
    },
    honest: {
      en: "On these datasets the quantum kernel ties or loses to the classical SVM — an honest QML hype-check: a quantum feature map is not automatically better.",
      es: "Sobre estos datos el kernel cuántico empata o pierde contra el SVM clásico — una verificación honesta del bombo de QML: un mapa de características cuántico no es automáticamente mejor.",
    },
  },
  maxcut: {
    advantage: "none",
    relation: "C(z)=\\sum_{(i,j)\\in E}\\tfrac{1}{2}(1-z_i z_j)",
    teaches: {
      en: "QAOA prepares a p-layer cost+mixer state to maximize the MaxCut objective, run identically in Qiskit, PennyLane and Cirq, against brute-force and greedy classical baselines.",
      es: "QAOA prepara un estado de p capas costo+mezclador para maximizar el objetivo de MaxCut, ejecutado idénticamente en Qiskit, PennyLane y Cirq, contra baselines clásicos de fuerza bruta y voraz.",
    },
    honest: {
      en: "At 3–6 nodes the exact optimum is found in microseconds; all three QAOA frameworks match but none beats classical — a faithful cross-framework parity check.",
      es: "Con 3–6 nodos el óptimo exacto se halla en microsegundos; los tres frameworks QAOA igualan pero ninguno supera al clásico — una verificación fiel de paridad entre frameworks.",
    },
  },
  noise: {
    advantage: "concept",
    relation: "\\hat E(0)=\\textstyle\\sum_k c_k\\,E(\\lambda_k)",
    teaches: {
      en: "Runs a circuit under an Aer noise model, then folds gates to amplify noise and Richardson-extrapolates the observable back to the zero-noise limit (ZNE), cutting error ~11×→1.5× as noise grows.",
      es: "Ejecuta un circuito bajo un modelo de ruido Aer, luego pliega puertas para amplificar el ruido y extrapola (Richardson) el observable al límite de ruido cero (ZNE), reduciendo el error ~11×→1.5× al crecer el ruido.",
    },
    honest: {
      en: "Mitigation is not correction — ZNE reduces bias but adds variance and does not scale. At this size the classical statevector is exact and free.",
      es: "La mitigación no es corrección — ZNE reduce el sesgo pero añade varianza y no escala. A este tamaño el statevector clásico es exacto y gratis.",
    },
  },
  "qec-repetition": {
    advantage: "concept",
    relation: "p_L\\sim (p/p_{th})^{\\lfloor d/2\\rfloor+1}",
    teaches: {
      en: "Encodes one logical bit across d physical qubits, decodes syndromes with MWPM (PyMatching), and shows d=5 beating d=3 below threshold — error correction that actually scales (Willow in miniature).",
      es: "Codifica un bit lógico en d qubits físicos, decodifica síndromes con MWPM (PyMatching) y muestra d=5 superando a d=3 por debajo del umbral — corrección de errores que sí escala (Willow en miniatura).",
    },
    honest: {
      en: "The repetition code only protects against bit-flips (one error basis); above threshold larger codes get worse. It is a stepping stone to the surface code.",
      es: "El código de repetición solo protege contra bit-flips (una base de error); por encima del umbral los códigos mayores empeoran. Es un peldaño hacia el código de superficie.",
    },
  },
  "qec-surface": {
    advantage: "concept",
    relation: "p_L\\propto (p/p_{th})^{(d+1)/2}",
    teaches: {
      en: "Runs a rotated surface code correcting both X and Z errors with MWPM decoding, exhibiting the threshold crossover: d=5 beats d=3 below ~1% and is worse above — the fault-tolerance front-runner.",
      es: "Ejecuta un código de superficie rotado que corrige errores X y Z con decodificación MWPM, exhibiendo el cruce de umbral: d=5 supera a d=3 por debajo de ~1% y empeora por encima — el favorito para la tolerancia a fallos.",
    },
    honest: {
      en: "Below threshold the logical error falls exponentially in distance; the cost is a large physical-qubit overhead. This is the architecture every roadmap targets, not a speedup.",
      es: "Por debajo del umbral el error lógico cae exponencialmente con la distancia; el costo es una gran sobrecarga de qubits físicos. Es la arquitectura que toda hoja de ruta persigue, no una aceleración.",
    },
  },
  teleportation: {
    advantage: "genuine",
    relation: "F=1\\;\\text{vs}\\;F_{cl}=2/3",
    teaches: {
      en: "Transfers an unknown qubit with fidelity 1 using a pre-shared Bell pair and 2 classical bits, where the best classical measure-and-resend strategy reaches only fidelity 2/3.",
      es: "Transfiere un qubit desconocido con fidelidad 1 usando un par de Bell compartido y 2 bits clásicos, donde la mejor estrategia clásica de medir-y-reenviar alcanza solo fidelidad 2/3.",
    },
    honest: {
      en: "A genuinely quantum protocol, but it consumes a Bell pair and 2 classical bits, destroys the original (no-cloning holds) and is not faster-than-light communication.",
      es: "Un protocolo genuinamente cuántico, pero consume un par de Bell y 2 bits clásicos, destruye el original (se preserva el no-clonado) y no es comunicación más rápida que la luz.",
    },
  },
  superdense: {
    advantage: "genuine",
    relation: "2\\;\\text{cbits per}\\;1\\;\\text{qubit}",
    teaches: {
      en: "Sends 2 classical bits by transmitting a single qubit, applying one of {I,X,Z,XZ} to half of a shared Bell pair — the dual of teleportation, beating the Holevo limit of 1 bit per qubit.",
      es: "Envía 2 bits clásicos transmitiendo un solo qubit, aplicando uno de {I,X,Z,XZ} a la mitad de un par de Bell compartido — el dual de la teletransportación, superando el límite de Holevo de 1 bit por qubit.",
    },
    honest: {
      en: "The edge is real but spends a pre-shared Bell pair — a resource trade, not free capacity. Without prior entanglement the Holevo bound of 1 bit/qubit holds.",
      es: "La ventaja es real pero gasta un par de Bell compartido — un intercambio de recursos, no capacidad gratis. Sin entrelazamiento previo se mantiene la cota de Holevo de 1 bit/qubit.",
    },
  },
  "single-qubit": {
    advantage: "concept",
    relation: "|\\psi\\rangle=\\cos\\tfrac\\theta2|0\\rangle+e^{i\\phi}\\sin\\tfrac\\theta2|1\\rangle",
    teaches: {
      en: "Drives a single qubit through gate sequences and traces its path on the Bloch sphere — the continuous (θ,φ) state space that is the substrate of every algorithm.",
      es: "Conduce un solo qubit a través de secuencias de puertas y traza su recorrido en la esfera de Bloch — el espacio de estados continuo (θ,φ) que es el sustrato de todo algoritmo.",
    },
    honest: {
      en: "A qubit roams the whole Bloch sphere yet stores at most one classical bit on measurement (Holevo) — rich dynamics, no standalone advantage.",
      es: "Un qubit recorre toda la esfera de Bloch pero al medir guarda como máximo un bit clásico (Holevo) — dinámica rica, sin ventaja aislada.",
    },
  },
  qrng: {
    advantage: "concept",
    relation: "H=n\\;\\text{bits},\\;P(\\text{each})=2^{-n}",
    teaches: {
      en: "Hadamards put n qubits into uniform superposition; measurement yields n bits of entropy with each outcome equally likely — randomness from the Born rule, not an algorithm.",
      es: "Las Hadamard ponen n qubits en superposición uniforme; la medición entrega n bits de entropía con cada resultado equiprobable — aleatoriedad de la regla de Born, no un algoritmo.",
    },
    honest: {
      en: "Statistically identical to a good PRNG; the quantum edge is certifiable true randomness (device-independent), not better statistics.",
      es: "Estadísticamente idéntico a un buen PRNG; la ventaja cuántica es aleatoriedad verdadera certificable (independiente del dispositivo), no mejores estadísticas.",
    },
  },
  interference: {
    advantage: "concept",
    relation: "P(0)=\\cos^2(\\varphi/2)",
    teaches: {
      en: "A Mach–Zehnder H·P(φ)·H produces the fringe P(0)=cos²(φ/2): amplitudes recombine constructively or destructively as the phase φ is swept — the steering of amplitude cancellation.",
      es: "Un Mach–Zehnder H·P(φ)·H produce la franja P(0)=cos²(φ/2): las amplitudes se recombinan constructiva o destructivamente al barrer la fase φ — el direccionamiento de la cancelación de amplitud.",
    },
    honest: {
      en: "A classical wave gives the same curve, so interference alone is no advantage — but steering amplitude cancellation is the engine of every quantum algorithm.",
      es: "Una onda clásica da la misma curva, así que la interferencia sola no es ventaja — pero direccionar la cancelación de amplitud es el motor de todo algoritmo cuántico.",
    },
  },
};

/** A safe lookup that never throws for an unmapped case id. */
export function casePhysics(id: string): CasePhysics | null {
  return CASE_PHYSICS[id] ?? null;
}
