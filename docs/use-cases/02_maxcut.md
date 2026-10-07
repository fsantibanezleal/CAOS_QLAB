# 02 · MaxCut: QAOA vs classical (the flagship honesty case)

**Category:** variational · **Lane:** precompute · **Solvers:** `qaoa-qiskit`, `qaoa-pennylane`,
`qaoa-cirq`, `maxcut-bruteforce`, `maxcut-greedy` · **Variants:** 6 graphs.

## Read in order

1. [01 · The problem and its formalization](./02_maxcut/01_problem.md): The problem, Formalization.
2. [02 · Variants and results](./02_maxcut/02_variants-and-results.md): What each variant shows, Solvers & results (from the committed traces, seed 42).
3. [03 · Reading the visualisations](./02_maxcut/03_reading-the-viz.md): How to read & use the viz.
4. [04 · The honest verdict](./02_maxcut/04_verdict.md): Honest verdict.

## References

Farhi, Goldstone & Gutmann, "A Quantum Approximate Optimization Algorithm", arXiv:1411.4028 (2014);
Goemans & Williamson, J. ACM 42(6):1115 (1995), doi:10.1145/227683.227684; Barak & Marwaha, "Classical
algorithms vs low-depth QAOA on high-girth graphs", arXiv:2106.05900 (2021). Engines:
[../frameworks/01_qiskit.md](../frameworks/01_qiskit.md) · [../frameworks/02_pennylane.md](../frameworks/02_pennylane.md).
