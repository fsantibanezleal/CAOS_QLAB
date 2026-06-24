import { type TabDef, Tabs } from "../components/Tabs";
import { useUI } from "../lib/ui";
import { EngineDiagram } from "../viz/diagrams";

export function Implementation() {
  const { lang } = useUI();
  const en = lang === "en";

  const tabs: TabDef[] = [
    {
      id: "engine",
      label: en ? "Problem × Solver engine" : "Motor Problem × Solver",
      content: (
        <div className="method-body">
          <p>{en
            ? "QLab is not a folder of one-off scripts; it is a small engine with one execution path. A Problem declares what to compute (solver-agnostic); a Solver is a thin adapter over one real framework that returns a uniform SolverResult; the registry and pipeline are the plug-in seam. Adding a framework or a case is purely additive — one subclass and a decorator, nothing rewired."
            : "QLab no es una carpeta de scripts sueltos; es un motor pequeño con un solo camino de ejecución. Un Problem declara qué computar (agnóstico al solver); un Solver es un adaptador delgado sobre un framework real que devuelve un SolverResult uniforme; el registry y el pipeline son la costura de plug-in. Agregar un framework o un caso es puramente aditivo — una subclase y un decorador, sin recablear nada."}</p>
          <div className="arch-wrap"><EngineDiagram lang={lang} /></div>
          <pre className="code"><code>{`@register_solver
class QiskitQAOA(Solver):
    name, framework, paradigm = "qaoa-qiskit", "qiskit", QUANTUM_SIM
    def applicable(self, problem) -> bool:
        return problem.id == "maxcut"
    def run(self, problem, instance, seed, shots) -> SolverResult:
        ...  # the ONLY method that touches Qiskit`}</code></pre>
          <table className="impl-table">
            <thead><tr><th>{en ? "To add…" : "Para agregar…"}</th><th>{en ? "You write…" : "Escribes…"}</th><th>{en ? "You touch…" : "Tocas…"}</th></tr></thead>
            <tbody>
              <tr><td>{en ? "a framework/method" : "un framework/método"}</td><td><code>Solver</code> + <code>@register_solver</code></td><td>{en ? "nothing in core/pipeline/web" : "nada en core/pipeline/web"}</td></tr>
              <tr><td>{en ? "a problem" : "un problema"}</td><td><code>Problem</code> + <code>@register_problem</code></td><td>{en ? "nothing — solvers self-attach" : "nada — los solvers se enganchan solos"}</td></tr>
              <tr><td>{en ? "a hardware backend" : "un backend de hardware"}</td><td><code>Solver</code> · <code>paradigm="quantum-hardware"</code></td><td>{en ? "nothing — same trace, ran_on badge" : "nada — misma traza, badge ran_on"}</td></tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "contracts",
      label: en ? "Data contracts" : "Contratos de datos",
      content: (
        <div className="method-body">
          <p>{en
            ? "Two JSON contracts decouple the engine from the web. The trace (qlab-trace/1) is a replayable recording: for every step it stores the full statevector (2ⁿ complex amplitudes), the per-qubit reduced Bloch vector, and the basis probabilities, plus the final measurement histogram — and contains no Qiskit type, so the browser never depends on a Python library. A TypeScript mirror keeps the web in lockstep; drift fails the build."
            : "Dos contratos JSON desacoplan el motor de la web. La traza (qlab-trace/1) es una grabación reproducible: por cada paso guarda el statevector completo (2ⁿ amplitudes complejas), el vector de Bloch reducido por qubit y las probabilidades de base, más el histograma final de medición — y no contiene ningún tipo de Qiskit, así que el navegador nunca depende de una librería de Python. Un espejo TypeScript mantiene la web sincronizada; la divergencia rompe el build."}</p>
          <p>{en
            ? "The manifest (qlab-manifest/1) records the lane verdict, the seed/shots/params that reproduce the trace, the viz bindings (which renderers to mount), and the engine provenance. The web reads the set of manifests as its catalog."
            : "El manifiesto (qlab-manifest/1) registra el veredicto de carril, el seed/shots/params que reproducen la traza, los bindings de viz (qué renderers montar) y la procedencia del motor. La web lee el conjunto de manifiestos como su catálogo."}</p>
          <p className="honest-note"><strong>{en ? "Determinism is the contract — " : "El determinismo es el contrato — "}</strong>{en
            ? "a run is a pure function of (params, seed). The only stochastic step is measurement sampling, routed through one seeded NumPy generator, so committed counts reproduce exactly. Everything else is exact. Replay = truth."
            : "una corrida es una función pura de (params, seed). El único paso estocástico es el muestreo de medición, por un único generador NumPy con semilla, así que los conteos commiteados reproducen exactamente. Todo lo demás es exacto. Replay = verdad."}</p>
        </div>
      ),
    },
    {
      id: "gate",
      label: en ? "The measured gate" : "La compuerta medida",
      content: (
        <div className="method-body">
          <p>{en
            ? "Whether a case runs live in the browser or is precomputed is decided by measurement, not taste (qlab/core/gate.py). A case runs live only if all four hold:"
            : "Si un caso corre vivo en el navegador o se precomputa lo decide la medición, no el gusto (qlab/core/gate.py). Un caso corre vivo solo si se cumplen las cuatro:"}</p>
          <ul className="gate-list">
            <li><code>qubits ≤ 12</code> — {en ? "2ⁿ amplitudes must stay interactive in JS (~12 q ≈ 64 MB)." : "las 2ⁿ amplitudes deben seguir interactivas en JS (~12 q ≈ 64 MB)."}</li>
            <li><strong>{en ? "unitary-only" : "solo unitario"}</strong> — {en ? "no realistic noise (needs Aer), no mid-circuit measurement + feed-forward, no optimization loop." : "sin ruido realista (necesita Aer), sin medición intermedia + feed-forward, sin bucle de optimización."}</li>
            <li><code>run_ms ≤ 1500</code> — {en ? "the offline build time, a proxy for browser responsiveness." : "el tiempo de build offline, proxy de la respuesta del navegador."}</li>
            <li><code>trace_bytes ≤ ~1 MB</code>.</li>
          </ul>
          <p className="honest-note"><strong>{en ? "Mislabeling cannot ship — " : "El mal etiquetado no puede publicarse — "}</strong>{en
            ? "the verdict and the numbers behind it are written into the manifest, and CI fails the build if a live-tagged case breaches a gate. Worked examples: state-prep (≤4 q, pure unitary, ~1–2 ms) → live; maxcut (a p=1 QAOA carries an offline (γ,β) grid-search) → precompute."
            : "el veredicto y los números detrás se escriben en el manifiesto, y CI rompe el build si un caso etiquetado live viola una compuerta. Ejemplos: state-prep (≤4 q, unitario puro, ~1–2 ms) → live; maxcut (un QAOA p=1 lleva una búsqueda offline en grilla (γ,β)) → precompute."}</p>
        </div>
      ),
    },
    {
      id: "lanes",
      label: en ? "Three lanes" : "Tres carriles",
      content: (
        <div className="method-body">
          <table className="impl-table">
            <thead><tr><th></th><th>{en ? "Live" : "Vivo"}</th><th>{en ? "Precompute" : "Precómputo"}</th><th>{en ? "Real hardware (opt-in)" : "Hardware real (opt-in)"}</th></tr></thead>
            <tbody>
              <tr><td>{en ? "Runs on" : "Corre en"}</td><td>{en ? "visitor's browser" : "navegador del visitante"}</td><td>{en ? "local .venv" : ".venv local"}</td><td>{en ? "a real QPU" : "una QPU real"}</td></tr>
              <tr><td>{en ? "Engine" : "Motor"}</td><td>quantum-circuit (JS)</td><td>Qiskit+Aer · PennyLane · Stim</td><td>IBM Open / Braket / Azure</td></tr>
              <tr><td>{en ? "When" : "Cuándo"}</td><td>{en ? "clean unitary ≤12 q" : "unitario limpio ≤12 q"}</td><td>{en ? "noise, optimization, >12 q" : "ruido, optimización, >12 q"}</td><td>{en ? "the 'ran on real HW' moment" : "el momento 'corrió en HW real'"}</td></tr>
              <tr><td>{en ? "Cost" : "Costo"}</td><td>$0</td><td>{en ? "$0 (local)" : "$0 (local)"}</td><td>{en ? "free (IBM Open) → real $" : "gratis (IBM Open) → $ real"}</td></tr>
            </tbody>
          </table>
          <p className="honest-note"><strong>{en ? "Real hardware stays dormant — " : "El hardware real está inactivo — "}</strong>{en
            ? "it runs locally with a token from the private vault; the published static site ships no secrets and makes no live hardware calls. The cheapest honest path is IBM Quantum Open (free, ~10 min QPU on a 156-qubit Heron r2)."
            : "corre localmente con un token del vault privado; el sitio estático publicado no lleva secretos ni hace llamadas en vivo a hardware. El camino honesto más barato es IBM Quantum Open (gratis, ~10 min de QPU en un Heron r2 de 156 qubits)."}</p>
        </div>
      ),
    },
    {
      id: "adapters",
      label: en ? "Adapters & frameworks" : "Adaptadores y frameworks",
      content: (
        <div className="method-body">
          <p>{en
            ? "Each solver wraps exactly one real framework behind the uniform run(...) → SolverResult boundary; the framework import is guarded, so a missing optional dependency disables only that adapter (graceful degradation), never the lab. The web never imports a framework — it renders the generic JSON trace, so a new solver appears in the app the moment its trace is committed, with zero frontend change."
            : "Cada solver envuelve exactamente un framework real tras el borde uniforme run(...) → SolverResult; el import del framework está protegido, así que una dependencia opcional faltante desactiva solo ese adaptador (degradación elegante), nunca el lab. La web nunca importa un framework — renderiza la traza JSON genérica, así que un nuevo solver aparece en la app en cuanto su traza se commitea, sin cambio alguno en el frontend."}</p>
          <ul className="fw-list">
            <li><strong>Qiskit + Aer</strong> — {en ? "circuits, statevector, noise (density matrix)." : "circuitos, statevector, ruido (matriz densidad)."}</li>
            <li><strong>PennyLane</strong> — {en ? "differentiable: VQE (diff Hartree-Fock), QAOA, quantum kernels." : "diferenciable: VQE (Hartree-Fock dif.), QAOA, kernels cuánticos."}</li>
            <li><strong>Cirq</strong> — {en ? "a second independent circuit engine for cross-checks." : "un segundo motor de circuitos independiente para validación cruzada."}</li>
            <li><strong>Stim + PyMatching</strong> — {en ? "Clifford + MWPM decoder: repetition & surface codes." : "Clifford + decodificador MWPM: códigos de repetición y superficie."}</li>
            <li><strong>NumPy / scikit-learn</strong> — {en ? "the classical baselines (the spine)." : "los baselines clásicos (la columna)."}</li>
          </ul>
        </div>
      ),
    },
    {
      id: "deploy",
      label: "Deploy",
      content: (
        <div className="method-body">
          <p>{en
            ? "QLab is a static product: no application server, no request-time database, no backend that simulates on demand. The React SPA is built by Vite and served from GitHub Pages. The committed traces + manifests are overlaid into the published data directory at build time; the catalog is generated from the manifest set. A deep-link fallback (404 → index) keeps client-side routing working on Pages."
            : "QLab es un producto estático: sin servidor de aplicación, sin base de datos en tiempo de request, sin backend que simule a demanda. La SPA en React la construye Vite y se sirve desde GitHub Pages. Las trazas + manifiestos commiteados se superponen al directorio de datos publicado en tiempo de build; el catálogo se genera del conjunto de manifiestos. Un fallback de deep-link (404 → index) mantiene el ruteo en el cliente sobre Pages."}</p>
          <p className="fine">{en
            ? "Target: qlab.fasl-work.com (GitHub Pages, custom domain set via the Pages API). The repo flips public at deploy; the data overlay and deep-link fallback are documented in docs/architecture/05_deploy.md."
            : "Objetivo: qlab.fasl-work.com (GitHub Pages, dominio personalizado vía la API de Pages). El repo pasa a público en el deploy; el overlay de datos y el fallback de deep-link están en docs/architecture/05_deploy.md."}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="page doc-page">
      <div className="page-head">
        <h1>{en ? "Implementation" : "Implementación"}</h1>
        <p className="lede">
          {en
            ? "How the lab is built: a Problem × Solver engine with one execution path, two JSON data contracts, a measured live/precompute gate, three runtime lanes, thin per-framework adapters, and a static deploy."
            : "Cómo está construido el lab: un motor Problem × Solver con un solo camino de ejecución, dos contratos de datos JSON, una compuerta medida live/precómputo, tres carriles de runtime, adaptadores delgados por framework y un deploy estático."}
        </p>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}
