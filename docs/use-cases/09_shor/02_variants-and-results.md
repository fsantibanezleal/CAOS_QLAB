# 09 · Shor (toy: 02 · Variants and results

## What each variant shows

The six bases `a ∈ {2,4,7,8,11,13}` of `N=15`, each with order `r = 2` or `4`. Selecting one updates the
modular-mult gates, the step trace, the counting-register histogram (peaks at `s/r·2ᵗ`), and the comparison
panel. (Base 14 is excluded: `14 ≡ −1`, so `a^{r/2} = −1` and the method yields only the trivial factor.)

## Solvers & results (from the committed traces, seed 42)

| Variant | base a | order r (QPE) | factors | correct | qubits | lane |
|---|---|---|---|---|---|---|
| shor-15-a2 | 2 | 4 | [3, 5] | ✓ | 8 | precompute |
| shor-15-a4 | 4 | 2 | [3, 5] | ✓ | 8 | precompute |
| shor-15-a7 | 7 | 4 | [3, 5] | ✓ | 8 | precompute |
| shor-15-a8 | 8 | 4 | [3, 5] | ✓ | 8 | precompute |
| shor-15-a11 | 11 | 2 | [3, 5] | ✓ | 8 | precompute |
| shor-15-a13 | 13 | 4 | [3, 5] | ✓ | 8 | precompute |

`shor-qiskit` recovers `r` by continued fractions from the highest-probability phases, then gcd's out the
factors. `shor-classical` factors 15 by trial division in microseconds.

Back to [09 · Shor (toy](../09_shor.md).
