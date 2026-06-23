import type { CircuitOp } from "../lib/contract.types";

// SVG circuit diagram from the committed `circuit_ops` (gate · targets · params). Pure SVG (no deps),
// horizontally scrollable for wide circuits. Handles the gate set QLab actually emits + a labelled fallback.

const COL = 38; // px per gate column
const ROW = 44; // px per qubit wire
const PADX = 46; // left gutter for qubit labels
const BOX = 26; // gate box size

const TWO_Q_LINE = new Set(["cx", "cz", "rzz", "cp", "swap"]);

function fmtAngle(params: number[]): string {
  if (!params.length) return "";
  const a = params[0];
  const overPi = a / Math.PI;
  if (Math.abs(overPi - Math.round(overPi)) < 1e-3 && Math.round(overPi) !== 0)
    return `${Math.round(overPi) === 1 ? "" : Math.round(overPi)}π`;
  for (const d of [2, 3, 4, 6, 8]) {
    if (Math.abs(overPi * d - Math.round(overPi * d)) < 1e-3) {
      const n = Math.round(overPi * d);
      return `${n === 1 ? "" : n === -1 ? "-" : n}π/${d}`;
    }
  }
  return a.toFixed(2);
}

export function CircuitDiagram({ ops, qubits }: { ops: CircuitOp[]; qubits: number }) {
  if (!ops?.length) return null;
  if (qubits > 10) {
    return (
      <div className="viz">
        <div className="viz-title">Circuit</div>
        <p className="note">{qubits} qubits — diagram omitted (too wide).</p>
      </div>
    );
  }
  const cols = ops.length;
  const W = PADX + cols * COL + 14;
  const H = qubits * ROW + 10;
  const wireY = (q: number) => 14 + q * ROW + BOX / 2;
  const colX = (i: number) => PADX + i * COL + COL / 2;

  return (
    <div className="viz">
      <div className="viz-title">
        Circuit <span className="viz-sub">{cols} gates · {qubits} qubits</span>
      </div>
      <div className="circuit-scroll">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="circuit-svg" role="img">
          {/* qubit wires + labels */}
          {Array.from({ length: qubits }, (_, q) => (
            <g key={q}>
              <text x={6} y={wireY(q) + 4} className="circ-qlabel">q{q}</text>
              <line x1={PADX - 8} y1={wireY(q)} x2={W - 6} y2={wireY(q)} className="circ-wire" />
            </g>
          ))}
          {ops.map((op, i) => {
            const x = colX(i);
            const g = op.gate.toLowerCase();
            const t = op.targets;
            // two-qubit linked gates: control dot(s) + target glyph + vertical link
            if (TWO_Q_LINE.has(g) && t.length === 2) {
              const [a, b] = t;
              const yTop = wireY(Math.min(a, b));
              const yBot = wireY(Math.max(a, b));
              return (
                <g key={i}>
                  <line x1={x} y1={yTop} x2={x} y2={yBot} className="circ-link" />
                  {g === "cx" && (
                    <>
                      <circle cx={x} cy={wireY(a)} r={4} className="circ-ctrl" />
                      <circle cx={x} cy={wireY(b)} r={9} className="circ-target-o" />
                      <line x1={x - 9} y1={wireY(b)} x2={x + 9} y2={wireY(b)} className="circ-plus" />
                      <line x1={x} y1={wireY(b) - 9} x2={x} y2={wireY(b) + 9} className="circ-plus" />
                    </>
                  )}
                  {g === "cz" && (<>
                    <circle cx={x} cy={wireY(a)} r={4} className="circ-ctrl" />
                    <circle cx={x} cy={wireY(b)} r={4} className="circ-ctrl" />
                  </>)}
                  {g === "swap" && (<>
                    {[a, b].map((q) => (
                      <g key={q}>
                        <line x1={x - 6} y1={wireY(q) - 6} x2={x + 6} y2={wireY(q) + 6} className="circ-plus" />
                        <line x1={x - 6} y1={wireY(q) + 6} x2={x + 6} y2={wireY(q) - 6} className="circ-plus" />
                      </g>
                    ))}
                  </>)}
                  {(g === "rzz" || g === "cp") && (<>
                    <circle cx={x} cy={wireY(a)} r={4} className="circ-ctrl" />
                    <circle cx={x} cy={wireY(b)} r={4} className="circ-ctrl" />
                    <rect x={x - 13} y={(yTop + yBot) / 2 - 8} width={26} height={16} rx={3} className="circ-box" />
                    <text x={x} y={(yTop + yBot) / 2 + 3} textAnchor="middle" className="circ-glabel sm">
                      {g === "rzz" ? "ZZ" : "P"}
                    </text>
                  </>)}
                </g>
              );
            }
            // single/other gates: a labelled box on each target wire (controlled-unitary etc. → span)
            const label = g.replace(/^c?/, (m) => m).toUpperCase() + (op.params.length ? ` ${fmtAngle(op.params)}` : "");
            if (t.length === 1) {
              const y = wireY(t[0]);
              return (
                <g key={i}>
                  <rect x={x - BOX / 2} y={y - BOX / 2} width={BOX} height={BOX} rx={4} className="circ-box" />
                  <text x={x} y={y + 4} textAnchor="middle" className="circ-glabel">{label}</text>
                </g>
              );
            }
            // multi-target fallback: a box spanning the involved wires
            const ys = t.map(wireY);
            const top = Math.min(...ys) - BOX / 2;
            const bot = Math.max(...ys) + BOX / 2;
            return (
              <g key={i}>
                <rect x={x - BOX / 2} y={top} width={BOX} height={bot - top} rx={4} className="circ-box" />
                <text x={x} y={(top + bot) / 2 + 4} textAnchor="middle" className="circ-glabel sm">{op.gate}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
