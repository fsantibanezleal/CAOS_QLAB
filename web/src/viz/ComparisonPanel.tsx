import type { Bundle } from "../lib/contract.types";
import { useT, useUI } from "../lib/ui";

const PARADIGM_DOT: Record<string, string> = {
  "quantum-sim": "#5b8cff",
  "quantum-hardware": "#c678dd",
  classical: "#9aa7b4",
};
const PARADIGM_LABEL: Record<string, string> = {
  "quantum-sim": "quantum (sim)",
  "quantum-hardware": "quantum (hw)",
  classical: "classical",
};

function compactValue(value: Record<string, unknown>): string {
  return Object.entries(value)
    .filter(([k]) => !["correlators", "bloch", "input_bloch", "output_bloch", "poles"].includes(k))
    .slice(0, 4)
    .map(([k, v]) => `${k}=${typeof v === "number" ? v : Array.isArray(v) ? `[${v.length}]` : v}`)
    .join("  ");
}

/** The signature quantum-vs-classical comparison: each solver's result + cost, plus the honest verdict. */
export function ComparisonPanel({ bundle }: { bundle: Bundle }) {
  const t = useT();
  const { lang } = useUI();
  return (
    <div className="cmp">
      <div className="viz-title">{lang === "en" ? "Solvers — quantum vs classical" : "Solvers — cuántico vs clásico"}</div>
      <table className="cmp-table">
        <thead>
          <tr>
            <th>{lang === "en" ? "Method" : "Método"}</th>
            <th>{lang === "en" ? "Kind" : "Tipo"}</th>
            <th>{lang === "en" ? "Result" : "Resultado"}</th>
            <th>{lang === "en" ? "Cost" : "Costo"}</th>
          </tr>
        </thead>
        <tbody>
          {bundle.solvers.map((s) => (
            <tr key={s.solver}>
              <td>
                <span className="dot" style={{ background: PARADIGM_DOT[s.paradigm] ?? "#888" }} /> {t(s.label)}
                <span className="fw">{s.framework}</span>
              </td>
              <td className="kind">{PARADIGM_LABEL[s.paradigm] ?? s.paradigm}</td>
              <td className="mono">{compactValue(s.value)}</td>
              <td className="mono">
                {typeof s.cost.wall_ms === "number" ? `${s.cost.wall_ms} ms` : ""}
                {typeof s.cost.qubits === "number" ? ` · ${s.cost.qubits}q` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {bundle.comparison?.verdict && (
        <p className="verdict">{t(bundle.comparison.verdict)}</p>
      )}
    </div>
  );
}
