# 18 · Single-qubit gates & the Bloch sphere: 02 · Variants and results

## What each variant shows

`X` (bit-flip to the south pole), `H` (to +X, superposition), `H·Z` (to −X, a phase-flip made visible),
`H·S` (to +Y, the S phase), `RY(π/3)` (a partial tilt), `RX(π/2)` (rotation to −Y). Selecting one steps the
Bloch vector through the gates.

## Solvers & results (from the committed traces, seed 42)

| Variant | gates | Bloch vector | state |
|---|---|---|---|
| sq-x | X | (0, 0, −1) | \|1⟩ |
| sq-h | H | (1, 0, 0) | \|+⟩ |
| sq-hz | H·Z | (−1, 0, 0) | \|−⟩ |
| sq-hs | H·S | (0, 1, 0) | \|+i⟩ |
| sq-ry | RY(π/3) | (0.866, 0, 0.5) | tilted |
| sq-rx | RX(π/2) | (0, −1, 0) | \|−i⟩ |

Every result is a pure state on the unit sphere (`|r| = 1`), exactly where the gate's rotation lands it.

Back to [18 · Single-qubit gates & the Bloch sphere](../18_single-qubit.md).
