# 02 · MaxCut — QAOA vs classical (the flagship honesty case)

**Category:** variational · **Lane:** precompute · **Solvers:** `qaoa-qiskit`, `qaoa-pennylane`,
`qaoa-cirq`, `maxcut-bruteforce`, `maxcut-greedy` · **Variants:** 6 graphs.

## The problem

Partition a graph's vertices into two sets to **maximize the number of edges crossing** the partition.
MaxCut is NP-hard in general and is the canonical benchmark for **QAOA** (the Quantum Approximate
Optimization Algorithm) — and the canonical honesty lesson, because at lab scale the classical answer is
trivial and optimal.

## Formalization

For a graph `G=(V,E)` and a partition encoded by bits `x ∈ {0,1}^|V|`, the cut value is

```
C(x) = Σ_(u,v)∈E  ½ (1 − Z_u Z_v)        with Z_i = (−1)^x_i
```

QAOA prepares `|ψ(γ,β)⟩ = e^{−iβ_p B} e^{−iγ_p C} ⋯ e^{−iβ_1 B} e^{−iγ_1 C} H^{⊗n}|0⟩`, where `C` is the
cost Hamiltonian above and `B = Σ_i X_i` is the mixer. The classical optimizer tunes `(γ,β)` to maximize
`⟨ψ|C|ψ⟩`; the proposed cut is read off the most-probable bitstring. QLab runs **p=1** with an exact
statevector grid-search over `(γ,β)` (24×24 = 576 evaluations) — deterministic and reproducible.

## What each variant shows

`triangle` (odd cycle, frustration — max cut 2 of 3), `square` (even cycle, fully cuttable — 4),
`square-diag` (added frustration), `bowtie` (two triangles), `pentagon` (odd 5-cycle — max cut 4),
`petersen-ish` (6-node 3-regular prism — denser, harder for low-depth QAOA — max cut 7). Selecting a graph
updates the graph viz (cut highlighted), the `(γ,β)` energy landscape, the bitstring histogram, and the
comparison panel.

## Solvers & results (from the committed traces, seed 42)

| Graph | optimal (brute force) | greedy | QAOA-Qiskit | QAOA-PennyLane | QAOA-Cirq | classical time |
|---|---|---|---|---|---|---|
| triangle | **2** | 2 | 2 (⟨C⟩=1.99) | 2 | 2 (⟨C⟩=1.99) | ~0.01 ms |
| square | **4** | 2 | 4 (⟨C⟩=3.00) | 4 | 4 (⟨C⟩=2.99) | ~0.01 ms |
| square-diag | **4** | 3 | 4 | 4 | 4 | ~0.02 ms |
| bowtie | **4** | 4 | 4 | 4 | 4 | ~0.02 ms |
| pentagon | **4** | 4 | 4 | 4 | 4 | ~0.02 ms |
| petersen-ish | **7** | 7 | 7 | 7 | 7 | ~0.05 ms |

All **three** quantum frameworks (Qiskit, PennyLane, Cirq) reproduce the optimal cut on every graph — a
genuine three-way cross-check (disagreement would be a bug) — using 3–6 qubits and 576 evaluations each
(~150–1300 ms), versus brute force's exact optimum in microseconds.

## How to read & use the viz

The **(γ,β) landscape** shows the optimization surface QAOA climbs — note how shallow/broad the optimum is
at p=1. The **comparison panel** is the point: quantum cost (qubits, evaluations, wall-time) next to the
classical cost (a few microseconds, provably optimal).

## Honest verdict

> Exact classical brute force finds the optimum in microseconds; QAOA (p=1) matches it but **does not win**,
> at far higher cost. This is the expected NISQ result — the literature shows Goemans–Williamson (a 0.878
> classical SDP) and simple local algorithms beat low-depth QAOA on these graph families. QAOA is a
> research/teaching object, not a solver, at this scale.

## References

Farhi, Goldstone & Gutmann, "A Quantum Approximate Optimization Algorithm", arXiv:1411.4028 (2014);
Goemans & Williamson, J. ACM 42(6):1115 (1995), doi:10.1145/227683.227684; Barak & Marwaha, "Classical
algorithms vs low-depth QAOA on high-girth graphs", arXiv:2106.05900 (2021). Engines:
[../frameworks/01_qiskit.md](../frameworks/01_qiskit.md) · [../frameworks/02_pennylane.md](../frameworks/02_pennylane.md).
