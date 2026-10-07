// The TypeScript mirror of the data contract against every committed record. The expected keys are read from
// src/lib/contract.types.ts itself, so a field added to the records and not to the types (or the reverse)
// fails here instead of passing silently through `as Bundle`.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

const TYPES = readFileSync(new URL("../src/lib/contract.types.ts", import.meta.url), "utf-8");
const ARTIFACTS = new URL("../../data/artifacts/", import.meta.url);

interface Shape { required: Set<string>; optional: Set<string>; open: boolean }

function shape(name: string): Shape {
  const m = TYPES.match(new RegExp(`export interface ${name} \\{([\\s\\S]*?)\\n\\}`));
  assert.ok(m, `interface ${name} not found in contract.types.ts`);
  const required = new Set<string>(), optional = new Set<string>();
  let open = false;
  for (const line of m[1].split("\n")) {
    if (/^\s*\[k: string\]/.test(line)) open = true;
    const f = line.match(/^\s{2}(\w+)(\?)?:/);
    if (f) (f[2] ? optional : required).add(f[1]);
  }
  return { required, optional, open };
}

function conforms(obj: Record<string, unknown>, name: string, where: string): void {
  const s = shape(name);
  for (const k of s.required) assert.ok(k in obj, `${where}: missing ${name}.${k}`);
  if (!s.open) for (const k of Object.keys(obj)) assert.ok(s.required.has(k) || s.optional.has(k), `${where}: ${name} has no field ${k}`);
}

const files = readdirSync(ARTIFACTS).flatMap((c) =>
  readdirSync(new URL(`${c}/`, ARTIFACTS)).filter((f) => f.endsWith(".json")).map((f) => `${c}/${f}`));

test("every committed record matches the TypeScript contract, field for field", () => {
  assert.ok(files.length >= 100);
  for (const f of files) {
    const b = JSON.parse(readFileSync(new URL(f, ARTIFACTS), "utf-8"));
    conforms(b, "Bundle", f);
    conforms(b.instance, "Instance", f);
    b.solvers.forEach((s: Record<string, unknown>, i: number) => conforms(s, "SolverResult", `${f} solvers[${i}]`));
    b.references.forEach((r: Record<string, unknown>, i: number) => conforms(r, "Reference", `${f} references[${i}]`));
    conforms(b.comparison, "Comparison", f);
    if (b.trace) {
      conforms(b.trace, "Trace", f);
      conforms(b.trace.measurements, "Measurements", f);
      conforms(b.trace.provenance, "Provenance", f);
      b.trace.steps.forEach((s: Record<string, unknown>, i: number) => conforms(s, "Step", `${f} step ${i}`));
      b.trace.circuit_ops.forEach((o: Record<string, unknown>, i: number) => conforms(o, "CircuitOp", `${f} op ${i}`));
    }
  }
});

test("the guard itself fails on a field the types do not declare", () => {
  assert.throws(() => conforms({ gate: "h", targets: [0], params: [], surprise: 1 }, "CircuitOp", "synthetic"),
    /CircuitOp has no field surprise/);
});
