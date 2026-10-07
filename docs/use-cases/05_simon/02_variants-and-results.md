# 05 · Simon's algorithm: 02 · Variants and results

## What each variant shows

Periods of `n=2` (`s=11`) and `n=3` (`001, 101, 110, 011, 111`), i.e. 4–6 qubits. Selecting one updates
the oracle gates, the step trace, the histogram of observed `y`'s (all orthogonal to `s`), and the
comparison panel.

## Solvers & results (from the committed traces, seed 42)

| Variant (n) | period s | quantum verdict | q queries (O(n)) | classical queries (~2^{n/2}) | lane |
|---|---|---|---|---|---|
| simon-2-11 (2) | 11 | 11 ✓ | 2 | 3 | precompute |
| simon-3-001 (3) | 001 | 001 ✓ | 3 | 5 | precompute |
| simon-3-101 (3) | 101 | 101 ✓ | 3 | 5 | precompute |
| simon-3-110 (3) | 110 | 110 ✓ | 3 | 3 | precompute |
| simon-3-011 (3) | 011 | 011 ✓ | 3 | 5 | precompute |
| simon-3-111 (3) | 111 | 111 ✓ | 3 | 5 | precompute |

`simon-qiskit` reads the input-register marginal (every `y` with `y·s=0`), then solves GF(2) for the unique
non-zero `s`. `simon-classical` queries `f` until two inputs collide → `s = x₁⊕x₂`.

Back to [05 · Simon's algorithm](../05_simon.md).
