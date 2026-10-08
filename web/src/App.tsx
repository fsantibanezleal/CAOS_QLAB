import { AppShell, STANDARD_ROUTES, type ShellConfig } from "@fasl-work/caos-app-shell";
import { Atom } from "lucide-react";
import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from "react-router";
import { ARCHITECTURE } from "./components/architecture";
import { Workbench } from "./components/Workbench";
import { CITATIONS } from "./data/citations";
import { groupByCategory, useCatalog } from "./lib/catalog";
import { CitationsProvider } from "./lib/citations";
import { CATEGORY_LABELS } from "./lib/contract.types";
import { useT, useUI } from "./lib/ui";
import { VERSION } from "./lib/version";
import { Benchmark } from "./pages/Benchmark";
import { Experiments } from "./pages/Experiments";
import { Implementation } from "./pages/Implementation";
import { Introduction } from "./pages/Introduction";
import { Methodology } from "./pages/Methodology";

const EXTERNAL = {
  github: "https://github.com/fsantibanezleal/CAOS_QLAB",
  personal: "https://fsantibanezleal.github.io",
  portfolio: "https://fasl-work.com",
};

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
              <Link key={c.id} to={`/?case=${c.id}`} className="case-card">
                <div className="card-top">
                  <strong>{t(c.title)}</strong>
                  <span className="qlab-badge">{c.variants[0]?.lane}</span>
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

/** /case/<id> (linked from the Benchmark and the grid, answered 200 by Pages) opens that case in the workbench. */
function CaseRedirect() {
  const { id } = useParams();
  return <Navigate to={`/?case=${encodeURIComponent(id ?? "")}`} replace />;
}

function NotFound() {
  const { lang } = useUI();
  const en = lang === "en";
  return (
    <div className="page-body">
      <p>{en ? "Page not found." : "Página no encontrada."} <Link to="/">{en ? "Back to the workbench" : "Volver al banco de trabajo"}</Link></p>
    </div>
  );
}

const SHELL: ShellConfig = {
  product: { name: "QLab", mark: <Atom size={18} strokeWidth={2.2} /> },
  routes: STANDARD_ROUTES,
  links: EXTERNAL,
  version: VERSION,
  license: { en: "MIT licence", es: "Licencia MIT" },
  visibility: "public",
  architecture: ARCHITECTURE,
  contain: true,
  footer: {
    provenance: {
      en: "Every result is a committed trace from Qiskit, PennyLane, Cirq or Stim through the qversus engine",
      es: "Cada resultado es una traza versionada de Qiskit, PennyLane, Cirq o Stim mediante el motor qversus",
    },
    disclaimer: {
      en: "Simulators only: no run in this lab used real quantum hardware",
      es: "Solo simuladores: ninguna corrida de este laboratorio usó hardware cuántico real",
    },
  },
};

export default function App() {
  return (
    <BrowserRouter>
      <AppShell config={SHELL}>
        <CitationsProvider items={CITATIONS}>
          <Routes>
            <Route path="/" element={<Workbench />} />
            <Route path="/cases" element={<AllCases />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/implementation" element={<Implementation />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/benchmark" element={<Benchmark />} />
            <Route path="/case/:id" element={<CaseRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CitationsProvider>
      </AppShell>
    </BrowserRouter>
  );
}
