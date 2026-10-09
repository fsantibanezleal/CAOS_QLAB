import { useState } from "react";

export interface EnergyScanData { theta: number[]; energy: number[] }

export function isEnergyScan(x: unknown): x is EnergyScanData {
  if (!x || typeof x !== "object") return false;
  const l = x as Record<string, unknown>;
  return Array.isArray(l.theta) && Array.isArray(l.energy) && l.theta.length === l.energy.length && l.theta.length > 1;
}

const READOUT_H = 24;

/** VQE's energy against the ansatz angle θ, with the optimum the optimiser reached and the exact (FCI) energy. */
export function EnergyScan({ scan, thetaStar, exact, size }: {
  scan: EnergyScanData; thetaStar?: number; exact?: number; size: { width: number; height: number };
}) {
  const [hover, setHover] = useState<number | null>(null);
  const { theta, energy } = scan;
  const W = size.width, H = size.height - READOUT_H;
  const padL = 56, padR = 16, padT = 10, padB = 34;
  const values = exact !== undefined ? [...energy, exact] : energy;
  const lo = Math.min(...values), hi = Math.max(...values);
  const span = hi - lo || 1;
  const x = (t: number) => padL + ((t - theta[0]) / (theta[theta.length - 1] - theta[0])) * (W - padL - padR);
  const y = (e: number) => padT + ((hi - e) / span) * (H - padT - padB);
  const path = theta.map((t, i) => `${i ? "L" : "M"}${x(t).toFixed(1)} ${y(energy[i]).toFixed(1)}`).join(" ");
  const iMin = energy.indexOf(Math.min(...energy));
  const ticks = [lo, lo + span / 2, hi];
  return (
    <div className="qlab-fit">
      <div className="qlab-fit-readout">
        <span className="viz-sub">E(θ) in Hartree; dashed = exact (FCI)</span>
        {hover !== null && <span className="viz-readout">θ={theta[hover].toFixed(3)} · E={energy[hover].toFixed(6)} Ha</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="viz-svg" role="img" aria-label="VQE energy scan"
           onMouseLeave={() => setHover(null)}
           onMouseMove={(ev) => {
             const r = (ev.currentTarget as SVGSVGElement).getBoundingClientRect();
             const t = theta[0] + ((ev.clientX - r.left - padL) / (W - padL - padR)) * (theta[theta.length - 1] - theta[0]);
             let best = 0;
             theta.forEach((v, i) => { if (Math.abs(v - t) < Math.abs(theta[best] - t)) best = i; });
             setHover(best);
           }}>
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--color-border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--color-border)" />
        {ticks.map((v) => (
          <text key={v} x={padL - 6} y={y(v) + 3} textAnchor="end" className="viz-axis">{v.toFixed(2)}</text>
        ))}
        {[-Math.PI, 0, Math.PI].map((t) => (
          <text key={t} x={x(t)} y={H - padB + 16} textAnchor="middle" className="viz-axis">{t === 0 ? "0" : t > 0 ? "π" : "−π"}</text>
        ))}
        <text x={(padL + W - padR) / 2} y={H - 4} textAnchor="middle" className="viz-axis">θ (rad)</text>
        {exact !== undefined && (
          <line x1={padL} y1={y(exact)} x2={W - padR} y2={y(exact)} stroke="var(--color-good)" strokeDasharray="6 4" />
        )}
        <path d={path} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
        <circle cx={x(thetaStar ?? theta[iMin])} cy={y(energy[iMin])} r={5} fill="var(--color-magenta)" />
        {hover !== null && <circle cx={x(theta[hover])} cy={y(energy[hover])} r={4} fill="var(--color-fg)" />}
      </svg>
    </div>
  );
}
