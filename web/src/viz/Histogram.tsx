import { useState } from "react";
import type { Measurements } from "../lib/contract.types";

/** Measurement histogram — SVG bars with value read-out on hover (interactive-visualization-rubric). */
export function Histogram({ measurements }: { measurements: Measurements }) {
  const [hover, setHover] = useState<string | null>(null);
  const entries = Object.entries(measurements.counts).sort((a, b) => a[0].localeCompare(b[0]));
  if (!entries.length) return null;
  const shots = measurements.shots || entries.reduce((s, [, c]) => s + c, 0);
  const max = Math.max(...entries.map(([, c]) => c));
  const W = 520, H = 200, padB = 28, padL = 6;
  const bw = (W - padL * 2) / entries.length;

  return (
    <div className="viz">
      <div className="viz-title">
        Measurement histogram <span className="viz-sub">{shots} shots</span>
        {hover && <span className="viz-readout">{hover}</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="viz-svg" role="img">
        {entries.map(([bits, c], i) => {
          const h = (c / max) * (H - padB - 8);
          const x = padL + i * bw;
          const p = (c / shots) * 100;
          return (
            <g key={bits} onMouseEnter={() => setHover(`|${bits}⟩ : ${c} (${p.toFixed(1)}%)`)}
               onMouseLeave={() => setHover(null)}>
              <rect x={x + 1} y={H - padB - h} width={bw - 2} height={h} rx={2}
                    fill={hover && hover.includes(bits) ? "var(--accent)" : "var(--accent-soft-2)"} />
              {entries.length <= 16 && (
                <text x={x + bw / 2} y={H - padB + 14} textAnchor="middle" className="viz-axis">{bits}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
