import { useRef, useState } from "react";

export type Vec3 = [number, number, number];

/** A labelled point in the trajectory (a single-qubit Bloch vector at one step). */
export interface BlochPoint {
  v: Vec3;
  label?: string;
}

// Orthographic projection of a z-up unit sphere. `az` spins about the vertical (z) axis,
// `el` tilts about the screen-horizontal (x) axis. Returns screen coords + a depth (larger = farther).
function project(p: Vec3, az: number, el: number, R: number, cx: number, cy: number) {
  const [x, y, z] = p;
  const x1 = x * Math.cos(az) - y * Math.sin(az);
  const y1 = x * Math.sin(az) + y * Math.cos(az);
  const z1 = z;
  const y2 = y1 * Math.cos(el) - z1 * Math.sin(el);
  const z2 = y1 * Math.sin(el) + z1 * Math.cos(el);
  return { sx: cx + x1 * R, sy: cy - z2 * R, depth: y2 };
}

function spherePoint(latDeg: number, lonDeg: number): Vec3 {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
}

function pathOf(pts: Vec3[], az: number, el: number, R: number, cx: number, cy: number): string {
  return pts
    .map((p, i) => {
      const { sx, sy } = project(p, az, el, R, cx, cy);
      return `${i === 0 ? "M" : "L"}${sx.toFixed(1)} ${sy.toFixed(1)}`;
    })
    .join(" ");
}

const KETS: { v: Vec3; ket: string }[] = [
  { v: [0, 0, 1], ket: "|0⟩" },
  { v: [0, 0, -1], ket: "|1⟩" },
  { v: [1, 0, 0], ket: "|+⟩" },
  { v: [-1, 0, 0], ket: "|−⟩" },
  { v: [0, 1, 0], ket: "|i⟩" },
  { v: [0, -1, 0], ket: "|−i⟩" },
];

/**
 * Interactive Bloch sphere: a draggable wireframe globe with the qubit's state vector, the gate
 * trajectory, and the |0⟩/|1⟩/|±⟩/|±i⟩ poles. Pure SVG (orthographic) — deterministic to screenshot.
 */
export function BlochSphere({ trajectory }: { trajectory: BlochPoint[] }) {
  const [view, setView] = useState({ az: -0.5, el: 0.34 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  const W = 340, H = 320, R = 118;
  const cx = W / 2, cy = H / 2 + 6;
  const { az, el } = view;

  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setView((s) => ({
      az: s.az - dx * 0.01,
      el: Math.max(-1.45, Math.min(1.45, s.el + dy * 0.01)),
    }));
  };
  const onUp = () => { drag.current = null; };

  // wireframe meridians + parallels
  const meridians = [0, 45, 90, 135].map((lon) =>
    pathOf(Array.from({ length: 49 }, (_, i) => spherePoint(-90 + i * 3.75, lon)), az, el, R, cx, cy),
  );
  const parallels = [-60, -30, 0, 30, 60].map((lat) =>
    pathOf(Array.from({ length: 49 }, (_, i) => spherePoint(lat, i * 7.5)), az, el, R, cx, cy),
  );

  const tip = trajectory[trajectory.length - 1]?.v ?? [0, 0, 0];
  const tipP = project(tip, az, el, R, cx, cy);
  const origin = project([0, 0, 0], az, el, R, cx, cy);
  const mag = Math.hypot(...tip);

  // arrowhead in screen space
  const ang = Math.atan2(tipP.sy - origin.sy, tipP.sx - origin.sx);
  const ah = 9;
  const head = mag > 1e-3
    ? `M${tipP.sx} ${tipP.sy} ` +
      `L${tipP.sx - ah * Math.cos(ang - 0.4)} ${tipP.sy - ah * Math.sin(ang - 0.4)} ` +
      `L${tipP.sx - ah * Math.cos(ang + 0.4)} ${tipP.sy - ah * Math.sin(ang + 0.4)} Z`
    : "";

  return (
    <div className="viz">
      <div className="viz-title">
        Bloch sphere <span className="viz-sub">drag to rotate · arrow = state, dots = gate steps</span>
        <span className="viz-readout">
          r=({tip[0].toFixed(2)}, {tip[1].toFixed(2)}, {tip[2].toFixed(2)}) · |r|={mag.toFixed(2)}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="viz-svg bloch-svg" role="img" aria-label="Bloch sphere"
           onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
        {/* silhouette */}
        <circle cx={cx} cy={cy} r={R} className="bloch-outline" />
        {parallels.map((d, i) => (
          <path key={`p${i}`} d={d} className={i === 2 ? "bloch-equator" : "bloch-grid"} />
        ))}
        {meridians.map((d, i) => <path key={`m${i}`} d={d} className="bloch-grid" />)}
        {/* axes + kets (drawn back-to-front so labels read on top) */}
        {KETS.map(({ v, ket }) => {
          const e = project(v, az, el, R, cx, cy);
          const lp = project(v.map((c) => c * 1.16) as Vec3, az, el, R, cx, cy);
          return (
            <g key={ket}>
              <line x1={origin.sx} y1={origin.sy} x2={e.sx} y2={e.sy} className="bloch-axis" />
              <text x={lp.sx} y={lp.sy + 3} textAnchor="middle" className="bloch-ket">{ket}</text>
            </g>
          );
        })}
        {/* trajectory */}
        {trajectory.length > 1 && (
          <path d={pathOf(trajectory.map((t) => t.v), az, el, R, cx, cy)} className="bloch-traj" />
        )}
        {trajectory.map((t, i) => {
          const e = project(t.v, az, el, R, cx, cy);
          return (
            <g key={i}>
              <circle cx={e.sx} cy={e.sy} r={i === trajectory.length - 1 ? 0 : 3.2} className="bloch-step" />
              {t.label && i < trajectory.length - 1 && (
                <text x={e.sx + 6} y={e.sy - 5} className="bloch-steplabel">{t.label}</text>
              )}
            </g>
          );
        })}
        {/* state vector */}
        {mag > 1e-3 && (
          <>
            <line x1={origin.sx} y1={origin.sy} x2={tipP.sx} y2={tipP.sy} className="bloch-vector" />
            <path d={head} className="bloch-vhead" />
          </>
        )}
      </svg>
    </div>
  );
}

/** Build a single-qubit trajectory from a trace's per-step bloch vectors (qubit 0). */
export function trajectoryFromSteps(
  steps: { bloch?: number[][]; gate?: string; label?: { en: string; es: string } | string }[],
  lang: "en" | "es",
): BlochPoint[] {
  const out: BlochPoint[] = [];
  for (const s of steps) {
    const b = s.bloch?.[0];
    if (!b || b.length < 3) continue;
    const label = typeof s.label === "string" ? s.label : s.label?.[lang] ?? s.gate;
    out.push({ v: [b[0], b[1], b[2]], label });
  }
  return out;
}
