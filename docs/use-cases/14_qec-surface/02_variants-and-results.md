# 14 · QEC: 02 · Variants and results

## What each variant shows

Distance 3 vs 5 at `p ∈ {0.005, 0.01, 0.02}`, straddling the threshold. The variant-bar makes the
crossover visible: does the bigger code help or hurt?

## Solvers & results (from the committed traces, seed 42, 30 000 shots)

| p | d=3 logical (26 q) | d=5 logical (64 q) | regime | distance helps? |
|---|---|---|---|---|
| 0.005 | 0.0080 | **0.0057** | below threshold | ✓ (d5 < d3) |
| 0.010 | 0.0277 | 0.0362 | ~ threshold | ✗ (crossing over) |
| 0.020 | 0.0920 | 0.1799 | above threshold | ✗✗ (d5 ≫ d3) |

At `p = 0.005` the distance-5 code beats distance-3, **adding qubits makes the logical qubit better**. At
`p = 0.02` the distance-5 code is twice as bad, **above threshold, more qubits = more failure modes**. The
`p = 0.01` row sits right at the crossover. This is the textbook threshold behavior, on the real surface code.

Back to [14 · QEC](../14_qec-surface.md).
