// Build a live (in-browser) trace from circuit_ops + slider overrides, reusing the committed Step/Measurements
// shapes so the SAME renderers (circuit, Bloch, amplitudes, histogram) animate it — replay-shape = live-shape.

import type { Amp, Measurements, Step } from "../lib/contract.types";
import { applyOp, blochOf, type Op, probabilities, sampleCounts, type State, zeroState } from "./statevector";

const SUPPORTED = new Set([
  "h", "x", "y", "z", "s", "sdg", "t", "tdg", "rx", "ry", "rz", "p", "u1",
  "cx", "cnot", "cz", "cp", "cu1", "rzz", "swap", "barrier", "id", "i",
]);
const PARAMETRIC = new Set(["rx", "ry", "rz", "p", "u1", "cp", "cu1", "rzz"]);

/** True if every op is supported by the live engine (else the case stays replay-only). */
export function liveSupported(ops: Op[]): boolean {
  return ops.every((o) => SUPPORTED.has(o.gate.toLowerCase()));
}

export interface Adjustable {
  opIndex: number;
  gate: string;
  target: number[];
  value: number;
}

export function adjustableParams(ops: Op[]): Adjustable[] {
  const out: Adjustable[] = [];
  ops.forEach((o, i) => {
    if (PARAMETRIC.has(o.gate.toLowerCase()) && o.params?.length) {
      out.push({ opIndex: i, gate: o.gate, target: o.targets, value: o.params[0] });
    }
  });
  return out;
}

function snapshot(st: State): { statevector: Amp[]; bloch: number[][]; probabilities: number[] } {
  const statevector: Amp[] = new Array(st.re.length);
  for (let i = 0; i < st.re.length; i++) statevector[i] = { re: st.re[i], im: st.im[i] };
  const bloch: number[][] = [];
  for (let q = 0; q < st.n; q++) bloch.push(blochOf(st, q));
  return { statevector, bloch, probabilities: probabilities(st) };
}

function pi(x: number): string {
  if (Math.abs(x) < 1e-9) return "0";
  const r = x / Math.PI;
  const near = (t: number) => Math.abs(r - t) < 0.02;
  if (near(1)) return "π"; if (near(0.5)) return "π/2"; if (near(0.25)) return "π/4";
  if (near(0.75)) return "3π/4"; if (near(1 / 3)) return "π/3"; if (near(1 / 6)) return "π/6";
  return x.toFixed(2);
}

export interface LiveResult { steps: Step[]; measurements: Measurements; }

/** Run the circuit with the given param overrides (opIndex → angle) and return a replay-shaped result. */
export function runLive(
  ops: Op[],
  n: number,
  overrides: Record<number, number>,
  shots: number,
  seed: number,
): LiveResult {
  const st = zeroState(n);
  const init = snapshot(st);
  const steps: Step[] = [{
    index: 0, gate: "init", targets: [], params: [],
    label: { en: "Initial state |0…0⟩", es: "Estado inicial |0…0⟩" },
    ...init,
  }];

  ops.forEach((op, i) => {
    const params = PARAMETRIC.has(op.gate.toLowerCase()) && overrides[i] != null ? [overrides[i]] : op.params;
    applyOp(st, { gate: op.gate, targets: op.targets, params });
    const snap = snapshot(st);
    const angle = params?.length ? `(${pi(params[0])})` : "";
    const lbl = `${op.gate.toUpperCase()}${angle} q${op.targets.join(",")}`;
    steps.push({ index: i + 1, gate: op.gate, targets: op.targets, params: params ?? [],
      label: { en: lbl, es: lbl }, ...snap });
  });

  const measurements: Measurements = { counts: sampleCounts(st, shots, seed), shots };
  return { steps, measurements };
}
