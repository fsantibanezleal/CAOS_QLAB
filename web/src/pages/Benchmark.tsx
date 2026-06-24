import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Bilingual, Catalog } from "../lib/contract.types";
import { loadCatalog } from "../lib/data";
import { useUI } from "../lib/ui";

type ClassId = "genuine" | "query" | "qec" | "classical";

const CLASSES: Record<ClassId, { label: Bilingual; color: string; blurb: Bilingual }> = {
  genuine: {
    label: { en: "Genuine edge — not a speedup", es: "Ventaja genuina — no un speedup" },
    color: "#3fb950",
    blurb: {
      en: "Quantum truly does something classical cannot — nonlocality, true randomness, a resource trade — but it is not a faster computation.",
      es: "Lo cuántico hace algo que lo clásico no puede — no-localidad, aleatoriedad verdadera, un canje de recursos — pero no es un cómputo más rápido.",
    },
  },
  query: {
    label: { en: "Asymptotic query advantage", es: "Ventaja asintótica de consultas" },
    color: "#5b8cff",
    blurb: {
      en: "A proven query/complexity separation (1 vs n, √N vs N, exponential) — real, but it only pays off at sizes far beyond today's noisy hardware.",
      es: "Una separación de consultas/complejidad probada (1 vs n, √N vs N, exponencial) — real, pero solo rinde a tamaños muy por encima del hardware ruidoso de hoy.",
    },
  },
  qec: {
    label: { en: "Error correction that scales", es: "Corrección de errores que escala" },
    color: "#a371f7",
    blurb: {
      en: "Not a speed axis at all: adding physical qubits makes the logical qubit better (below threshold) — the premise of fault tolerance, in miniature.",
      es: "No es un eje de velocidad: agregar qubits físicos mejora el qubit lógico (bajo umbral) — la premisa de la tolerancia a fallos, en miniatura.",
    },
  },
  classical: {
    label: { en: "Classical still wins (today)", es: "Lo clásico aún gana (hoy)" },
    color: "#7a8694",
    blurb: {
      en: "At these scales a classical computer matches or beats the quantum method in practice — the honest majority.",
      es: "A estas escalas una computadora clásica iguala o supera al método cuántico en la práctica — la mayoría honesta.",
    },
  },
};

interface LedgerEntry {
  id: string;
  cls: ClassId;
  verdict: Bilingual;
}

// Case-level honest verdicts (mirrored from docs/use-cases.md). Method names are pulled live from the catalog.
const LEDGER: LedgerEntry[] = [
  { id: "chsh", cls: "genuine", verdict: { en: "S = 2√2 > 2 — quantum genuinely beats the local-hidden-variable bound (Tsirelson; Nobel 2022). A nonlocality edge, not a speedup.", es: "S = 2√2 > 2 — lo cuántico supera genuinamente la cota de variables ocultas locales (Tsirelson; Nobel 2022). Ventaja de no-localidad, no un speedup." } },
  { id: "teleportation", cls: "genuine", verdict: { en: "Transfers an unknown qubit with fidelity 1 vs the classical 2/3 bound — but needs a shared Bell pair + 2 classical bits. No-cloning; not faster-than-light.", es: "Transfiere un qubit desconocido con fidelidad 1 vs la cota clásica 2/3 — pero requiere un par de Bell compartido + 2 bits clásicos. Sin clonación; no más rápido que la luz." } },
  { id: "superdense", cls: "genuine", verdict: { en: "2 classical bits delivered via 1 qubit (vs the Holevo limit of 1) — the dual of teleportation; it spends a pre-shared Bell pair (a resource trade).", es: "2 bits clásicos vía 1 qubit (vs el límite de Holevo de 1) — el dual de la teleportación; gasta un par de Bell precompartido (canje de recursos)." } },
  { id: "qrng", cls: "genuine", verdict: { en: "Statistically identical to a good PRNG — the quantum edge is certifiable true randomness (device-independent), not better statistics.", es: "Estadísticamente idéntico a un buen PRNG — la ventaja cuántica es aleatoriedad verdadera certificable (independiente del dispositivo), no mejores estadísticas." } },

  { id: "bernstein-vazirani", cls: "query", verdict: { en: "Recovers the hidden string in 1 quantum query vs n classical (one per bit) — a real query-complexity advantage via phase kickback.", es: "Recupera la cadena oculta en 1 consulta cuántica vs n clásicas (una por bit) — ventaja real de complejidad de consultas vía phase kickback." } },
  { id: "deutsch-jozsa", cls: "query", verdict: { en: "Decides constant vs balanced in 1 quantum query vs up to 2ⁿ⁻¹+1 classical — an exponential query gap (though trivial at this size).", es: "Decide constante vs balanceada en 1 consulta cuántica vs hasta 2ⁿ⁻¹+1 clásicas — brecha exponencial de consultas (aunque trivial a este tamaño)." } },
  { id: "simon", cls: "query", verdict: { en: "Finds the hidden period in O(n) quantum queries vs ~2^{n/2} classical — the first exponential separation, the seed of Shor.", es: "Encuentra el período oculto en O(n) consultas cuánticas vs ~2^{n/2} clásicas — la primera separación exponencial, la semilla de Shor." } },
  { id: "grover", cls: "query", verdict: { en: "Finds the marked item in ~√N queries vs the classical ~N/2 — a quadratic speedup, but asymptotic and erased by overheads at tiny N.", es: "Encuentra el ítem marcado en ~√N consultas vs el clásico ~N/2 — speedup cuadrático, pero asintótico y borrado por overheads a N pequeño." } },

  { id: "qec-repetition", cls: "qec", verdict: { en: "Error correction that scales: a distance-5 code beats distance-3 below threshold (Willow in miniature). Protects against bit-flips only.", es: "Corrección que escala: un código de distancia 5 supera al de distancia 3 bajo umbral (Willow en miniatura). Protege solo contra bit-flips." } },
  { id: "qec-surface", cls: "qec", verdict: { en: "The threshold crossover: distance-5 beats distance-3 below ~1%, worse above — and it corrects both X and Z. The fault-tolerance front-runner.", es: "El cruce de umbral: distancia 5 supera a distancia 3 bajo ~1%, peor arriba — y corrige X y Z. El favorito para tolerancia a fallos." } },

  { id: "state-prep", cls: "classical", verdict: { en: "A classical amplitude vector describes a 2–4 qubit state instantly; entanglement is the concept being taught, not an advantage here.", es: "Un vector de amplitudes clásico describe un estado de 2–4 qubits al instante; el entrelazamiento es el concepto que se enseña, no una ventaja aquí." } },
  { id: "single-qubit", cls: "classical", verdict: { en: "A qubit roams the whole Bloch sphere, but a measurement returns one bit and it stores ≤ 1 classical bit (Holevo) — no advantage alone.", es: "Un qubit recorre toda la esfera de Bloch, pero una medición devuelve un bit y almacena ≤ 1 bit clásico (Holevo) — sin ventaja por sí solo." } },
  { id: "qft", cls: "classical", verdict: { en: "Applies the transform in O(n²) gates vs classical O(n·2ⁿ) — but the amplitudes are unreadable, so it is a subroutine, never a standalone win.", es: "Aplica la transformada en O(n²) compuertas vs O(n·2ⁿ) clásico — pero las amplitudes son ilegibles, así que es una subrutina, nunca una victoria por sí sola." } },
  { id: "qpe", cls: "classical", verdict: { en: "Estimates an eigenphase to 2⁻ᵗ; for the tiny U here classical diagonalization is exact and instant. QPE only matters as a subroutine for huge U.", es: "Estima una eigenfase a 2⁻ᵗ; para la U diminuta de aquí la diagonalización clásica es exacta e instantánea. QPE solo importa como subrutina para U enorme." } },
  { id: "shor", cls: "classical", verdict: { en: "Factors 15 → 3×5 via order-finding — but RSA-2048 needs ~10⁶ fault-tolerant qubits (Gidney 2025). No near-term cryptographic threat.", es: "Factoriza 15 → 3×5 vía order-finding — pero RSA-2048 necesita ~10⁶ qubits tolerantes a fallos (Gidney 2025). Sin amenaza criptográfica cercana." } },
  { id: "vqe", cls: "classical", verdict: { en: "Matches full-CI to chemical accuracy along the H₂ curve — but minimal-basis H₂ is a 4×4 problem classical solves exactly. Pedagogy, not advantage.", es: "Iguala full-CI con precisión química en la curva de H₂ — pero H₂ en base mínima es un problema 4×4 que lo clásico resuelve exacto. Pedagogía, no ventaja." } },
  { id: "qml", cls: "classical", verdict: { en: "The quantum fidelity-kernel SVM ties or loses to a classical RBF-SVM on every dataset — no advantage. The honest QML hype check.", es: "El SVM de kernel de fidelidad cuántico empata o pierde contra un RBF-SVM clásico en cada dataset — sin ventaja. El chequeo honesto al hype de QML." } },
  { id: "maxcut", cls: "classical", verdict: { en: "Brute force finds the exact optimum in microseconds; all three QAOA frameworks reach it but none beats it. A faithful no-advantage result.", es: "La fuerza bruta halla el óptimo exacto en microsegundos; los tres frameworks QAOA lo alcanzan pero ninguno lo supera. Un resultado fiel de no-ventaja." } },
  { id: "noise", cls: "classical", verdict: { en: "ZNE claws error back (≈11×→1.5×) but is bias-reduction, not correction — and a classical statevector simulator returns the exact answer for free here.", es: "ZNE recupera error (≈11×→1.5×) pero es reducción de sesgo, no corrección — y un simulador de statevector clásico devuelve la respuesta exacta gratis aquí." } },
];

function MethodNames(cat: Catalog | null) {
  const map = new Map<string, { quantum: Bilingual; qframe: string; classical: Bilingual }>();
  if (!cat) return map;
  for (const c of cat.cases) {
    const solvers = c.variants.flatMap((v) => v.solvers);
    const q = solvers.find((s) => s.paradigm !== "classical");
    const cl = solvers.find((s) => s.paradigm === "classical");
    if (q && cl) map.set(c.id, { quantum: q.label, qframe: q.framework, classical: cl.label });
  }
  return map;
}

export function Benchmark() {
  const { lang } = useUI();
  const en = lang === "en";
  const [cat, setCat] = useState<Catalog | null>(null);
  useEffect(() => { loadCatalog().then(setCat).catch(() => {}); }, []);
  const methods = useMemo(() => MethodNames(cat), [cat]);
  const titles = useMemo(() => {
    const m = new Map<string, Bilingual>();
    cat?.cases.forEach((c) => m.set(c.id, c.title));
    return m;
  }, [cat]);

  const counts = useMemo(() => {
    const c: Record<ClassId, number> = { genuine: 0, query: 0, qec: 0, classical: 0 };
    LEDGER.forEach((e) => { c[e.cls]++; });
    return c;
  }, []);
  const order: ClassId[] = ["genuine", "query", "qec", "classical"];

  return (
    <div className="page doc-page">
      <div className="page-head">
        <h1>Benchmark</h1>
        <p className="lede">
          {en
            ? "The honesty spine, quantified. Every case runs a quantum method next to a classical baseline; here is the head-to-head verdict for all 19 — and the honest scorecard of where, and in what sense, quantum actually wins."
            : "La columna de honestidad, cuantificada. Cada caso corre un método cuántico junto a un baseline clásico; aquí está el veredicto head-to-head para los 19 — y el marcador honesto de dónde, y en qué sentido, lo cuántico realmente gana."}
        </p>
      </div>

      <div className="callout">
        <strong>{en ? "Scorecard — 0 of 19 cases show a practical, pay-for-it speedup today." : "Marcador — 0 de 19 casos muestran un speedup práctico y rentable hoy."}</strong>{" "}
        {en
          ? "That is the honest headline, and it is by design: the lab is built to show it. What quantum does deliver splits into three real, narrower kinds of edge — and a majority where classical still wins."
          : "Ese es el titular honesto, y es a propósito: el lab está hecho para mostrarlo. Lo que lo cuántico sí entrega se divide en tres tipos reales y más estrechos de ventaja — y una mayoría donde lo clásico aún gana."}
      </div>

      <div className="bench-bar">
        {order.map((k) => (
          <div key={k} className="bench-seg" style={{ flex: counts[k], background: CLASSES[k].color }}
               title={`${CLASSES[k].label[lang]}: ${counts[k]}`}>
            {counts[k]}
          </div>
        ))}
      </div>
      <div className="bench-legend">
        {order.map((k) => (
          <span key={k} className="bench-leg-item">
            <span className="swatch" style={{ background: CLASSES[k].color }} /> {CLASSES[k].label[lang]} ({counts[k]})
          </span>
        ))}
      </div>

      {order.map((k) => (
        <section key={k} className="doc-section">
          <h2 style={{ color: CLASSES[k].color }}>{CLASSES[k].label[lang]} · {counts[k]}</h2>
          <p className="fine">{CLASSES[k].blurb[lang]}</p>
          <div className="bench-cards">
            {LEDGER.filter((e) => e.cls === k).map((e) => {
              const m = methods.get(e.id);
              const title = titles.get(e.id)?.[lang] ?? e.id;
              return (
                <Link to={`/case/${e.id}`} key={e.id} className="bench-card" style={{ borderLeftColor: CLASSES[k].color }}>
                  <div className="bench-card-head">
                    <strong>{title}</strong>
                    {m && (
                      <span className="bench-vs">
                        <span className="q">{m.quantum[lang]}</span>
                        <span className="vs">vs</span>
                        <span className="c">{m.classical[lang]}</span>
                      </span>
                    )}
                  </div>
                  <p>{e.verdict[lang]}</p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <section className="doc-section refs">
        <h3>{en ? "Why this framing" : "Por qué este encuadre"}</h3>
        <p className="fine">
          {en
            ? "“Advantage” is overloaded. A query-complexity separation, a nonlocality result, and a fault-tolerance threshold are all real and all different from “my program finished sooner on a problem I care about.” QLab keeps them distinct so the honest 2025–26 answer — not yet, for any pay-for-it speedup — stays legible. Sourced verdicts: docs/use-cases.md; the hardware reality: docs/state-of-the-art.md."
            : "“Ventaja” está sobrecargada. Una separación de complejidad de consultas, un resultado de no-localidad y un umbral de tolerancia a fallos son todos reales y todos distintos de “mi programa terminó antes en un problema que me importa”. QLab los mantiene separados para que la respuesta honesta 2025–26 — todavía no, para ningún speedup rentable — siga siendo legible. Veredictos: docs/use-cases.md; realidad de hardware: docs/state-of-the-art.md."}
        </p>
      </section>
    </div>
  );
}
