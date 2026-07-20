import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes, useParams } from "react-router-dom";
import { Atom, Briefcase, ChevronDown, ChevronRight, GitBranch, Globe, Info, Languages, LayoutGrid, Moon, Sun } from "lucide-react";
import { ArchModal } from "./components/ArchModal";
import { CitationsProvider } from "./lib/citations";
import { CITATIONS } from "./data/citations";
import { CaseWorkbench } from "./components/CaseWorkbench";
import { Tex } from "./components/Tabs";
import type { Bundle, Catalog, CatalogCase } from "./lib/contract.types";
import { CATEGORY_LABELS } from "./lib/contract.types";
import { ADVANTAGE_EDGE, ADVANTAGE_LABEL, casePhysics } from "./data/casePhysics";
import { loadCatalog } from "./lib/data";
import { Benchmark } from "./pages/Benchmark";
import { Experiments } from "./pages/Experiments";
import { Implementation } from "./pages/Implementation";
import { Introduction } from "./pages/Introduction";
import { Methodology } from "./pages/Methodology";
import { UIProvider, useT, useUI } from "./lib/ui";

const EXTERNAL = {
  github: "https://github.com/fsantibanezleal/CAOS_QLAB",
  personal: "https://fsantibanezleal.github.io",
  portfolio: "https://fasl-work.com",
};

/** The default case the App lands in (a representative, fully-live entanglement case). */
const DEFAULT_CASE = "state-prep";

/** Category display order (beginner → advanced) for the selector + grid. */
const CATEGORY_ORDER = [
  "fundamentals",
  "entanglement",
  "oracle-algorithms",
  "flagship-algorithms",
  "variational",
  "noise-and-qec",
  "compilation",
];

// The standard product pages (ADR-0016/0017). Tabs appear only once their page is built.
const PAGE_TABS: { to: string; en: string; es: string }[] = [
  { to: "/", en: "App", es: "App" },
  { to: "/introduction", en: "Introduction", es: "Introducción" },
  { to: "/methodology", en: "Methodology", es: "Metodología" },
  { to: "/implementation", en: "Implementation", es: "Implementación" },
  { to: "/experiments", en: "Experiments", es: "Experimentos" },
  { to: "/benchmark", en: "Benchmark", es: "Benchmark" },
];

function Header({ onInfo }: { onInfo: () => void }) {
  const { lang, setLang, theme, setTheme } = useUI();
  const en = lang === "en";
  return (
    <header className="qheader">
      <div className="qheader-inner">
        <Link to="/" className="brand">
          <span className="brand-mark"><Atom size={18} strokeWidth={2.2} /></span> QLab
        </Link>
        <nav className="nav">
          {PAGE_TABS.map((p) => (
            <NavLink key={p.to} to={p.to} end={p.to === "/"}
                     className={({ isActive }) => (isActive ? "active" : "")}>
              {en ? p.en : p.es}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <a className="icon-btn" href={EXTERNAL.github} target="_blank" rel="noreferrer noopener"
             title="GitHub" aria-label="GitHub"><GitBranch size={18} aria-hidden="true" /></a>
          <a className="icon-btn" href={EXTERNAL.personal} target="_blank" rel="noreferrer noopener"
             title={en ? "Personal site" : "Sitio personal"}
             aria-label={en ? "Personal site" : "Sitio personal"}><Globe size={18} aria-hidden="true" /></a>
          <a className="icon-btn" href={EXTERNAL.portfolio} target="_blank" rel="noreferrer noopener"
             title="Portfolio" aria-label="Portfolio"><Briefcase size={18} aria-hidden="true" /></a>
          <span className="header-sep" aria-hidden="true" />
          <button type="button" className="icon-btn" onClick={onInfo} aria-haspopup="dialog"
                  title={en ? "How QLab works" : "Cómo funciona QLab"}
                  aria-label={en ? "How QLab works" : "Cómo funciona QLab"}>
            <Info size={18} aria-hidden="true" />
          </button>
          <button type="button" className="icon-btn" onClick={() => setLang(en ? "es" : "en")}
                  title={en ? "Switch language" : "Cambiar idioma"} aria-label="Toggle language">
            <Languages size={18} aria-hidden="true" /> <span className="lang-code">{lang}</span>
          </button>
          <button type="button" className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  title={en ? "Toggle theme" : "Cambiar tema"} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="qfooter">
      Developed by Felipe Santibáñez-Leal · A CAOS research project ·{" "}
      <a href={EXTERNAL.github} target="_blank" rel="noreferrer">Source</a> · MIT
    </footer>
  );
}

function useCatalog() {
  const [cat, setCat] = useState<Catalog | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    loadCatalog().then(setCat).catch((e) => setErr(String(e)));
  }, []);
  return { cat, err };
}

/** Cases grouped + ordered by category (beginner → advanced). */
function groupByCategory(cases: CatalogCase[]): [string, CatalogCase[]][] {
  const byCat = new Map<string, CatalogCase[]>();
  for (const c of cases) {
    if (!byCat.has(c.category)) byCat.set(c.category, []);
    byCat.get(c.category)!.push(c);
  }
  const ordered: [string, CatalogCase[]][] = [];
  for (const k of CATEGORY_ORDER) if (byCat.has(k)) ordered.push([k, byCat.get(k)!]);
  for (const [k, v] of byCat) if (!CATEGORY_ORDER.includes(k)) ordered.push([k, v]); // any new category, appended
  return ordered;
}

/* ============================================================================
   The App landing (/) — the tool, not a catalogue. ADR-0017 §3:
   page-body qlab-layout = a control aside (case selector grouped by category +
   variant chips + a live quantum-vs-classical read-out) + a 1fr main = the
   CaseWorkbench for the selected case. Every control drives a recompute/reload.
   ========================================================================= */
function Workbench() {
  const { cat, err } = useCatalog();
  const t = useT();
  const { lang } = useUI();
  const en = lang === "en";

  const [caseId, setCaseId] = useState(DEFAULT_CASE);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [bundle, setBundle] = useState<Bundle | null>(null);
  // which category groups are expanded in the selector (default: the active case's)
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => (cat ? groupByCategory(cat.cases) : []), [cat]);
  const active = cat?.cases.find((c) => c.id === caseId) ?? cat?.cases[0] ?? null;

  // when the active case changes, reset the variant to that case's first
  useEffect(() => {
    if (active) setVariantId(active.variants[0].id);
  }, [active?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // expand the group that contains the active case on first load / case change
  useEffect(() => {
    if (active) setOpen((o) => ({ ...o, [active.category]: true }));
  }, [active?.category]); // eslint-disable-line react-hooks/exhaustive-deps

  if (err) return <div className="page-body"><p className="err">Failed to load catalog: {err}</p></div>;
  if (!cat || !active) return <div className="page-body"><p className="note">{en ? "Loading lab…" : "Cargando laboratorio…"}</p></div>;

  const variant = active.variants.find((v) => v.id === variantId) ?? active.variants[0];
  const phys = casePhysics(active.id);
  const advLabel = phys ? ADVANTAGE_LABEL[phys.advantage] : null;
  const advEdge = phys ? ADVANTAGE_EDGE[phys.advantage] : "classical";
  const frameworks = [...new Set(active.variants.flatMap((v) => v.solvers.map((s) => s.framework)))];
  // the live numeric verdict comes from the loaded bundle (real committed result); fall back
  // to the catalog's per-variant verdict before the bundle finishes loading.
  const liveVerdict = bundle?.comparison?.verdict ?? variant.verdict ?? null;
  const qubits = bundle?.qubits;
  const shots = bundle?.shots;

  return (
    <div className="page-body qlab-layout">
      {/* ---- control aside ---- */}
      <aside className="qlab-side">
        <div className="qlab-side-head">
          <h1>{en ? "Quantum workbench" : "Banco de trabajo cuántico"}</h1>
          <p className="qlab-side-lede">
            {en
              ? "Pick a case and a variant; each runs the real framework and replays the committed trace next to the classical baseline."
              : "Elegir un caso y una variante; cada uno ejecuta el framework real y reproduce la traza versionada junto al baseline clásico."}
          </p>
        </div>

        {/* case selector, grouped by category */}
        <div className="qlab-ctl">
          <div className="qlab-ctl-label" title={en ? "Each case is a quantum problem solved end-to-end with its classical baseline." : "Cada caso es un problema cuántico resuelto de extremo a extremo con su baseline clásico."}>
            {en ? "Case" : "Caso"}
            <span className="qlab-ctl-hint">{en ? "the problem" : "el problema"}</span>
          </div>
          <div className="qlab-case-tree" role="tree">
            {grouped.map(([category, cases]) => {
              const isOpen = open[category] ?? false;
              return (
                <div key={category} className="qlab-cat">
                  <button
                    className="qlab-cat-head"
                    aria-expanded={isOpen}
                    onClick={() => setOpen((o) => ({ ...o, [category]: !o[category] }))}
                  >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span>{t(CATEGORY_LABELS[category]) || category}</span>
                    <span className="qlab-cat-count">{cases.length}</span>
                  </button>
                  {isOpen && (
                    <div className="qlab-cat-cases">
                      {cases.map((c) => {
                        const cphys = casePhysics(c.id);
                        const edge = cphys ? ADVANTAGE_EDGE[cphys.advantage] : "classical";
                        return (
                          <button
                            key={c.id}
                            className={`qlab-case-btn ${c.id === active.id ? "on" : ""}`}
                            onClick={() => setCaseId(c.id)}
                            title={t(c.concept)}
                          >
                            <span className={`qlab-adv-dot dot-${edge}`} aria-hidden />
                            {t(c.title)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Link to="/cases" className="qlab-allcases">
            <LayoutGrid size={13} /> {en ? "Browse all cases as a grid" : "Ver todos los casos en cuadrícula"}
          </Link>
        </div>

        {/* variant chips for the active case */}
        <div className="qlab-ctl">
          <div className="qlab-ctl-label" title={en ? "A variant fixes a concrete instance (a specific state, graph, hidden string, noise level…)." : "Una variante fija una instancia concreta (un estado, grafo, cadena oculta, nivel de ruido…) específico."}>
            {en ? "Variant" : "Variante"}
            <span className="qlab-ctl-hint">{en ? "the instance" : "la instancia"}</span>
          </div>
          <div className="qlab-variants">
            {active.variants.map((v) => (
              <button
                key={v.id}
                className={`variant-chip ${v.id === variant.id ? "on" : ""}`}
                onClick={() => setVariantId(v.id)}
                title={t(v.note)}
              >
                {t(v.title)}
              </button>
            ))}
          </div>
        </div>

        {/* the live quantum-vs-classical read-out (updates with every selection) */}
        <div className={`qlab-readout edge-${advEdge}`}>
          <div className="qlab-readout-head">
            <span className="qlab-readout-title">{en ? "Quantum vs classical" : "Cuántico vs clásico"}</span>
            <span className={`lane-pill ${variant.lane}`}>{variant.lane}</span>
          </div>
          {advLabel && <div className={`qlab-verdict-chip chip-${advEdge}`}>{t(advLabel)}</div>}
          {phys && (
            <div className="qlab-relation" title={en ? "The defining relation for this case." : "La relación que define este caso."}>
              <Tex tex={phys.relation} />
            </div>
          )}
          {phys && <p className="qlab-teaches">{t(phys.teaches)}</p>}
          {liveVerdict && <p className="qlab-verdict">{t(liveVerdict)}</p>}
          {phys && (
            <p className="qlab-honest">
              <strong>{en ? "Honest scope: " : "Alcance honesto: "}</strong>
              {t(phys.honest)}
            </p>
          )}
          <div className="qlab-facts">
            <span title={en ? "Qubits in the active circuit." : "Qubits en el circuito activo."}>
              <b>{qubits ?? "—"}</b> {en ? "qubits" : "qubits"}
            </span>
            <span title={en ? "Measurement shots sampled." : "Disparos de medición muestreados."}>
              <b>{shots ?? "—"}</b> {en ? "shots" : "disparos"}
            </span>
            <span title={en ? "Solver methods compared." : "Métodos solver comparados."}>
              <b>{variant.solvers.length}</b> {en ? "solvers" : "solvers"}
            </span>
          </div>
          <div className="qlab-fw" title={en ? "Real frameworks that produced these results." : "Frameworks reales que produjeron estos resultados."}>
            {frameworks.map((f) => <span key={f} className="fw-chip">{f}</span>)}
          </div>
        </div>
      </aside>

      {/* ---- main: the workbench for the active case ---- */}
      <main className="qlab-main">
        <div className="qlab-main-head">
          <h2>{t(active.title)}</h2>
          <p className="qlab-main-concept">{t(active.concept)}</p>
        </div>
        <CaseWorkbench
          key={active.id}
          caseEntry={active}
          variantId={variant.id}
          onVariantChange={setVariantId}
          onBundle={setBundle}
          hideVariantBar
        />
        <p className="qlab-main-note">
          {en
            ? "Circuit, Bloch sphere, amplitudes, histogram, any landscape/extrapolation, and the quantum-vs-classical table are the real committed results. On live-lane cases switch to the Live (browser) tab and drag a slider to re-simulate in real time."
            : "El circuito, la esfera de Bloch, las amplitudes, el histograma, cualquier paisaje/extrapolación y la tabla cuántico-vs-clásico son los resultados versionados reales. En casos del carril vivo, cambiar a la pestaña En vivo (navegador) y mover un slider para re-simular en tiempo real."}
        </p>
      </main>
    </div>
  );
}

/* ---- the old card-grid, demoted from the landing to a secondary "all cases" view ---- */
function AllCases() {
  const { cat, err } = useCatalog();
  const t = useT();
  const { lang } = useUI();
  const en = lang === "en";
  if (err) return <div className="page-body"><p className="err">Failed to load catalog: {err}</p></div>;
  if (!cat) return <div className="page-body"><p className="note">{en ? "Loading…" : "Cargando…"}</p></div>;
  const grouped = groupByCategory(cat.cases);

  return (
    <div className="page-body">
      <div className="page-head">
        <Link to="/" className="back">← {en ? "Back to the workbench" : "Volver al banco de trabajo"}</Link>
        <h1>{en ? "All cases" : "Todos los casos"}</h1>
        <p className="lede">
          {en
            ? `Every case in the lab, grouped by family. Open one in the workbench, or jump to its standalone page. ${cat.count} cases.`
            : `Todos los casos del laboratorio, agrupados por familia. Abrir uno en el banco de trabajo o saltar a su página individual. ${cat.count} casos.`}
        </p>
      </div>
      {grouped.map(([category, cases]) => (
        <section key={category} className="cat-section">
          <h2>{t(CATEGORY_LABELS[category]) || category}</h2>
          <div className="card-grid">
            {cases.map((c) => (
              <Link key={c.id} to={`/case/${c.id}`} className="case-card">
                <div className="card-top">
                  <strong>{t(c.title)}</strong>
                  <span className="badge">{c.variants[0]?.lane}</span>
                </div>
                <p className="concept">{t(c.concept).slice(0, 180)}…</p>
                <div className="card-foot">
                  <span>{c.variants.length} {en ? "variants" : "variantes"}</span>
                  <span className="solvers">
                    {[...new Set(c.variants.flatMap((v) => v.solvers.map((s) => s.framework)))].join(" · ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Standalone deep-link page for one case (linked from Benchmark + the all-cases grid). */
function CasePage() {
  const { id } = useParams();
  const { cat, err } = useCatalog();
  const t = useT();
  const { lang } = useUI();
  const en = lang === "en";
  if (err) return <div className="page-body"><p className="err">{err}</p></div>;
  if (!cat) return <div className="page-body"><p className="note">{en ? "Loading…" : "Cargando…"}</p></div>;
  const c = cat.cases.find((x) => x.id === id);
  if (!c) return <div className="page-body"><p>{en ? "Case not found." : "Caso no encontrado."} <Link to="/">{en ? "Back" : "Volver"}</Link></p></div>;

  return (
    <div className="page-body">
      <div className="page-head">
        <Link to="/" className="back">← {en ? "Open the workbench" : "Abrir el banco de trabajo"}</Link>
        <h1>{t(c.title)}</h1>
        <p className="lede">{t(c.concept)}</p>
      </div>
      <CaseWorkbench caseEntry={c} />
      <p className="todo-note">
        {en
          ? "Everything above — circuit, Bloch sphere, amplitudes, histogram, the QAOA landscape and the quantum-vs-classical comparison — is the real committed result. On live-lane cases, switch to the Live (browser) tab and drag a slider to re-simulate in real time."
          : "Todo lo de arriba — circuito, esfera de Bloch, amplitudes, histograma, el paisaje de QAOA y la comparación cuántico-vs-clásico — es el resultado versionado real. En los casos del carril vivo, cambiar a la pestaña En vivo (navegador) y mover un slider para re-simular en tiempo real."}
      </p>
    </div>
  );
}

export default function App() {
  const [info, setInfo] = useState(false);
  return (
    <UIProvider>
      <CitationsProvider items={CITATIONS}>
      <BrowserRouter>
        <Header onInfo={() => setInfo(true)} />
        {info && <ArchModal onClose={() => setInfo(false)} />}
        <main className="shell">
          <Routes>
            <Route path="/" element={<Workbench />} />
            <Route path="/cases" element={<AllCases />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/implementation" element={<Implementation />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/benchmark" element={<Benchmark />} />
            <Route path="/case/:id" element={<CasePage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
      </CitationsProvider>
    </UIProvider>
  );
}
