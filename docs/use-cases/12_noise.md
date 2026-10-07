# 12 · Noise & error mitigation (ZNE)

**Category:** noise-and-qec · **Lane:** precompute · **Solvers:** `noise-qiskit` (Aer noise + ZNE),
`noise-classical` (noiseless statevector) · **Variants:** 6.

## Read in order

1. [01 · The problem and its formalization](./12_noise/01_problem.md): The problem, Components & variables, Formalization.
2. [02 · Variants and results](./12_noise/02_variants-and-results.md): What each variant shows, Solvers & results (from the committed traces, seed 42).
3. [03 · Reading the visualisations](./12_noise/03_reading-the-viz.md): How to read & use the viz.
4. [04 · The honest verdict](./12_noise/04_verdict.md): Honest verdict.

## References

Temme, Bravyi & Gambetta, PRL 119, 180509 (2017), doi:10.1103/PhysRevLett.119.180509;
Giurgica-Tiron et al., arXiv:2005.10921 (2020). Engine: [../frameworks/01_qiskit.md](../frameworks/01_qiskit.md)
(qiskit-aer noise). Honest scale context: [../state-of-the-art.md](../state-of-the-art.md) §2 (mitigation ≠ correction).
