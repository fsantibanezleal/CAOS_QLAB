# 13 · QEC: 02 · Variants and results

## What each variant shows

Distance 3 and 5 at `p ∈ {0.05, 0.1, 0.2}`. The variant-bar pairs `d=3` vs `d=5` at each noise rate so you
can see distance help, or stop helping.

## Solvers & results (from the committed traces, seed 42, 30,000 shots)

The unprotected baseline is one qubit under the same noise for the same number of rounds, so it differs
between d=3 (3 rounds) and d=5 (5 rounds).

| p | d=3 logical | unprotected, 3 rounds | d=5 logical | unprotected, 5 rounds | distance helps? |
|---|---|---|---|---|---|
| 0.05 | 0.0257 | 0.093 | **0.0081** | 0.146 | ✓ (d5 ≪ d3) |
| 0.10 | 0.0909 | 0.175 | **0.0539** | 0.256 | ✓ |
| 0.20 | 0.2562 | 0.303 | 0.2519 | 0.394 | ✗ (≈ equal, near/above threshold) |

At `p = 0.05` and `0.1` the distance-5 code clearly beats distance-3 and both beat the unprotected qubit, 
**below threshold, more qubits = better logical qubit**. At `p = 0.2` the distance-5 improvement vanishes:
the code is near its threshold, where adding distance no longer helps. This crossover is the honest heart
of fault tolerance.

Back to [13 · QEC](../13_qec-repetition.md).
