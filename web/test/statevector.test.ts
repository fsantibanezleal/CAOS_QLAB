import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import type { Bundle } from "../src/lib/contract.types.ts";
import { liveSupported, runLive } from "../src/live/liveTrace.ts";
import { applyOp, type Op, probabilities, sampleCounts, zeroState } from "../src/live/statevector.ts";

const ARTIFACTS = new URL("../../data/artifacts/", import.meta.url);

function run(n: number, ops: Op[]) {
  const st = zeroState(n);
  for (const op of ops) assert.ok(applyOp(st, op), `unsupported ${op.gate}`);
  return st;
}
const op = (gate: string, targets: number[], params: number[] = []): Op => ({ gate, targets, params });
const close = (a: number, b: number, tol = 1e-12) => Math.abs(a - b) < tol;

test("Bell state: H then CX leaves 1/2 on |00> and |11>", () => {
  const p = probabilities(run(2, [op("h", [0]), op("cx", [0, 1])]));
  assert.ok(close(p[0], 0.5) && close(p[3], 0.5) && close(p[1], 0) && close(p[2], 0));
});

test("GHZ state on three qubits: 1/2 on |000> and |111>", () => {
  const p = probabilities(run(3, [op("h", [0]), op("cx", [0, 1]), op("cx", [1, 2])]));
  assert.ok(close(p[0], 0.5) && close(p[7], 0.5));
  assert.ok(close(p.reduce((s, x) => s + x, 0), 1));
});

test("interference fringe: H, P(phi), H gives P(0) = cos^2(phi/2)", () => {
  for (const phi of [0, Math.PI / 4, Math.PI / 2, (2 * Math.PI) / 3, Math.PI]) {
    const p = probabilities(run(1, [op("h", [0]), op("p", [0], [phi]), op("h", [0])]));
    assert.ok(close(p[0], Math.cos(phi / 2) ** 2), `phi=${phi}: ${p[0]}`);
  }
});

test("count keys are big-endian: basis index 1 on two qubits is '01'", () => {
  assert.deepEqual(sampleCounts(run(2, [op("x", [0])]), 10, 1), { "01": 10 });
  assert.deepEqual(sampleCounts(run(2, [op("h", [0])]), 500, 3), sampleCounts(run(2, [op("h", [0])]), 500, 3));
});

const bundles: Bundle[] = readdirSync(ARTIFACTS).flatMap((c) =>
  readdirSync(new URL(`${c}/`, ARTIFACTS)).filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(new URL(`${c}/${f}`, ARTIFACTS), "utf-8")) as Bundle));

test("Grover on N=4: one iteration finds the item with probability sin^2(3 pi/6) = 1", () => {
  const b = bundles.find((x) => x.instance.id === "grover-2-3")!;
  const t = b.trace!;
  assert.ok(liveSupported(t.circuit_ops));
  const final = runLive(t.circuit_ops, t.qubits, {}, 2048, b.seed).steps.at(-1)!;
  assert.ok(close(final.probabilities[3], 1, 1e-9));
});

test("the live engine reproduces every committed Qiskit trace it supports, step by step", () => {
  let checked = 0;
  for (const b of bundles) {
    const t = b.trace;
    if (!t || !liveSupported(t.circuit_ops)) continue;
    const live = runLive(t.circuit_ops, t.qubits, {}, t.measurements.shots, b.seed);
    assert.equal(live.steps.length, t.steps.length, `${b.case_id}/${b.instance.id}`);
    live.steps.forEach((s, i) => {
      const want = t.steps[i];
      const where = `${b.case_id}/${b.instance.id} step ${i}`;
      s.statevector.forEach((a, k) => {
        assert.ok(close(a.re, want.statevector[k].re, 1e-6) && close(a.im, want.statevector[k].im, 1e-6), `${where} amp ${k}`);
      });
      s.bloch.forEach((v, q) => v.forEach((x, j) => assert.ok(close(x, want.bloch[q][j], 1e-5), `${where} bloch q${q}`)));
    });
    checked++;
  }
  assert.ok(checked >= 70, `only ${checked} traces checked`);
});
