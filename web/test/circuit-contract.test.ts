import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import type { Bundle } from "../src/lib/contract.types.ts";
import { liveViolations, repeatedBlocks, runLive, withRepetitions } from "../src/live/liveTrace.ts";
import { applyOp, type Op, probabilities, zeroState } from "../src/live/statevector.ts";

const op = (gate: string, targets: number[], params: number[] = []): Op => ({ gate, targets, params });
const bundle = (c: string, v: string): Bundle =>
  JSON.parse(readFileSync(new URL(`../../data/artifacts/${c}/${v}.json`, import.meta.url), "utf-8"));

test("a valid circuit has no violations", () => {
  assert.deepEqual(liveViolations([op("h", [0]), op("cx", [0, 1]), op("rz", [1], [0.3]), op("mcx", [0, 1, 2])], 3), []);
});

test("each kind of violation is named", () => {
  const cases: [Op[], number, RegExp][] = [
    [[op("prepare_w", [0, 1, 2])], 3, /not a live gate/],
    [[op("cx", [0])], 2, /1 qubits, needs 2\.\.2/],
    [[op("h", [3])], 3, /out of range/],
    [[op("cz", [1, 1])], 2, /repeated qubit/],
    [[op("rx", [0])], 1, /0 params, needs 1/],
    [[op("rx", [0], [Number.NaN])], 1, /non-finite/],
    [[op("h", [0])], 13, /13 qubits > 12/],
  ];
  for (const [ops, n, re] of cases) {
    const v = liveViolations(ops, n);
    assert.ok(v.some((m) => re.test(m)), `${JSON.stringify(ops)} on ${n}: ${v}`);
  }
});

test("CCX and MCX flip the target only when every control is |1>", () => {
  for (let basis = 0; basis < 16; basis++) {
    const st = zeroState(4);
    st.re[0] = 0; st.re[basis] = 1;
    applyOp(st, op("mcx", [0, 1, 2, 3]));
    const want = (basis & 0b0111) === 0b0111 ? basis ^ 0b1000 : basis;
    assert.equal(probabilities(st)[want], 1, `basis ${basis}`);
  }
  const st = zeroState(3);
  applyOp(st, op("x", [0])); applyOp(st, op("x", [1])); applyOp(st, op("ccx", [0, 1, 2]));
  assert.equal(probabilities(st)[0b111], 1);
});

test("Grover circuits split into the Hadamard layer and identical iteration blocks", () => {
  for (const v of ["grover-2-3", "grover-3-5", "grover-3-2marked", "grover-4-10"]) {
    const t = bundle("grover", v).trace!;
    const k = t.extra.iterations as number;
    const r = repeatedBlocks(t.circuit_ops, t.qubits, k);
    assert.ok(r, v);
    assert.deepEqual(withRepetitions(r, k), t.circuit_ops, v);
  }
  assert.equal(repeatedBlocks([op("h", [0]), op("x", [0]), op("z", [0])], 1, 2), null);
});

test("the live iteration knob follows sin^2((2k+1) theta), over-rotation included", () => {
  for (const v of ["grover-3-5", "grover-3-2marked", "grover-4-10"]) {
    const b = bundle("grover", v), t = b.trace!;
    const marked = t.extra.marked as string[];
    const theta = Math.asin(Math.sqrt(marked.length / 2 ** t.qubits));
    const r = repeatedBlocks(t.circuit_ops, t.qubits, t.extra.iterations as number)!;
    for (let k = 0; k <= 3 * r.count + 3; k++) {
      const p = runLive(withRepetitions(r, k), t.qubits, {}, 16, 1).steps.at(-1)!.probabilities;
      const got = marked.reduce((s, m) => s + p[parseInt(m, 2)], 0);
      assert.ok(Math.abs(got - Math.sin((2 * k + 1) * theta) ** 2) < 1e-9, `${v} k=${k}: ${got}`);
    }
  }
});
