import assert from "node:assert/strict";
import { test } from "node:test";

import {
  chshS, classicalHitProbability, markedShare, shannonBits, subsampleCounts,
} from "../src/lib/metrics.ts";

test("P(marked) is the share on the declared marked set", () => {
  assert.equal(markedShare({ "101": 950, "000": 50 }, ["101"]), 0.95);
});

test("P(marked) sums every marked item: a perfect two-marked run reads 1, not 0.5", () => {
  assert.equal(markedShare({ "011": 1035, "101": 1013 }, ["011", "101"]), 1);
});

test("P(marked) exposes a run that amplified the wrong item", () => {
  assert.ok(markedShare({ "010": 1990, "101": 10, "111": 48 }, ["101"]) < 0.01);
});

test("a classical scan with Grover's query budget: q*M/N for q <= N-M", () => {
  assert.equal(classicalHitProbability(8, 1, 2), 0.25);
  assert.equal(classicalHitProbability(8, 2, 1), 0.25);
  assert.ok(Math.abs(classicalHitProbability(16, 1, 3) - 3 / 16) < 1e-12);
  assert.equal(classicalHitProbability(8, 1, 8), 1);
});

test("subsample: exact budget, seeded, and nested across budgets", () => {
  const counts = { "000": 300, "011": 700, "101": 1048 };
  const a = subsampleCounts(counts, 64, 7);
  assert.equal(Object.values(a).reduce((s, x) => s + x, 0), 64);
  assert.deepEqual(subsampleCounts(counts, 64, 7), a);
  const small = subsampleCounts(counts, 32, 7);
  for (const [k, v] of Object.entries(small)) assert.ok(v <= (a[k] ?? 0), `${k}: ${v} > ${a[k]}`);
  assert.deepEqual(subsampleCounts(counts, 1e9, 7), counts);
});

test("subsample is not biased by key order (the first keys do not fill the budget)", () => {
  const counts = { "000": 1024, "111": 1024 };
  let first = 0;
  const seeds = 200;
  for (let s = 0; s < seeds; s++) first += subsampleCounts(counts, 64, s)["000"] ?? 0;
  const mean = first / seeds;
  // hypergeometric mean 32, sd ~ 3.97 per draw, so the mean of 200 draws has sd ~ 0.28
  assert.ok(Math.abs(mean - 32) < 1.5, `mean ${mean}`);
});

test("CHSH S from a perfectly correlated optimal run is 2*sqrt(2)", () => {
  assert.ok(Math.abs(chshS({ "00": 1000, "11": 1000 }) - 2 * Math.SQRT2) < 1e-12);
  assert.equal(chshS({ "00": 500, "01": 500, "10": 500, "11": 500 }), 0);
});

test("Shannon entropy of a uniform 3-qubit distribution is 3 bits", () => {
  const u: Record<string, number> = {};
  for (let i = 0; i < 8; i++) u[i.toString(2).padStart(3, "0")] = 256;
  assert.ok(Math.abs(shannonBits(u) - 3) < 1e-12);
  assert.equal(shannonBits({ "0": 10 }), 0);
});
