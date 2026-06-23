import { useState } from "react";
import type { Step } from "../lib/contract.types";

// Phase → hue colour (relative phase shown as colour, magnitude as bar height).
function phaseColor(re: number, im: number): string {
  const mag = Math.hypot(re, im);
  if (mag < 1e-6) return "var(--border)";
  const deg = ((Math.atan2(im, re) * 180) / Math.PI + 360) % 360;
  return `hsl(${deg.toFixed(0)} 70% 60%)`;
}

/** State-vector amplitude/phase bars: height = |amp|², colour = phase. */
export function AmplitudeBars({ step, qubits }: { step: Step; qubits: number }) {
  const [hover, setHover] = useState<string | null>(null);
  if (qubits > 5) {
    return (
      <div className="viz">
        <div className="viz-title">State vector</div>
        <p className="note">{2 ** qubits} amplitudes — too many to plot; see the histogram.</p>
      </div>
    );
  }
  const amps = step.statevector;
  const probs = amps.map((a) => a.re * a.re + a.im * a.im);
  const max = Math.max(...probs, 1e-9);
  const W = 520, H = 170, padB = 28, padL = 6;
  const bw = (W - padL * 2) / amps.length;

  return (
    <div className="viz">
      <div className="viz-title">
        Amplitudes <span className="viz-sub">height = |amp|², colour = phase</span>
        {hover && <span className="viz-readout">{hover}</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="viz-svg" role="img">
        {amps.map((a, i) => {
          const h = (probs[i] / max) * (H - padB - 8);
          const x = padL + i * bw;
          const bits = i.toString(2).padStart(qubits, "0");
          const phaseDeg = ((Math.atan2(a.im, a.re) * 180) / Math.PI).toFixed(0);
          return (
            <g key={i}
               onMouseEnter={() => setHover(`|${bits}⟩ : |amp|²=${probs[i].toFixed(3)}, φ=${phaseDeg}°`)}
               onMouseLeave={() => setHover(null)}>
              <rect x={x + 1} y={H - padB - h} width={bw - 2} height={Math.max(h, probs[i] > 1e-6 ? 2 : 0)}
                    rx={2} fill={phaseColor(a.re, a.im)} opacity={hover && !hover.includes(bits) ? 0.5 : 1} />
              {amps.length <= 16 && (
                <text x={x + bw / 2} y={H - padB + 14} textAnchor="middle" className="viz-axis">{bits}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
