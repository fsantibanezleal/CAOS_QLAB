# 08 · Quantum Phase Estimation: 02 · Variants and results

## What each variant shows

Three **exact** cases (`φ = 1/4, 5/8, 3/16`) and three **finite-precision** cases (`φ = 0.3, 0.8, 0.1`)
across `t = 3,4,5`. Selecting one updates the circuit, the per-step trace, the counting-register histogram
(a sharp spike for exact, a dominant peak + neighbors for inexact), and the comparison panel.

## Solvers & results (from the committed traces, seed 42)

| Variant (t) | true φ | φ̂ (QPE) | error | P(top) | lane |
|---|---|---|---|---|---|
| qpe-t3-1_4 | 0.25 | **0.25** | 0.0 | 1.00 | live |
| qpe-t3-5_8 | 0.625 | **0.625** | 0.0 | 1.00 | live |
| qpe-t4-3_16 | 0.1875 | **0.1875** | 0.0 | 1.00 | live |
| qpe-t3-0.3 | 0.3 | 0.25 | 0.050 | 0.58 | live |
| qpe-t4-0.8 | 0.8 | 0.8125 | 0.0125 | 0.88 | live |
| qpe-t5-0.1 | 0.1 | 0.09375 | 0.00625 | 0.88 | live |

The exact cases land perfectly with certainty; the finite-precision cases land on the nearest `m/2ᵗ` bin
with the textbook dominant probability. `qpe-classical` diagonalizes the 2×2 `U` and reads `φ` exactly.

Back to [08 · Quantum Phase Estimation](../08_qpe.md).
