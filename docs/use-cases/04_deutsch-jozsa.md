# 04 · Deutsch–Jozsa — constant vs balanced in one query

**Category:** oracle-algorithms · **Lane:** live · **Solvers:** `dj-qiskit` (circuit), `dj-classical`
(oracle queries) · **Variants:** 6.

## The problem

An oracle hides a function `f:{0,1}ⁿ→{0,1}` *promised* to be either **constant** (same output everywhere)
or **balanced** (0 on exactly half the inputs). Decide which. Deutsch–Jozsa decides with a **single**
quantum query; a deterministic classical algorithm may need `2ⁿ⁻¹+1` queries (just over half the inputs) to
be certain — the historical first exponential quantum–classical query separation.

## Components & variables

- **Input register:** `n` qubits. **Answer qubit (ancilla):** in `|−⟩` for phase kickback.
- **Oracle:** constant-0 = identity; constant-1 = `X` on the ancilla (a global `−1` phase); balanced =
  `f(x)=s·x` (CNOTs from input qubits in `s` to the ancilla) — a balanced function for any `s≠0`.

## Formalization

Start `|0⟩ⁿ|1⟩`, apply `H^{⊗(n+1)}` → `2^{-n/2} Σ_x |x⟩|−⟩`. The oracle stamps the phase
`(−1)^{f(x)}`. A final `H^{⊗n}` on the input register gives amplitude on `|0⟩ⁿ` equal to
`2^{-n} Σ_x (−1)^{f(x)}`:
```
f constant ⇒ |amplitude(0…0)| = 1  ⇒ measure all-zeros with certainty
f balanced ⇒ amplitude(0…0) = 0    ⇒ measure something non-zero with certainty
```
So one query + the interference pattern decides it deterministically.

## What each variant shows

Two constant functions (`f≡0`, `f≡1`), and balanced functions of 3–4 qubits (`s=101`, full parity `s=111`,
`s=1011`). Selecting one updates the oracle gates, the step trace, the histogram (a single peak at `0…0`
for constant, away from it for balanced), and the comparison panel.

## Solvers & results (from the committed traces, seed 42)

| Variant (n) | f | quantum verdict | q queries | classical queries (worst 2ⁿ⁻¹+1) | lane |
|---|---|---|---|---|---|
| dj-const0-3 | constant 0 | constant ✓ | **1** | 5 (5) | live |
| dj-const1-3 | constant 1 | constant ✓ | **1** | 5 (5) | live |
| dj-bal-101 (3) | balanced | balanced ✓ | **1** | 2 (5) | live |
| dj-bal-parity (3) | balanced | balanced ✓ | **1** | 2 (5) | live |
| dj-const0-4 | constant 0 | constant ✓ | **1** | 9 (9) | live |
| dj-bal-1011 (4) | balanced | balanced ✓ | **1** | 2 (9) | live |

`dj-classical` stops early on balanced (two differing outputs decide it), but on **constant** it must query
just over half the inputs — the worst case the quantum algorithm avoids entirely.

## How to read & use the viz

Watch the final Hadamard layer: for constant `f` every branch shares a phase, so they interfere
constructively only at `|0…0⟩`; for balanced `f` the `±` phases cancel at `|0…0⟩`. The histogram makes the
verdict visible at a glance.

## Honest verdict

> Quantum decides in **1** query; deterministic classical needs up to **2ⁿ⁻¹+1**. A real (exponential)
> query-complexity separation in the oracle model — the foundational DJ result — but at these sizes the
> classical decision is still instant. It teaches interference + the promise-problem structure honestly.

## References

Deutsch & Jozsa, Proc. R. Soc. A 439:553 (1992), doi:10.1098/rspa.1992.0167; Nielsen & Chuang (2010).
Engine: [../frameworks/01_qiskit.md](../frameworks/01_qiskit.md). Sibling oracle case:
[03_bernstein-vazirani.md](./03_bernstein-vazirani.md).
