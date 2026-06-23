import { useEffect, useMemo, useState } from "react";
import { Eq, type TabDef, Tabs } from "../components/Tabs";
import type { Catalog, CatalogCase } from "../lib/contract.types";
import { CATEGORY_LABELS } from "../lib/contract.types";
import { loadCatalog } from "../lib/data";
import { useUI } from "../lib/ui";

interface CaseRow {
  id: string;
  title: string;
  category: string;
  lane: string;
  variants: number;
  frameworks: string[];
  hasClassical: boolean;
  hasQuantum: boolean;
}

function rowsFrom(cat: Catalog, lang: "en" | "es"): CaseRow[] {
  return cat.cases.map((c: CatalogCase) => {
    const solvers = c.variants.flatMap((v) => v.solvers);
    const frameworks = [...new Set(solvers.map((s) => s.framework))];
    return {
      id: c.id,
      title: c.title[lang],
      category: c.category,
      lane: c.variants[0]?.lane ?? "—",
      variants: c.variants.length,
      frameworks,
      hasClassical: solvers.some((s) => s.paradigm === "classical"),
      hasQuantum: solvers.some((s) => s.paradigm !== "classical"),
    };
  });
}

export function Experiments() {
  const { lang } = useUI();
  const en = lang === "en";
  const [cat, setCat] = useState<Catalog | null>(null);
  useEffect(() => { loadCatalog().then(setCat).catch(() => {}); }, []);

  const rows = useMemo(() => (cat ? rowsFrom(cat, lang) : []), [cat, lang]);
  // Collapse adapter strings to framework families (qiskit-aer → qiskit; classical:numpy/sklearn → classical)
  // so the headline count matches the Introduction's "five frameworks"; per-case chips stay granular.
  const family = (f: string) => f.split(":")[0].replace(/^qiskit-aer$/, "qiskit");
  const stats = useMemo(() => {
    const fam = new Set<string>();
    let variants = 0, live = 0, withClassical = 0;
    for (const r of rows) {
      r.frameworks.forEach((f) => fam.add(family(f)));
      variants += r.variants;
      if (r.lane === "live") live++;
      if (r.hasClassical) withClassical++;
    }
    return { cases: rows.length, variants, frameworks: fam.size, live, precompute: rows.length - live, withClassical };
  }, [rows]);

  const byCat = useMemo(() => {
    const m = new Map<string, CaseRow[]>();
    for (const r of rows) {
      if (!m.has(r.category)) m.set(r.category, []);
      m.get(r.category)!.push(r);
    }
    return m;
  }, [rows]);

  const coverage = (
    <div className="method-body">
      <p>{en
        ? "Generated live from the committed catalog (the manifest set) — not hand-maintained. Every case ships at least one classical baseline next to its quantum solver(s)."
        : "Generado en vivo desde el catálogo commiteado (el conjunto de manifiestos) — no mantenido a mano. Cada caso incluye al menos un baseline clásico junto a su(s) solver(s) cuántico(s)."}</p>
      {cat ? (
        <>
          <div className="stat-row">
            <div className="stat"><b>{stats.cases}</b><span>{en ? "cases" : "casos"}</span></div>
            <div className="stat"><b>{stats.variants}</b><span>{en ? "variant traces" : "trazas de variante"}</span></div>
            <div className="stat"><b>{stats.frameworks}</b><span>frameworks</span></div>
            <div className="stat"><b>{stats.live}/{stats.precompute}</b><span>live / precompute</span></div>
            <div className="stat"><b>{stats.withClassical}/{stats.cases}</b><span>{en ? "vs classical" : "vs clásico"}</span></div>
          </div>
          <table className="impl-table cover-table">
            <thead><tr>
              <th>{en ? "Case" : "Caso"}</th><th>Frameworks</th>
              <th>{en ? "Var." : "Var."}</th><th>{en ? "Lane" : "Carril"}</th><th>{en ? "Baseline" : "Baseline"}</th>
            </tr></thead>
            <tbody>
              {[...byCat.entries()].map(([category, crs]) => (
                <CategoryBlock key={category} category={category} crs={crs} lang={lang} />
              ))}
            </tbody>
          </table>
        </>
      ) : <p className="note">Loading…</p>}
    </div>
  );

  const tabs: TabDef[] = [
    {
      id: "protocol",
      label: en ? "Protocol" : "Protocolo",
      content: (
        <div className="method-body">
          <p>{en
            ? "Every experiment is reproducible by construction: a run is a pure function of (params, seed). State-vector evolution is exact; the only stochastic step is measurement sampling, routed through one seeded NumPy generator, so the committed counts reproduce bit-for-bit. Shot count is fixed per case (typically 2048)."
            : "Cada experimento es reproducible por construcción: una corrida es función pura de (params, seed). La evolución del statevector es exacta; el único paso estocástico es el muestreo de medición, por un único generador NumPy con semilla, así que los conteos commiteados reproducen bit a bit. El número de shots es fijo por caso (típicamente 2048)."}</p>
          <h3>{en ? "The variational sweep (QAOA / VQE)" : "El barrido variacional (QAOA / VQE)"}</h3>
          <p>{en
            ? "For QAOA p=1 the protocol is an offline grid search over the two angles: evaluate the cost expectation on a 24×24 (γ,β) grid, take the maximizer, then commit the trace at the optimal angles. The full landscape is committed too — it is the heat-map shown on the App, real data, not a sketch."
            : "Para QAOA p=1 el protocolo es una búsqueda en grilla offline sobre los dos ángulos: se evalúa la esperanza de costo en una grilla 24×24 (γ,β), se toma el maximizador y se commitea la traza en los ángulos óptimos. El paisaje completo también se commitea — es el mapa de calor de la App, dato real, no un bosquejo."}</p>
          <Eq tex={String.raw`(\gamma^{*},\beta^{*})=\arg\max_{\gamma,\beta\,\in\,\text{grid}_{24\times24}}\ \langle\gamma,\beta\rvert H_C\lvert\gamma,\beta\rangle`} />
          <p className="honest-note"><strong>{en ? "Leakage-safe — " : "Sin fuga — "}</strong>{en
            ? "the QML case fits the SVM on a train split and reports accuracy on a held-out test split; the quantum and classical kernels see the same split. No metric is computed on data the model trained on."
            : "el caso QML ajusta el SVM en un split de entrenamiento y reporta exactitud en un split de prueba reservado; los kernels cuántico y clásico ven el mismo split. Ninguna métrica se computa sobre datos con los que el modelo entrenó."}</p>
        </div>
      ),
    },
    {
      id: "crosscheck",
      label: en ? "Cross-framework check" : "Validación cruzada",
      content: (
        <div className="method-body">
          <p>{en
            ? "A quantum result is only trustworthy if two independent engines agree on it (the SimLab “two engines on one problem” discipline). QLab runs MaxCut QAOA on three independent frameworks — Qiskit, PennyLane and Cirq — and they must return the same optimal cut on every lab graph. Disagreement would be a bug, not a discovery."
            : "Un resultado cuántico solo es confiable si dos motores independientes coinciden (la disciplina SimLab de “dos motores sobre un problema”). QLab corre MaxCut QAOA en tres frameworks independientes — Qiskit, PennyLane y Cirq — y deben devolver el mismo corte óptimo en cada grafo del lab. Una discrepancia sería un bug, no un hallazgo."}</p>
          <ul className="fw-list">
            <li><strong>QAOA × 3</strong> — {en ? "Qiskit, PennyLane and Cirq agree on the cut for all 6 graphs." : "Qiskit, PennyLane y Cirq coinciden en el corte para los 6 grafos."}</li>
            <li><strong>QFT</strong> — {en ? "the circuit output is validated against the analytic DFT (fidelity 1.000)." : "la salida del circuito se valida contra la DFT analítica (fidelidad 1.000)."}</li>
            <li><strong>Teleportation / superdense</strong> — {en ? "every input state recovers with fidelity 1 / decodes exactly." : "cada estado de entrada se recupera con fidelidad 1 / decodifica exactamente."}</li>
            <li><strong>QEC</strong> — {en ? "Stim's Clifford sim + PyMatching MWPM, below-threshold scaling reproduced (d=5 < d=3)." : "sim Clifford de Stim + MWPM de PyMatching, escalamiento bajo umbral reproducido (d=5 < d=3)."}</li>
          </ul>
          <p className="honest-note"><strong>{en ? "Self-validating — " : "Autovalidante — "}</strong>{en
            ? "each quantum solver is also checked against the classical baseline in the same run; the comparison verdict on every case is the audit trail."
            : "cada solver cuántico también se contrasta con el baseline clásico en la misma corrida; el veredicto de comparación de cada caso es el registro de auditoría."}</p>
        </div>
      ),
    },
    { id: "coverage", label: en ? "Coverage matrix" : "Matriz de cobertura", content: coverage },
  ];

  return (
    <div className="page doc-page">
      <div className="page-head">
        <h1>{en ? "Experiments" : "Experimentos"}</h1>
        <p className="lede">
          {en
            ? "The protocol behind the committed traces (seeded, reproducible, leakage-safe), the cross-framework cross-check that validates every quantum result, and the live coverage matrix of cases × frameworks."
            : "El protocolo detrás de las trazas commiteadas (con semilla, reproducible, sin fuga), la validación cruzada entre frameworks de cada resultado cuántico, y la matriz de cobertura en vivo de casos × frameworks."}
        </p>
      </div>
      <Tabs tabs={tabs} initial="coverage" />
    </div>
  );
}

function CategoryBlock({ category, crs, lang }: { category: string; crs: CaseRow[]; lang: "en" | "es" }) {
  const label = CATEGORY_LABELS[category]?.[lang] ?? category;
  return (
    <>
      <tr className="cat-head-row"><td colSpan={5}>{label}</td></tr>
      {crs.map((r) => (
        <tr key={r.id}>
          <td>{r.title}</td>
          <td>{r.frameworks.map((f) => <span key={f} className="fw-chip">{f}</span>)}</td>
          <td>{r.variants}</td>
          <td><span className={`lane-pill ${r.lane}`}>{r.lane}</span></td>
          <td>{r.hasClassical ? "✓" : "—"}</td>
        </tr>
      ))}
    </>
  );
}
