import { useState } from "react";
import type { Step } from "../lib/contract.types";

// Phase → hue colour (relative phase shown as colour, magnitude as bar height).
function phaseColor(re: number, im: number): string {
  const mag = Math.hypot(re, im);
  if (mag < 1e-6) return "var(--border)";
  const deg = ((Math.atan2(im, re) * 180) / Math.PI + 360) % 360;
  return `hsl(${deg.toFixed(0)} 70% 60%)`;
}

const READOUT_H = 22;

/** State-vector amplitude/phase bars: height = |amp|², colour = phase. With `size` (a workbench stage) the chart
 *  lays out to that size and the hover read-out is its top row; without it, it is a titled card. */
export function AmplitudeBars({ step, qubits, size }: { step: Step; qubits: number; size?: { width: number; height: number } }) {
  const [hover, setHover] = useState<string | null>(null);
  if (qubits > 5) {
    return <p className="note">{2 ** qubits} amplitudes, too many to plot; see the histogram.</p>;
  }
  const amps = step.statevector;
  const probs = amps.map((a) => a.re * a.re + a.im * a.im);
  const max = Math.max(...probs, 1e-9);
  const W = size ? size.width : 520;
  const H = size ? size.height - READOUT_H : 170;
  const padB = 28, padL = 6;
  const bw = (W - padL * 2) / amps.length;
  const legend = <span className="viz-sub">height = |amp|², colour = phase</span>;

  const svg = (
    <svg viewBox={`0 0 ${W} ${H}`} width={size ? W : undefined} height={size ? H : undefined} className="viz-svg" role="img">
      {amps.map((a, i) => {
        const h = (probs[i] / max) * (H - padB - 8);
        const x = padL + i * bw;
        const bits = i.toString(2).padStart(qubits, "0");
        const phaseDeg = ((Math.atan2(a.im, a.re) * 180) / Math.PI).toFixed(0);
        return (
          <g key={i}
             onMouseEnter={() => setHover(`|${bits}⟩ : |amp|²=${probs[i].toFixed(3)}, φ=${phaseDeg}°`)}
             onMouseLeave={() => setHover(null)}>
            <rect x={x + 1} y={H - padB - h} width={Math.max(bw - 2, 1)} height={Math.max(h, probs[i] > 1e-6 ? 2 : 0)}
                  rx={2} fill={phaseColor(a.re, a.im)} opacity={hover && !hover.includes(bits) ? 0.5 : 1} />
            {amps.length <= 16 && (
              <text x={x + bw / 2} y={H - padB + 14} textAnchor="middle" className="viz-axis">{bits}</text>
            )}
          </g>
        );
      })}
    </svg>
  );

  if (size) {
    return (
      <div className="qlab-fit">
        <div className="qlab-fit-readout">{hover ?? legend}</div>
        {svg}
      </div>
    );
  }
  return (
    <div className="viz">
      <div className="viz-title">
        Amplitudes {legend}
        {hover && <span className="viz-readout">{hover}</span>}
      </div>
      {svg}
    </div>
  );
}
