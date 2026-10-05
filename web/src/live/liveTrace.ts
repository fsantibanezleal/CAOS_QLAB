// Build a live (in-browser) trace from circuit_ops + slider overrides, reusing the committed Step/Measurements
// shapes so the same renderers (circuit, Bloch, amplitudes, histogram) animate it, replay-shape = live-shape.

import type { Amp, Measurements, Step } from "../lib/contract.types";
import GATES from "./gates.json" with { type: "json" };
import { applyOp, blochOf, type Op, probabilities, sampleCounts, type State, zeroState } from "./statevector.ts";

type GateSpec = { qubits: number[]; params: number };
const SPECS: Record<string, GateSpec> = GATES.gates;
const PARAMETRIC = new Set(Object.keys(SPECS).filter((g) => SPECS[g].params > 0));

/** The circuit contract for the live lane (gates.json): every reason the engine must not run this circuit. */
export function liveViolations(ops: Op[], n: number): string[] {
  const out: string[] = [];
  if (n > GATES.max_qubits) out.push(`${n} qubits > ${GATES.max_qubits}`);
  ops.forEach((o, i) => {
    const spec = SPECS[o.gate.toLowerCase()];
    const at = `op ${i} ${o.gate}`;
    if (!spec) { out.push(`${at}: not a live gate`); return; }
    const [lo, hi] = spec.qubits;
    if (o.targets.length < lo || o.targets.length > hi) out.push(`${at}: ${o.targets.length} qubits, needs ${lo}..${hi}`);
    if (o.targets.some((q) => !Number.isInteger(q) || q < 0 || q >= n)) out.push(`${at}: qubit out of range 0..${n - 1}`);
    if (new Set(o.targets).size !== o.targets.length) out.push(`${at}: repeated qubit`);
    const params = o.params ?? [];
    if (params.length !== spec.params) out.push(`${at}: ${params.length} params, needs ${spec.params}`);
    if (params.some((p) => !Number.isFinite(p))) out.push(`${at}: non-finite parameter`);
  });
  return out;
}

/** True if the live engine may run the circuit (else the case stays replay-only). */
export function liveSupported(ops: Op[], n: number): boolean {
  return liveViolations(ops, n).length === 0;
}

export interface Repetition { prep: Op[]; block: Op[]; count: number }

const sameOp = (a: Op, b: Op) =>
  a.gate === b.gate && a.targets.join() === b.targets.join() && (a.params ?? []).join() === (b.params ?? []).join();

/** Split `ops` into a prep of `prepLen` ops followed by `count` identical blocks, if that is exactly what they
 *  are (Grover: the Hadamard layer, then one oracle + diffuser block per iteration). */
export function repeatedBlocks(ops: Op[], prepLen: number, count: number): Repetition | null {
  const rest = ops.length - prepLen;
  if (count < 1 || rest <= 0 || rest % count) return null;
  const len = rest / count;
  const block = ops.slice(prepLen, prepLen + len);
  for (let j = 1; j < count; j++) for (let i = 0; i < len; i++) if (!sameOp(ops[prepLen + j * len + i], block[i])) return null;
  return { prep: ops.slice(0, prepLen), block, count };
}

export function withRepetitions(r: Repetition, times: number): Op[] {
  const out = [...r.prep];
  for (let j = 0; j < times; j++) out.push(...r.block);
  return out;
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
