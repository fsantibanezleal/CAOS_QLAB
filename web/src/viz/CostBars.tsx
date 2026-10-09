import type { SolverResult } from "../lib/contract.types";

/** Wall-clock cost of every method on the committed run, as horizontal bars on a log axis: the honest answer to
 *  "which is cheaper here", drawn next to the table that lists the same solvers. */
export function CostBars({ solvers, size, en }: { solvers: SolverResult[]; size: { width: number; height: number }; en: boolean }) {
  const rows = solvers
    .map((s) => ({ name: (en ? s.label.en : s.label.es) || s.solver, quantum: s.paradigm !== "classical", ms: Number(s.cost?.wall_ms) }))
    .filter((r) => Number.isFinite(r.ms) && r.ms > 0);
  if (!rows.length) return <p className="note">{en ? "No timing recorded for these solvers." : "Sin tiempos registrados para estos solvers."}</p>;
  const W = size.width, H = size.height;
  const padL = Math.min(240, Math.max(120, W * 0.32)), padR = 70, padT = 8, padB = 30;
  const lo = Math.floor(Math.log10(Math.min(...rows.map((r) => r.ms))));
  const hi = Math.ceil(Math.log10(Math.max(...rows.map((r) => r.ms)))) || lo + 1;
  const span = Math.max(hi - lo, 1);
  const x = (ms: number) => padL + ((Math.log10(ms) - lo) / span) * (W - padL - padR);
  const band = (H - padT - padB) / rows.length;
  const bh = Math.min(28, band * 0.62);
  const ticks = Array.from({ length: span + 1 }, (_, i) => lo + i);
  const fmt = (ms: number) => (ms >= 100 ? ms.toFixed(0) : ms >= 1 ? ms.toFixed(1) : ms.toPrecision(2));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="viz-svg" role="img"
         aria-label={en ? "Wall-clock cost per method, log scale" : "Costo en tiempo por método, escala log"}>
      {ticks.map((e) => (
        <g key={e}>
          <line x1={x(10 ** e)} y1={padT} x2={x(10 ** e)} y2={H - padB} stroke="var(--border)" />
          <text x={x(10 ** e)} y={H - padB + 16} textAnchor="middle" className="viz-axis">{10 ** e >= 1 ? 10 ** e : `1e${e}`} ms</text>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = padT + i * band + (band - bh) / 2;
        return (
          <g key={r.name + i}>
            <text x={padL - 8} y={y + bh / 2 + 4} textAnchor="end" className="viz-axis qlab-cost-label">{r.name}</text>
            <rect x={padL} y={y} width={Math.max(x(r.ms) - padL, 2)} height={bh} rx={3}
                  fill={r.quantum ? "var(--color-accent)" : "var(--color-fg-subtle)"} />
            <text x={Math.max(x(r.ms), padL + 2) + 6} y={y + bh / 2 + 4} className="viz-axis">{fmt(r.ms)} ms</text>
          </g>
        );
      })}
    </svg>
  );
}
