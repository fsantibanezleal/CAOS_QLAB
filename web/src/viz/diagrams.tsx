// Hand-authored, themed architecture diagrams (ADR-0058 — the in-app ⓘ modal).
// Every colour is a CSS-variable PALETTE TOKEN (var(--accent), var(--good), var(--warn),
// var(--border), var(--panel), var(--panel-2), var(--fg), var(--fg-subtle), var(--accent-soft)).
// ZERO hardcoded hex — the only `#` allowed are HTML entities (&#8594; &#8804; &#215; &#8776; …).
// The SVGs are inlined in the React DOM (not <img>), so they inherit the live theme variables;
// each carries a <style> block with the semantic class vocabulary required by the FLOOR.
//
// Class vocabulary (per the ADR FLOOR):
//   .bx box · .bx-hi key/primary (accent) · .bx-web web lane (good) · .bx-compute offline/compute
//   .bx-gate gate/warn · .band lane/band container · .ttl box title · .sub box subtitle (muted)
//   .it item line · .cd.mono real code path (accent mono) · .mu caveat (muted) · .eq equation (mono)
//   .flow arrow · .lbl flow label (muted) · .hd band heading · .pill chip

type Lang = "en" | "es";

// One shared <style> block — identical rules in every SVG (harmless to repeat in the DOM),
// so a single source of truth for the class vocabulary. All colours are palette tokens.
const ARCH_CSS = `
  .arch-svg text { font-family: ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif; }
  .arch-svg .band { fill: var(--accent-soft); stroke: var(--border); stroke-width: 1; opacity: 0.55; }
  .arch-svg .bandl { fill: var(--fg-subtle); font: 700 10px ui-monospace, monospace;
    text-transform: uppercase; letter-spacing: 0.08em; }
  .arch-svg .bx { fill: var(--panel); stroke: var(--border); stroke-width: 1.2; }
  .arch-svg .bx-hi { fill: var(--panel); stroke: var(--accent); stroke-width: 1.6; }
  .arch-svg .bx-web { fill: var(--panel); stroke: var(--good); stroke-width: 1.5; }
  .arch-svg .bx-compute { fill: var(--panel); stroke: var(--edge-qec); stroke-width: 1.4; }
  .arch-svg .bx-gate { fill: var(--panel); stroke: var(--warn); stroke-width: 1.5; }
  .arch-svg .bx-store { fill: var(--accent-soft); stroke: var(--accent); stroke-width: 1.4; }
  .arch-svg .bx-dim { fill: var(--panel); stroke: var(--border); stroke-width: 1.1; stroke-dasharray: 4 3; opacity: 0.85; }
  .arch-svg .ttl { fill: var(--fg); font: 600 12.5px ui-sans-serif, system-ui; }
  .arch-svg .ttl-hi { fill: var(--accent); font: 700 12.5px ui-sans-serif, system-ui; }
  .arch-svg .ttl-web { fill: var(--good); font: 700 12.5px ui-sans-serif, system-ui; }
  .arch-svg .ttl-warn { fill: var(--warn); font: 700 12.5px ui-sans-serif, system-ui; }
  .arch-svg .sub { fill: var(--fg-subtle); font: 10px ui-sans-serif, system-ui; }
  .arch-svg .it { fill: var(--fg); font: 10.5px ui-sans-serif, system-ui; }
  .arch-svg .cd { fill: var(--accent); font: 10px ui-monospace, "Cascadia Code", monospace; }
  .arch-svg .mu { fill: var(--fg-subtle); font: italic 9.5px ui-sans-serif, system-ui; }
  .arch-svg .eq { fill: var(--fg); font: 11px "Cambria Math", Cambria, ui-monospace, monospace; }
  .arch-svg .eqbox { fill: var(--accent-soft); stroke: var(--border); stroke-width: 1; }
  .arch-svg .flow { fill: none; stroke: var(--fg-subtle); stroke-width: 1.5; opacity: 0.85; }
  .arch-svg .flow-hi { fill: none; stroke: var(--accent); stroke-width: 1.6; }
  .arch-svg .lbl { fill: var(--fg-subtle); font: 9.5px ui-monospace, monospace; }
  .arch-svg .lbl-em { fill: var(--accent); font: 600 9.5px ui-monospace, monospace; }
  .arch-svg .ah { fill: var(--fg-subtle); }
  .arch-svg .ah-hi { fill: var(--accent); }
`;

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto-start-reverse">
        <path d="M0 0 L6.5 3 L0 6 Z" className="ah" />
      </marker>
      <marker id={`${id}-hi`} markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto-start-reverse">
        <path d="M0 0 L6.5 3 L0 6 Z" className="ah-hi" />
      </marker>
    </defs>
  );
}

/* ============================================================================
   TAB 1 — The app + the design/build lifecycle flow.
   research/fiche → implement engine → precompute/bake trace → build SPA → deploy.
   ========================================================================= */
export function AppLifecycleDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "qa-life";
  return (
    <svg viewBox="0 0 880 470" width="880" className="arch-svg" role="img"
         aria-label={en ? "QLab app and design-build lifecycle" : "App QLab y ciclo de diseño-construcción"}>
      <style>{ARCH_CSS}</style>
      <Defs id={m} />

      {/* what the app IS */}
      <rect className="bx-hi" x="14" y="14" width="852" height="86" rx="10" />
      <text className="ttl-hi" x="28" y="36">{en ? "What QLab is" : "Qué es QLab"}</text>
      <text className="it" x="28" y="56">{en ? "A static quantum-computing lab: 20 use-cases, each a real" : "Un laboratorio cuántico estático: 20 casos, cada uno un"}</text>
      <text className="it" x="28" y="71">{en ? "circuit run, quantum method vs an honest classical baseline." : "circuito real, método cuántico vs línea base clásica honesta."}</text>
      <text className="cd" x="28" y="89">qlab/  ·  web/  ·  data/artifacts/  ·  manifests/</text>
      <text className="sub" x="560" y="56">{en ? "No server · no DB · no secrets on the web." : "Sin servidor · sin BD · sin secretos en la web."}</text>
      <text className="sub" x="560" y="71">{en ? "Every case: live re-sim OR replay a seeded trace." : "Cada caso: re-sim vivo O replay de traza con semilla."}</text>
      <text className="mu" x="560" y="89">{en ? "the deterministic core is truth; the web only renders it" : "el núcleo determinista es la verdad; la web solo lo renderiza"}</text>

      {/* lifecycle band */}
      <rect className="band" x="14" y="120" width="852" height="2" />
      <text className="bandl" x="14" y="138">{en ? "Design-build lifecycle (left → right)" : "Ciclo de diseño-construcción (izq → der)"}</text>

      {/* 5 stages */}
      {[
        { x: 14, cls: "bx", t: en ? "1 · Research / fiche" : "1 · Investigar / ficha",
          cd: "docs/use-cases/*.md", a: en ? "algorithm, equations" : "algoritmo, ecuaciones", b: en ? "+ refs (DOIs)" : "+ refs (DOIs)", c: en ? "decide live vs precompute" : "decidir vivo vs precómputo" },
        { x: 188, cls: "bx", t: en ? "2 · Implement engine" : "2 · Implementar motor",
          cd: "qlab/problems/<name>.py", a: en ? "Problem + Solver adapters" : "Problem + adaptadores Solver", b: "qlab/solvers/*_solvers.py", c: en ? "one adapter per framework" : "un adaptador por framework" },
        { x: 362, cls: "bx-compute", t: en ? "3 · Precompute / bake" : "3 · Precomputar / hornear",
          cd: "python -m qlab.pipeline", a: en ? "run all solvers, seed 42" : "corre todos los solvers, semilla 42", b: "data/artifacts/ + manifests/", c: en ? "seeded JSON trace committed" : "traza JSON con semilla, commiteada" },
        { x: 536, cls: "bx-web", t: en ? "4 · Build SPA" : "4 · Construir SPA",
          cd: "web/  (React + Vite)", a: "prebuild: copy-data.mjs", b: en ? "overlay traces + manifests" : "superpone trazas + manifiestos", c: en ? "live engine inlined (TS)" : "motor vivo inline (TS)" },
        { x: 710, cls: "bx-hi", t: en ? "5 · Deploy" : "5 · Desplegar",
          cd: "deploy-pages.yml", a: "GitHub Pages · CDN", b: en ? "static dist/  → public URL" : "dist/ estático → URL pública", c: en ? "new trace → re-publishes" : "nueva traza → re-publica" },
      ].map((s, i) => (
        <g key={i}>
          <rect className={s.cls} x={s.x} y="150" width="156" height="128" rx="9" />
          <text className={s.cls === "bx-hi" ? "ttl-hi" : s.cls === "bx-web" ? "ttl-web" : "ttl"} x={s.x + 12} y="172">{s.t}</text>
          <text className="cd" x={s.x + 12} y="192">{s.cd}</text>
          <text className="it" x={s.x + 12} y="212">{s.a}</text>
          <text className="it" x={s.x + 12} y="228">{s.b}</text>
          <text className="mu" x={s.x + 12} y="248" style={{ }}>{s.c}</text>
          {i < 4 && <path className="flow" d={`M${s.x + 156} 214 L${s.x + 174} 214`} markerEnd={`url(#${m})`} />}
        </g>
      ))}

      {/* feedback loop */}
      <path className="flow-hi" d="M788 278 C 788 330, 92 330, 92 282" markerEnd={`url(#${m}-hi)`} />
      <text className="lbl-em" x="350" y="324">{en ? "iterate: refine fiche, re-bake, re-deploy" : "iterar: afinar ficha, re-hornear, re-desplegar"}</text>

      {/* the six pages footer band */}
      <rect className="band" x="14" y="350" width="852" height="2" />
      <text className="bandl" x="14" y="368">{en ? "What ships — the SPA surface" : "Lo que se publica — la SPA"}</text>
      {[
        { x: 14, t: "App", s: en ? "the workbench" : "el banco de trabajo" },
        { x: 160, t: "Introduction", s: en ? "what & why" : "qué y por qué" },
        { x: 306, t: "Methodology", s: en ? "method ladder" : "escalera de métodos" },
        { x: 452, t: "Implementation", s: en ? "engine + lanes" : "motor + carriles" },
        { x: 598, t: "Experiments", s: en ? "results, honest" : "resultados, honestos" },
        { x: 744, t: "Benchmark", s: en ? "Q vs classical" : "Q vs clásico" },
      ].map((p, i) => (
        <g key={i}>
          <rect className="bx" x={p.x} y="378" width="122" height="62" rx="8" />
          <text className="ttl" x={p.x + 12} y="402">{p.t}</text>
          <text className="sub" x={p.x + 12} y="422">{p.s}</text>
        </g>
      ))}
      <text className="mu" x="14" y="460">{en ? "App re-runs the engine live on its controls; the doc pages illustrate the method with the same themed SVGs." : "App re-corre el motor en vivo con sus controles; las páginas-doc ilustran el método con los mismos SVG temáticos."}</text>
    </svg>
  );
}

/* ============================================================================
   TAB 2 — The three lanes: web (live) / offline (precompute) / compute (hardware).
   ========================================================================= */
export function ThreeLaneDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "qa-lane";
  return (
    <svg viewBox="0 0 880 460" width="880" className="arch-svg" role="img"
         aria-label={en ? "QLab three lanes — web, offline, compute" : "Tres carriles de QLab — web, offline, cómputo"}>
      <style>{ARCH_CSS}</style>
      <Defs id={m} />

      {/* WEB lane */}
      <rect className="band" x="14" y="14" width="430" height="150" rx="8" />
      <text className="bandl" x="28" y="34">{en ? "WEB — live, in the visitor's browser" : "WEB — vivo, en el navegador del visitante"}</text>
      <rect className="bx-web" x="28" y="44" width="402" height="106" rx="9" />
      <text className="ttl-web" x="42" y="66">{en ? "Live lane — exact state-vector engine" : "Carril vivo — motor de statevector exacto"}</text>
      <text className="cd" x="42" y="86">web/src/live/statevector.ts</text>
      <text className="it" x="42" y="104">{en ? "small clean unitary circuits, ≤ 12 qubits" : "circuitos unitarios limpios, ≤ 12 qubits"}</text>
      <text className="it" x="42" y="120">{en ? "re-simulates on every slider move · $0 server" : "re-simula con cada slider · $0 servidor"}</text>
      <text className="mu" x="42" y="138">{en ? "hand-written TS — Qiskit has no Pyodide wheels" : "TS escrito a mano — Qiskit no tiene wheels Pyodide"}</text>

      {/* OFFLINE lane */}
      <rect className="band" x="14" y="178" width="430" height="158" rx="8" />
      <text className="bandl" x="28" y="198">{en ? "OFFLINE — local .venv precompute" : "OFFLINE — precómputo local .venv"}</text>
      <rect className="bx-compute" x="28" y="208" width="402" height="116" rx="9" />
      <text className="ttl" x="42" y="230">{en ? "Precompute lane — the real heavy engines" : "Carril precómputo — los motores reales pesados"}</text>
      <text className="cd" x="42" y="250">python -m qlab.pipeline &lt;case&gt;</text>
      <text className="it" x="42" y="268">Qiskit + Aer · PennyLane · Cirq · Stim</text>
      <text className="it" x="42" y="284">{en ? "noise · feed-forward · VQE/QAOA loop · &gt; 12 q" : "ruido · feed-forward · loop VQE/QAOA · &gt; 12 q"}</text>
      <text className="mu" x="42" y="302">{en ? "commits a seeded trace + manifest to git" : "commitea traza con semilla + manifiesto a git"}</text>
      <text className="mu" x="42" y="318">{en ? "+ the classical baseline runs here too" : "+ la línea base clásica corre aquí también"}</text>

      {/* COMPUTE / hardware lane (dormant) */}
      <rect className="band" x="14" y="350" width="430" height="98" rx="8" />
      <text className="bandl" x="28" y="370">{en ? "COMPUTE — real QPU (opt-in, local-only)" : "CÓMPUTO — QPU real (opcional, solo local)"}</text>
      <rect className="bx-dim" x="28" y="380" width="402" height="58" rx="9" />
      <text className="ttl" x="42" y="402">{en ? "Real-hardware replay — dormant" : "Replay de hardware real — inactivo"}</text>
      <text className="cd" x="42" y="420">qlab/solvers/hardware_solvers.py</text>
      <text className="mu" x="262" y="402">IBM Open · Braket · Azure</text>
      <text className="mu" x="262" y="420">{en ? "token from the vault, never on the web" : "token del vault, nunca en la web"}</text>

      {/* converge to one artifact */}
      <path className="flow-hi" d="M444 97 C 500 97, 500 215, 540 215" markerEnd={`url(#${m}-hi)`} />
      <path className="flow-hi" d="M444 266 L540 248" markerEnd={`url(#${m}-hi)`} />
      <path className="flow" d="M444 409 C 500 409, 500 281, 540 281" markerEnd={`url(#${m})`} />
      <text className="lbl-em" x="452" y="160">{en ? "all three emit ONE artifact shape" : "los tres emiten UNA forma de artefacto"}</text>

      <rect className="bx-store" x="540" y="200" width="150" height="98" rx="10" />
      <text className="ttl-hi" x="552" y="222">qlab-trace/1</text>
      <text className="sub" x="552" y="240">{en ? "statevector · Bloch" : "statevector · Bloch"}</text>
      <text className="sub" x="552" y="256">{en ? "probs · counts · seeded" : "probs · conteos · semilla"}</text>
      <text className="cd" x="552" y="276">core/trace.py</text>
      <text className="mu" x="552" y="293">{en ? "replay = truth" : "replay = verdad"}</text>

      <path className="flow-hi" d="M690 249 L730 249" markerEnd={`url(#${m}-hi)`} />
      <text className="lbl" x="694" y="242">{en ? "one render path" : "un render"}</text>

      <rect className="bx-hi" x="730" y="200" width="136" height="98" rx="10" />
      <text className="ttl-hi" x="742" y="222">{en ? "Static SPA" : "SPA estática"}</text>
      <text className="sub" x="742" y="240">React · Vite</text>
      <text className="sub" x="742" y="256">GitHub Pages</text>
      <text className="it" x="742" y="276">{en ? "animates the" : "anima la"}</text>
      <text className="it" x="742" y="290">{en ? "trace, identically" : "traza, igual"}</text>

      <text className="mu" x="14" y="430">{en ? '"Live" is slider-responsiveness, not a different model — the renderer never knows which lane produced a trace.' : '"Vivo" es responder al slider, no otro modelo — el renderer no sabe qué carril produjo la traza.'}</text>
    </svg>
  );
}

/* ============================================================================
   TAB 3 — The web-app flow: App re-runs the engine live on controls; pages;
   the contract-type mirror that gates the build; copy-data overlay; Pages deploy.
   ========================================================================= */
export function WebAppFlowDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "qa-web";
  return (
    <svg viewBox="0 0 880 440" width="880" className="arch-svg" role="img"
         aria-label={en ? "The QLab web-app flow" : "El flujo de la app web de QLab"}>
      <style>{ARCH_CSS}</style>
      <Defs id={m} />

      {/* user controls */}
      <rect className="bx-hi" x="14" y="18" width="190" height="150" rx="9" />
      <text className="ttl-hi" x="26" y="40">{en ? "App — the workbench" : "App — banco de trabajo"}</text>
      <text className="cd" x="26" y="60">web/src/pages/App.tsx</text>
      <text className="it" x="26" y="80">{en ? "case selector (by category)" : "selector de casos (por categoría)"}</text>
      <text className="it" x="26" y="96">{en ? "variant bar + live sliders" : "barra de variantes + sliders"}</text>
      <text className="it" x="26" y="112">{en ? "Q-vs-classical read-out" : "lectura Q-vs-clásico"}</text>
      <text className="cd" x="26" y="132">viz/ AmplitudeBars · Bloch</text>
      <text className="cd" x="26" y="148">viz/ Histogram · Landscape</text>
      <text className="mu" x="26" y="164">{en ? "reacts to its selector" : "reacciona a su selector"}</text>

      {/* live branch */}
      <path className="flow-hi" d="M204 70 L262 70" markerEnd={`url(#${m}-hi)`} />
      <text className="lbl-em" x="208" y="62">{en ? "slider moves → re-run" : "slider → re-corre"}</text>
      <rect className="bx-web" x="262" y="40" width="200" height="64" rx="9" />
      <text className="ttl-web" x="274" y="62">{en ? "Live re-sim (browser)" : "Re-sim vivo (navegador)"}</text>
      <text className="cd" x="274" y="80">live/liveTrace.ts</text>
      <text className="mu" x="274" y="97">{en ? "exact statevector, instantly" : "statevector exacto, al instante"}</text>

      {/* precompute branch */}
      <path className="flow" d="M204 130 L262 130" markerEnd={`url(#${m})`} />
      <text className="lbl" x="208" y="122">{en ? "else → replay" : "si no → replay"}</text>
      <rect className="bx" x="262" y="116" width="200" height="64" rx="9" />
      <text className="ttl" x="274" y="138">{en ? "Replay committed trace" : "Replay de traza commiteada"}</text>
      <text className="cd" x="274" y="156">lib/data.ts → /artifacts</text>
      <text className="mu" x="274" y="173">{en ? "step scrubber over the trace" : "scrubber paso a paso sobre la traza"}</text>

      {/* both feed the renderers */}
      <path className="flow-hi" d="M462 72 C 510 72, 510 95, 540 95" markerEnd={`url(#${m}-hi)`} />
      <path className="flow" d="M462 148 C 510 148, 510 125, 540 125" markerEnd={`url(#${m})`} />
      <rect className="bx-store" x="540" y="78" width="200" height="64" rx="9" />
      <text className="ttl-hi" x="552" y="100">{en ? "One render path" : "Un solo render"}</text>
      <text className="cd" x="552" y="118">qlab-trace/1 → viz/*</text>
      <text className="mu" x="552" y="135">{en ? "same code for both lanes" : "mismo código en ambos carriles"}</text>

      {/* copy-data overlay band */}
      <rect className="band" x="14" y="206" width="852" height="2" />
      <text className="bandl" x="14" y="224">{en ? "Build pipeline — how the data + types get into the bundle" : "Pipeline de build — cómo entran datos + tipos al bundle"}</text>

      <rect className="bx" x="14" y="236" width="196" height="92" rx="9" />
      <text className="ttl" x="26" y="258">{en ? "Committed data" : "Datos commiteados"}</text>
      <text className="cd" x="26" y="278">data/artifacts/*.json</text>
      <text className="cd" x="26" y="294">manifests/*.json</text>
      <text className="mu" x="26" y="314">{en ? "traces + per-case index" : "trazas + índice por caso"}</text>

      <path className="flow" d="M210 282 L246 282" markerEnd={`url(#${m})`} />
      <text className="lbl" x="212" y="274">prebuild</text>
      <rect className="bx-web" x="246" y="236" width="196" height="92" rx="9" />
      <text className="ttl-web" x="258" y="258">{en ? "Data overlay" : "Overlay de datos"}</text>
      <text className="cd" x="258" y="278">web/copy-data.mjs</text>
      <text className="it" x="258" y="296">{en ? "copies traces into dist/" : "copia trazas a dist/"}</text>
      <text className="mu" x="258" y="314">{en ? "engine inlined where needed" : "motor inline donde hace falta"}</text>

      <path className="flow" d="M442 282 L478 282" markerEnd={`url(#${m})`} />
      <text className="lbl">{""}</text>
      <rect className="bx-gate" x="478" y="236" width="200" height="92" rx="9" />
      <text className="ttl-warn" x="490" y="258">{en ? "Contract-type mirror" : "Espejo de tipos del contrato"}</text>
      <text className="cd" x="490" y="278">lib/contract.types.ts</text>
      <text className="it" x="490" y="296">{en ? "TS mirror of the Python schema" : "espejo TS del esquema Python"}</text>
      <text className="mu" x="490" y="314">{en ? "divergence breaks the build (ADR-0057)" : "divergencia rompe el build (ADR-0057)"}</text>

      <path className="flow-hi" d="M678 282 L714 282" markerEnd={`url(#${m}-hi)`} />
      <text className="lbl">{""}</text>
      <rect className="bx-hi" x="714" y="236" width="152" height="92" rx="9" />
      <text className="ttl-hi" x="726" y="258">{en ? "Static dist/" : "dist/ estático"}</text>
      <text className="cd" x="726" y="278">deploy-pages.yml</text>
      <text className="it" x="726" y="296">GitHub Pages · CDN</text>
      <text className="mu" x="726" y="314">{en ? "404.html = deep-link SPA fallback" : "404.html = fallback SPA"}</text>

      <text className="mu" x="14" y="362">{en ? "Copy-data overlays the seeded traces; the TypeScript mirror gates the build so the web schema can never silently drift from the Python one." : "Copy-data superpone las trazas con semilla; el espejo TypeScript controla el build para que el esquema web no se desincronice del de Python."}</text>
      <text className="mu" x="14" y="382">{en ? "Result: a single static bundle — no server, no database, no secrets — that re-runs small circuits live and replays the rest." : "Resultado: un único bundle estático — sin servidor, BD ni secretos — que re-corre circuitos pequeños en vivo y reproduce el resto."}</text>
    </svg>
  );
}

/* ============================================================================
   TAB 4 — The science / algorithm flow: real steps + equations.
   H·P(φ)·H interference · QAOA cost+mixer layers · Grover oracle+diffusion · VQE.
   ========================================================================= */
export function ScienceDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "qa-sci";
  return (
    <svg viewBox="0 0 880 560" width="880" className="arch-svg" role="img"
         aria-label={en ? "The quantum methods and their equations" : "Los métodos cuánticos y sus ecuaciones"}>
      <style>{ARCH_CSS}</style>
      <Defs id={m} />

      {/* Interference */}
      <rect className="bx-hi" x="14" y="16" width="420" height="120" rx="9" />
      <text className="ttl-hi" x="26" y="38">{en ? "Interference — the one-qubit interferometer" : "Interferencia — interferómetro de 1 qubit"}</text>
      <text className="cd" x="26" y="58">qlab/problems/interference.py · live</text>
      <text className="it" x="26" y="78">{en ? "circuit  H · P(φ) · H  on |0⟩ — two paths recombine" : "circuito  H · P(φ) · H  sobre |0⟩ — dos caminos"}</text>
      <rect className="eqbox" x="26" y="88" width="396" height="22" rx="5" />
      <text className="eq" x="34" y="103">P(0) = ¼ |1 + e^(iφ)|² = (1 + cos φ)/2 = cos²(φ/2)</text>
      <text className="mu" x="26" y="128">{en ? "amplitudes (not probabilities) add — they can cancel: the whole game" : "las amplitudes (no las probabilidades) suman — pueden cancelarse"}</text>

      {/* Grover */}
      <rect className="bx" x="446" y="16" width="420" height="120" rx="9" />
      <text className="ttl" x="458" y="38">{en ? "Grover — amplitude amplification" : "Grover — amplificación de amplitud"}</text>
      <text className="cd" x="458" y="58">qlab/problems/grover.py · live</text>
      <text className="it" x="458" y="78">{en ? "G = D·O : oracle  |w⟩→−|w⟩  then diffuser (invert about mean)" : "G = D·O : oráculo |w⟩→−|w⟩ luego difusor (refleja en la media)"}</text>
      <rect className="eqbox" x="458" y="88" width="396" height="22" rx="5" />
      <text className="eq" x="466" y="103">k* = round((π/2 − θ)/(2θ)) &#8776; (π/4)√(N/M),  sin θ = √(M/N)</text>
      <text className="mu" x="458" y="128">{en ? "diffuser  H^n X^n (MCZ) X^n H^n  — quadratic speedup ~√N vs ~N/2" : "difusor H^n X^n (MCZ) X^n H^n — speedup cuadrático ~√N vs ~N/2"}</text>

      {/* QAOA */}
      <rect className="bx-compute" x="14" y="152" width="420" height="138" rx="9" />
      <text className="ttl" x="26" y="174">{en ? "QAOA — variational MaxCut (precompute)" : "QAOA — MaxCut variacional (precómputo)"}</text>
      <text className="cd" x="26" y="194">qlab/problems/maxcut.py · solvers: qaoa-qiskit/pennylane/cirq</text>
      <text className="it" x="26" y="214">{en ? "alternate cost layer C and mixer B, p layers deep:" : "alterna capa de costo C y mezclador B, profundidad p:"}</text>
      <rect className="eqbox" x="26" y="224" width="396" height="22" rx="5" />
      <text className="eq" x="34" y="239">|ψ(γ,β)⟩ = ∏ e^(−iβ B) e^(−iγ C) · H^⊗n |0⟩</text>
      <text className="it" x="26" y="262">C = Σ ½(1 − Z_u Z_v),  B = Σ X_i ;  classical loop tunes (γ,β)</text>
      <text className="mu" x="26" y="282">{en ? "QLab: p=1, exact 24×24 (γ,β) grid-search — deterministic" : "QLab: p=1, grid exacto 24×24 (γ,β) — determinista"}</text>

      {/* VQE */}
      <rect className="bx-compute" x="446" y="152" width="420" height="138" rx="9" />
      <text className="ttl" x="458" y="174">{en ? "VQE — H₂ ground state (precompute, learned)" : "VQE — estado base de H₂ (precómputo, aprendido)"}</text>
      <text className="cd" x="458" y="194">qlab/problems/vqe.py · solver: vqe-pennylane</text>
      <text className="it" x="458" y="214">{en ? "real H₂ Hamiltonian, STO-3G, Jordan-Wigner → 4 qubits" : "Hamiltoniano real de H₂, STO-3G, Jordan-Wigner → 4 qubits"}</text>
      <rect className="eqbox" x="458" y="224" width="396" height="22" rx="5" />
      <text className="eq" x="466" y="239">E_VQE = min_θ ⟨ψ(θ)| H |ψ(θ)⟩ ≥ E₀</text>
      <text className="it" x="458" y="262">{en ? "ansatz  DoubleExcitation(θ)·|HF⟩ ; scan θ∈[−π,π], 100 pts" : "ansatz DoubleExcitation(θ)·|HF⟩ ; barre θ∈[−π,π], 100 pts"}</text>
      <text className="mu" x="458" y="282">{en ? "checked vs exact diagonalization (FCI) — chemical accuracy" : "verificado vs diagonalización exacta (FCI) — precisión química"}</text>

      {/* the shared tracer pipeline */}
      <rect className="band" x="14" y="306" width="852" height="2" />
      <text className="bandl" x="14" y="324">{en ? "Every circuit solver funnels through ONE tracer" : "Todo solver de circuito pasa por UN trazador"}</text>

      {[
        { x: 14, t: en ? "Build circuit" : "Construir circuito", cd: "solvers/<fw>_solvers.py", s: en ? "per-framework adapter" : "adaptador por framework" },
        { x: 232, t: en ? "Step-by-step trace" : "Traza paso a paso", cd: "core/circuit_trace.py", s: en ? "statevector + Bloch each step" : "statevector + Bloch por paso" },
        { x: 450, t: en ? "Seeded sampling" : "Muestreo con semilla", cd: "core/rng.py", s: en ? "one NumPy generator, seed 42" : "un generador NumPy, semilla 42" },
        { x: 668, t: en ? "Classical baseline" : "Línea base clásica", cd: "solvers/classical_solvers.py", s: en ? '"still more practical" verdict' : 'veredicto "aún más práctico"' },
      ].map((s, i) => (
        <g key={i}>
          <rect className={i === 3 ? "bx-gate" : "bx"} x={s.x} y="336" width="198" height="86" rx="9" />
          <text className={i === 3 ? "ttl-warn" : "ttl"} x={s.x + 12} y="358">{s.t}</text>
          <text className="cd" x={s.x + 12} y="378">{s.cd}</text>
          <text className="it" x={s.x + 12} y="398">{s.s}</text>
          {i < 3 && <path className="flow" d={`M${s.x + 198} 379 L${s.x + 216} 379`} markerEnd={`url(#${m})`} />}
        </g>
      ))}
      <text className="mu" x="14" y="416" />

      {/* honesty footer */}
      <rect className="bx-store" x="14" y="442" width="852" height="100" rx="10" />
      <text className="ttl-hi" x="28" y="464">{en ? "The honest verdict — baked into every case" : "El veredicto honesto — horneado en cada caso"}</text>
      <text className="it" x="28" y="486">{en ? "At lab scale the classical answer is usually trivial and optimal. MaxCut/QAOA matches but does NOT win;" : "A escala de laboratorio la respuesta clásica suele ser trivial y óptima. MaxCut/QAOA empata pero NO gana;"}</text>
      <text className="it" x="28" y="504">{en ? "Grover's √N is asymptotic; VQE on H₂ is a 16×16 matrix a laptop diagonalizes in microseconds (pedagogy)." : "el √N de Grover es asintótico; VQE en H₂ es una matriz 16×16 que un laptop diagonaliza en microsegundos."}</text>
      <text className="mu" x="28" y="528">{en ? "Interference alone computes nothing special; harnessed across many qubits it is the whole game." : "La interferencia sola no computa nada especial; usada en muchos qubits es todo el juego."}</text>
    </svg>
  );
}

/* ============================================================================
   TAB 5 — The data contracts / design: qlab-trace + manifest, cases-by-category,
   the measured lane gate.
   ========================================================================= */
export function DataContractDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const m = "qa-data";
  return (
    <svg viewBox="0 0 880 560" width="880" className="arch-svg" role="img"
         aria-label={en ? "QLab data contracts and the measured gate" : "Contratos de datos de QLab y la compuerta medida"}>
      <style>{ARCH_CSS}</style>
      <Defs id={m} />

      {/* two contracts band */}
      <text className="bandl" x="14" y="28">{en ? "Two data contracts decouple the engine from the web" : "Dos contratos de datos desacoplan el motor de la web"}</text>

      {/* trace contract */}
      <rect className="bx-store" x="14" y="38" width="420" height="170" rx="10" />
      <text className="ttl-hi" x="28" y="60">{en ? "Artifact contract" : "Contrato de artefacto"}</text>
      <text className="cd" x="28" y="78">schema  qlab-trace/1  ·  core/trace.py</text>
      <text className="it" x="28" y="100">{en ? "a replayable recording of one circuit run" : "grabación reproducible de una corrida"}</text>
      <text className="it" x="28" y="120">{en ? "per step: statevector (2ⁿ complex amplitudes)" : "por paso: statevector (2ⁿ amplitudes complejas)"}</text>
      <text className="it" x="28" y="138">{en ? "per qubit: Bloch [⟨X⟩,⟨Y⟩,⟨Z⟩] + probabilities" : "por qubit: Bloch [⟨X⟩,⟨Y⟩,⟨Z⟩] + probabilidades"}</text>
      <text className="it" x="28" y="156">{en ? "final: measurement histogram (counts)" : "final: histograma de medición (conteos)"}</text>
      <text className="cd" x="28" y="176">JSON · 6-dp rounded · no Qiskit type</text>
      <text className="mu" x="28" y="196">{en ? "run = pure function of (params, seed) → replay = truth" : "corrida = función pura de (params, semilla) → replay = verdad"}</text>

      {/* manifest contract */}
      <rect className="bx-store" x="446" y="38" width="420" height="170" rx="10" />
      <text className="ttl-hi" x="460" y="60">{en ? "Index contract" : "Contrato de índice"}</text>
      <text className="cd" x="460" y="78">schema  qlab-manifest/1  ·  core/manifest.py</text>
      <text className="it" x="460" y="100">{en ? "one per (case, variant) — the web's catalog" : "uno por (caso, variante) — el catálogo de la web"}</text>
      <text className="it" x="460" y="120">{en ? "the lane verdict + the measured numbers behind it" : "el veredicto de carril + los números medidos"}</text>
      <text className="it" x="460" y="138">{en ? "seed / shots / params that reproduce the trace" : "seed / shots / params que reproducen la traza"}</text>
      <text className="it" x="460" y="156">{en ? "viz bindings: bloch · amp_phase · histogram · …" : "bindings de viz: bloch · amp_phase · histogram · …"}</text>
      <text className="cd" x="460" y="176">qsphere · density · circuit · landscape · graph</text>
      <text className="mu" x="460" y="196">{en ? "+ engine provenance + version" : "+ procedencia del motor + versión"}</text>

      {/* mirror */}
      <path className="flow-hi" d="M224 208 L224 240" markerEnd={`url(#${m}-hi)`} />
      <text className="lbl-em" x="232" y="228">{en ? "TS mirror gates the build" : "espejo TS controla el build"}</text>
      <rect className="bx-gate" x="14" y="244" width="420" height="56" rx="9" />
      <text className="ttl-warn" x="28" y="266">{en ? "TypeScript mirror (ADR-0057)" : "Espejo TypeScript (ADR-0057)"}</text>
      <text className="cd" x="28" y="286">web/src/lib/contract.types.ts</text>
      <text className="mu" x="240" y="276">{en ? "Python schema ≠ TS type → build fails" : "esquema Python ≠ tipo TS → el build falla"}</text>

      {/* cases by category */}
      <path className="flow" d="M656 208 L656 240" markerEnd={`url(#${m})`} />
      <text className="lbl" x="664" y="228">{en ? "read as catalog" : "leído como catálogo"}</text>
      <rect className="bx" x="446" y="244" width="420" height="56" rx="9" />
      <text className="ttl" x="460" y="266">{en ? "Cases by category" : "Casos por categoría"}</text>
      <text className="cd" x="460" y="286">fundamentals · flagship-algorithms · variational · qec</text>
      <text className="mu" x="700" y="276">20 {en ? "cases" : "casos"}</text>

      {/* the measured gate */}
      <rect className="band" x="14" y="318" width="852" height="2" />
      <text className="bandl" x="14" y="336">{en ? "The measured lane gate — by measurement, not taste" : "La compuerta de carril medida — por medición, no por gusto"}</text>

      <rect className="bx-gate" x="280" y="346" width="320" height="96" rx="10" />
      <text className="ttl-warn" x="294" y="368">classify_lane — {en ? "all four hold?" : "¿se cumplen las cuatro?"}</text>
      <text className="cd" x="294" y="386">qlab/core/gate.py</text>
      <text className="it" x="294" y="406">qubits &#8804; 12 · {en ? "unitary-only" : "solo-unitario"}</text>
      <text className="it" x="294" y="424">run_ms &#8804; 1500 · trace &#8804; 1 MB</text>

      <path className="flow" d="M340 442 L210 478" markerEnd={`url(#${m})`} />
      <text className="lbl-em" x="232" y="462">{en ? "all hold" : "todas"}</text>
      <path className="flow" d="M540 442 L670 478" markerEnd={`url(#${m})`} />
      <text className="lbl" x="600" y="462">{en ? "any fails" : "falla una"}</text>

      <rect className="bx-web" x="60" y="482" width="300" height="30" rx="8" />
      <text className="ttl-web" x="74" y="502">LIVE — {en ? "in-browser re-sim" : "re-sim en navegador"}</text>
      <rect className="bx-compute" x="520" y="482" width="300" height="30" rx="8" />
      <text className="ttl" x="534" y="502">PRECOMPUTE — {en ? "committed trace, replayed" : "traza commiteada, replay"}</text>

      <text className="mu" x="14" y="540">{en ? "The verdict + its numbers are written into the manifest; CI fails the build if a live-tagged case breaches a gate — mislabeling cannot ship." : "El veredicto + sus números van al manifiesto; CI rompe el build si un caso etiquetado vivo viola una compuerta — el mal etiquetado no se publica."}</text>
    </svg>
  );
}
