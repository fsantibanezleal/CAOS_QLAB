import { useState } from "react";

/** The (γ,β) cost landscape recorded by the QAOA precompute (trace.extra.landscape). */
export interface Landscape {
  gammas: number[];
  betas: number[];
  expectation: number[][]; // expectation[gammaIdx][betaIdx]
}

export function isLandscape(x: unknown): x is Landscape {
  if (!x || typeof x !== "object") return false;
  const l = x as Record<string, unknown>;
  return (
    Array.isArray(l.gammas) &&
    Array.isArray(l.betas) &&
    Array.isArray(l.expectation) &&
    Array.isArray((l.expectation as unknown[])[0])
  );
}

// Sequential dark-blue → teal → yellow ramp (perceptually ordered, readable on both themes).
const STOPS: [number, [number, number, number]][] = [
  [0.0, [13, 17, 38]],
  [0.25, [28, 52, 122]],
  [0.5, [22, 124, 138]],
  [0.75, [86, 188, 102]],
  [1.0, [243, 224, 92]],
];

function ramp(t: number): string {
  const u = Math.max(0, Math.min(1, t));
  for (let i = 1; i < STOPS.length; i++) {
    const [p1, c1] = STOPS[i];
    if (u <= p1) {
      const [p0, c0] = STOPS[i - 1];
      const f = (u - p0) / (p1 - p0 || 1);
      const c = c0.map((v, k) => Math.round(v + (c1[k] - v) * f));
      return `rgb(${c[0]} ${c[1]} ${c[2]})`;
    }
  }
  return `rgb(${STOPS[STOPS.length - 1][1].join(" ")})`;
}

function fmtPi(x: number): string {
  if (Math.abs(x) < 1e-9) return "0";
  const r = x / Math.PI;
  if (Math.abs(r - 1) < 0.03) return "π";
  if (Math.abs(r - 0.5) < 0.03) return "π/2";
  if (Math.abs(r - 0.25) < 0.03) return "π/4";
  if (Math.abs(r - 0.75) < 0.03) return "3π/4";
  return x.toFixed(2);
}

function nearestIdx(arr: number[], v: number): number {
  let best = 0;
  let bd = Infinity;
  for (let i = 0; i < arr.length; i++) {
    const d = Math.abs(arr[i] - v);
    if (d < bd) { bd = d; best = i; }
  }
  return best;
}

/**
 * QAOA cost landscape: ⟨cut⟩ over the (γ,β) plane. γ on x, β on y, brighter = larger cut.
 * The optimizer's chosen (γ*,β*) is ringed; hover reads off the local expectation.
 */
export function LandscapeHeatmap({
  landscape,
  gammaStar,
  betaStar,
  metricLabel = "⟨cut⟩",
}: {
  landscape: Landscape;
  gammaStar?: number;
  betaStar?: number;
  metricLabel?: string;
}) {
  const { gammas, betas, expectation } = landscape;
  const [hover, setHover] = useState<{ gi: number; bi: number } | null>(null);

  const flat = expectation.flat();
  const lo = Math.min(...flat);
  const hi = Math.max(...flat);
  const span = hi - lo || 1;

  const nG = gammas.length;
  const nB = betas.length;
  const PLOT = 300;
  const PADL = 40;
  const PADB = 30;
  const PADT = 8;
  const PADR = 70;
  const cw = PLOT / nG;
  const ch = PLOT / nB;
  const W = PADL + PLOT + PADR;
  const H = PADT + PLOT + PADB;

  const giStar = gammaStar != null ? nearestIdx(gammas, gammaStar) : -1;
  const biStar = betaStar != null ? nearestIdx(betas, betaStar) : -1;

  // β increases upward in plot space (row 0 at the bottom).
  const yOf = (bi: number) => PADT + (nB - 1 - bi) * ch;

  const readout = hover
    ? `γ=${gammas[hover.gi].toFixed(3)}  β=${betas[hover.bi].toFixed(3)}  ${metricLabel}=${expectation[hover.gi][hover.bi].toFixed(3)}`
    : giStar >= 0
      ? `optimum: γ*=${gammas[giStar].toFixed(3)}  β*=${betas[biStar].toFixed(3)}  ${metricLabel}=${expectation[giStar][biStar].toFixed(3)}`
      : null;

  return (
    <div className="viz">
      <div className="viz-title">
        QAOA landscape <span className="viz-sub">{metricLabel} over (γ, β) · brighter = larger cut</span>
        {readout && <span className="viz-readout">{readout}</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="viz-svg" role="img" aria-label="QAOA cost landscape">
        {/* cells */}
        {expectation.map((row, gi) =>
          row.map((v, bi) => (
            <rect
              key={`${gi}-${bi}`}
              x={PADL + gi * cw}
              y={yOf(bi)}
              width={cw + 0.5}
              height={ch + 0.5}
              fill={ramp((v - lo) / span)}
              onMouseEnter={() => setHover({ gi, bi })}
              onMouseLeave={() => setHover(null)}
            />
          )),
        )}
        {/* chosen optimum */}
        {giStar >= 0 && biStar >= 0 && (
          <g pointerEvents="none">
            <circle cx={PADL + (giStar + 0.5) * cw} cy={yOf(biStar) + ch / 2} r={7}
                    fill="none" stroke="#fff" strokeWidth={2} />
            <circle cx={PADL + (giStar + 0.5) * cw} cy={yOf(biStar) + ch / 2} r={2.5} fill="#fff" />
          </g>
        )}
        {/* hover marker */}
        {hover && (
          <rect x={PADL + hover.gi * cw} y={yOf(hover.bi)} width={cw} height={ch}
                fill="none" stroke="#fff" strokeWidth={1.5} pointerEvents="none" />
        )}
        {/* axes frame */}
        <rect x={PADL} y={PADT} width={PLOT} height={PLOT} fill="none" stroke="var(--border)" />
        {/* x ticks (γ) */}
        {[0, 0.5, 1].map((f) => {
          const g = lo === hi ? 0 : gammas[Math.round(f * (nG - 1))];
          return (
            <text key={`gx${f}`} x={PADL + f * PLOT} y={H - PADB + 18} textAnchor="middle" className="viz-axis">
              {fmtPi(g)}
            </text>
          );
        })}
        <text x={PADL + PLOT / 2} y={H - 2} textAnchor="middle" className="viz-axis">γ</text>
        {/* y ticks (β) */}
        {[0, 0.5, 1].map((f) => {
          const b = betas[Math.round(f * (nB - 1))];
          return (
            <text key={`by${f}`} x={PADL - 6} y={PADT + (1 - f) * PLOT + 3} textAnchor="end" className="viz-axis">
              {fmtPi(b)}
            </text>
          );
        })}
        <text x={12} y={PADT + PLOT / 2} textAnchor="middle" className="viz-axis"
              transform={`rotate(-90 12 ${PADT + PLOT / 2})`}>β</text>
        {/* colour bar */}
        <defs>
          <linearGradient id="qlab-cbar" x1="0" y1="1" x2="0" y2="0">
            {STOPS.map(([p, c]) => (
              <stop key={p} offset={`${p * 100}%`} stopColor={`rgb(${c.join(" ")})`} />
            ))}
          </linearGradient>
        </defs>
        <rect x={PADL + PLOT + 18} y={PADT} width={12} height={PLOT} fill="url(#qlab-cbar)"
              stroke="var(--border)" />
        <text x={PADL + PLOT + 34} y={PADT + 8} className="viz-axis">{hi.toFixed(2)}</text>
        <text x={PADL + PLOT + 34} y={PADT + PLOT} className="viz-axis">{lo.toFixed(2)}</text>
      </svg>
    </div>
  );
}
