# 13 · QEC: repetition (bit-flip) code, and below-threshold scaling

**Category:** noise-and-qec · **Lane:** precompute · **Solvers:** `qec-stim` (Stim + PyMatching),
`qec-baseline` (unprotected qubit, classical model) · **Variants:** 6 (distance × p).

## Read in order

1. [01 · The problem and its formalization](./13_qec-repetition/01_problem.md): The problem, Components & variables, Formalization.
2. [02 · Variants and results](./13_qec-repetition/02_variants-and-results.md): What each variant shows, Solvers & results (from the committed traces, seed 42, 30,000 shots).
3. [03 · Reading the visualisations](./13_qec-repetition/03_reading-the-viz.md): How to read & use the viz.
4. [04 · The honest verdict](./13_qec-repetition/04_verdict.md): Honest verdict.

## References

Google Quantum AI, "Quantum error correction below the surface code threshold", arXiv:2408.13687 (2024);
Gidney, Quantum 5, 497 (2021), doi:10.22331/q-2021-07-06-497. Engine:
[../frameworks/04_stim.md](../frameworks/04_stim.md). Contrast with mitigation: [12_noise.md](./12_noise.md).
