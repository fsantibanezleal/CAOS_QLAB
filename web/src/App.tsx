import { useEffect, useState } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes, useParams } from "react-router-dom";
import { CaseWorkbench } from "./components/CaseWorkbench";
import type { Catalog } from "./lib/contract.types";
import { CATEGORY_LABELS } from "./lib/contract.types";
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

// The standard product pages (ADR-0016/0017). Tabs appear only once their page is built.
const PAGE_TABS: { to: string; en: string; es: string }[] = [
  { to: "/", en: "App", es: "App" },
  { to: "/introduction", en: "Introduction", es: "Introducción" },
  { to: "/methodology", en: "Methodology", es: "Metodología" },
  { to: "/implementation", en: "Implementation", es: "Implementación" },
  { to: "/experiments", en: "Experiments", es: "Experimentos" },
  { to: "/benchmark", en: "Benchmark", es: "Benchmark" },
];

function Header() {
  const { lang, setLang, theme, setTheme } = useUI();
  return (
    <header className="qheader">
      <Link to="/" className="brand">
        <span className="brand-mark">⟨ψ|</span> QLab
      </Link>
      <nav className="nav">
        {PAGE_TABS.map((p) => (
          <NavLink key={p.to} to={p.to} end={p.to === "/"}
                   className={({ isActive }) => (isActive ? "active" : "")}>
            {lang === "en" ? p.en : p.es}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <a href={EXTERNAL.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={EXTERNAL.personal} target="_blank" rel="noreferrer">Site</a>
        <a href={EXTERNAL.portfolio} target="_blank" rel="noreferrer">Portfolio</a>
        <span className="sep" />
        <button onClick={() => setLang(lang === "en" ? "es" : "en")}>{lang.toUpperCase()}</button>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="qfooter">
      Built by Felipe Santibáñez-Leal · A CAOS research project ·{" "}
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

function Catalogue() {
  const { cat, err } = useCatalog();
  const t = useT();
  const { lang } = useUI();
  if (err) return <div className="page"><p className="err">Failed to load catalog: {err}</p></div>;
  if (!cat) return <div className="page"><p>Loading…</p></div>;

  const byCat = new Map<string, typeof cat.cases>();
  for (const c of cat.cases) {
    if (!byCat.has(c.category)) byCat.set(c.category, []);
    byCat.get(c.category)!.push(c);
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>{lang === "en" ? "Quantum Laboratory" : "Laboratorio Cuántico"}</h1>
        <p className="lede">
          {lang === "en"
            ? `A didactic lab that runs the real frameworks and shows every quantum method next to the classical baseline. ${cat.count} cases.`
            : `Un laboratorio didáctico que corre los frameworks reales y muestra cada método cuántico junto al baseline clásico. ${cat.count} casos.`}
        </p>
      </div>
      {[...byCat.entries()].map(([category, cases]) => (
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
                  <span>{c.variants.length} {lang === "en" ? "variants" : "variantes"}</span>
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

function CasePage() {
  const { id } = useParams();
  const { cat, err } = useCatalog();
  const t = useT();
  const { lang } = useUI();
  if (err) return <div className="page"><p className="err">{err}</p></div>;
  if (!cat) return <div className="page"><p>Loading…</p></div>;
  const c = cat.cases.find((x) => x.id === id);
  if (!c) return <div className="page"><p>Case not found. <Link to="/">Back</Link></p></div>;

  return (
    <div className="page">
      <div className="page-head">
        <Link to="/" className="back">← {lang === "en" ? "All cases" : "Todos los casos"}</Link>
        <h1>{t(c.title)}</h1>
        <p className="lede">{t(c.concept)}</p>
      </div>
      <CaseWorkbench caseEntry={c} />
      <p className="todo-note">
        {lang === "en"
          ? "Coming next: a live in-browser tuning lane and the per-method documentation pages. Everything above — circuit, Bloch sphere, amplitudes, histogram, the QAOA landscape and the quantum-vs-classical comparison — is the real committed result."
          : "Próximamente: un lane de ajuste en vivo en el navegador y las páginas de documentación por método. Todo lo de arriba — circuito, esfera de Bloch, amplitudes, histograma, el paisaje de QAOA y la comparación cuántico-vs-clásico — es el resultado commiteado real."}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <UIProvider>
      <BrowserRouter>
        <Header />
        <main className="shell">
          <Routes>
            <Route path="/" element={<Catalogue />} />
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
    </UIProvider>
  );
}
