# 04 · Deutsch–Jozsa: 02 · Variants and results

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
just over half the inputs, the worst case the quantum algorithm avoids entirely.

Back to [04 · Deutsch–Jozsa](../04_deutsch-jozsa.md).
