import { useState } from "react";

/** Zero-noise extrapolation record (noise-qiskit solver's extra.zne). */
export interface Zne {
  lambdas: number[];
  expectations: number[];
  slope: number;
  intercept: number;
}

export function isZne(x: unknown): x is Zne {
  if (!x || typeof x !== "object") return false;
  const z = x as Record<string, unknown>;
  return (
    Array.isArray(z.lambdas) &&
    Array.isArray(z.expectations) &&
    typeof z.slope === "number" &&
    typeof z.intercept === "number"
  );
}

/**
 * Zero-noise extrapolation: the noisy expectation measured at amplified noise scales λ=1,3,5, the linear
 * fit back to λ=0 (the mitigated estimate = the intercept), and the ideal value. The residual gap to the
 * ideal is the honest point — ZNE reduces bias, it does not correct errors.
 */
export function ZneExtrapolation({ zne, ideal, metric = "⟨Z₀Z₁⟩" }: { zne: Zne; ideal?: number; metric?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const { lambdas, expectations, slope, intercept } = zne;

  const W = 520, H = 250, PADL = 46, PADB = 34, PADT = 12, PADR = 14;
  const plotW = W - PADL - PADR;
  const plotH = H - PADT - PADB;

  const lamMax = Math.max(...lambdas) + 0.5;
  // Auto-scale to the data (don't force 0 — the action lives in a narrow band near the ideal).
  const ys = [...expectations, intercept, ideal ?? 1];
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  const pad = (hi - lo) * 0.18 || 0.05;
  const yMin = lo - pad;
  const yMax = hi + pad;
  const ySpan = yMax - yMin || 1;

  const X = (lam: number) => PADL + (lam / lamMax) * plotW;
  const Y = (v: number) => PADT + (1 - (v - yMin) / ySpan) * plotH;

  // fit line from λ=0 (intercept) to λ=lamMax
  const fitY = (lam: number) => intercept + slope * lam;

  return (
    <div className="viz">
      <div className="viz-title">
        Zero-noise extrapolation <span className="viz-sub">{metric} vs noise scale λ · fit → λ=0</span>
        {hover != null && (
          <span className="viz-readout">λ={lambdas[hover]} · {metric}={expectations[hover].toFixed(4)}</span>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="viz-svg" role="img" aria-label="Zero-noise extrapolation">
        {/* axes */}
        <line x1={PADL} y1={Y(yMin)} x2={W - PADR} y2={Y(yMin)} stroke="var(--border)" />
        <line x1={PADL} y1={PADT} x2={PADL} y2={PADT + plotH} stroke="var(--border)" />
        {/* ideal reference */}
        {ideal != null && (
          <>
            <line x1={PADL} y1={Y(ideal)} x2={W - PADR} y2={Y(ideal)} className="zne-ideal" />
            <text x={W - PADR} y={Y(ideal) - 4} textAnchor="end" className="viz-axis">ideal {ideal.toFixed(3)}</text>
          </>
        )}
        {/* fit line, extended to λ=0 */}
        <line x1={X(0)} y1={Y(fitY(0))} x2={X(lamMax)} y2={Y(fitY(lamMax))} className="zne-fit" />
        {/* extrapolated intercept marker at λ=0 */}
        <circle cx={X(0)} cy={Y(intercept)} r={5} className="zne-mitig" />
        <text x={X(0) + 8} y={Y(intercept) - 6} className="zne-label">mitigated {intercept.toFixed(3)}</text>
        {/* measured points */}
        {lambdas.map((lam, i) => (
          <g key={lam} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <circle cx={X(lam)} cy={Y(expectations[i])} r={hover === i ? 6 : 4.5} className="zne-pt" />
            <text x={X(lam)} y={Y(yMin) + 16} textAnchor="middle" className="viz-axis">{lam}×</text>
          </g>
        ))}
        {/* y ticks */}
        {[yMin, (yMin + yMax) / 2, yMax].map((v, i) => (
          <text key={i} x={PADL - 6} y={Y(v) + 3} textAnchor="end" className="viz-axis">{v.toFixed(2)}</text>
        ))}
        <text x={PADL + plotW / 2} y={H - 4} textAnchor="middle" className="viz-axis">noise scale λ</text>
      </svg>
    </div>
  );
}
