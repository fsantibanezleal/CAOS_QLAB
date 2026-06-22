# 09 · Shor (toy: factor 15) — order-finding & the crypto-hype reality

**Category:** flagship-algorithms · **Lane:** precompute · **Solvers:** `shor-qiskit` (QPE order-finding),
`shor-classical` (trial division) · **Variants:** 6 bases.

## The problem

Factor `N`. Shor reduces this to finding the multiplicative **order** `r` of a base `a` (the smallest `r`
with `aʳ ≡ 1 mod N`), which a quantum computer does efficiently via phase estimation; the factors then fall
out of `gcd(a^{r/2}±1, N)`. We run the *real* order-finding for `N = 15`. This is the algorithm behind
"quantum will break RSA" — and the best case to see, honestly, how far that is.

## Formalization

Order-finding = QPE on the **modular-multiplication unitary** `U_a|y⟩ = |a·y mod N⟩`. Its eigenvalues are
`e^{2πi s/r}`, so QPE on `U_a` (with `t` counting qubits over a work register holding `y`, started at
`|1⟩`) yields a phase `≈ s/r`. **Continued fractions** recover `r`; if `r` is even and `a^{r/2} ≢ −1`,
```
factors = gcd(a^{r/2} − 1, N),  gcd(a^{r/2} + 1, N)
```
QLab builds `U_a` as a genuine 16×16 permutation unitary (not a pre-encoded answer) and its controlled
powers `U_a^{2^j}`.

## What each variant shows

The six bases `a ∈ {2,4,7,8,11,13}` of `N=15` — each with order `r = 2` or `4`. Selecting one updates the
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

## How to read & use the viz

The counting-register histogram peaks at the multiples of `2ᵗ/r` — read off `s/r`, run it through continued
fractions, and the order `r` appears. The resource panel beside it is the real lesson (below).

## Honest verdict (the headline)

> The quantum order-finding genuinely works — 8 qubits factor 15 into 3×5. But **factoring 15 is trivial
> classically**, and a cryptographically relevant Shor (RSA-2048) needs on the order of **a million noisy
> physical qubits plus full fault tolerance** (Gidney 2025) — three-to-four orders of magnitude beyond
> today's ~100-qubit machines, and not expected before ~2030 at the earliest. "Quantum breaks encryption
> soon" is not supported by the resource numbers. ("Harvest-now-decrypt-later" is a real *policy* concern,
> not a near-term capability.)

## References

Shor, SIAM J. Comput. 26(5):1484 (1997), doi:10.1137/S0097539795293172; Gidney, arXiv:2505.15917 (2025).
Engine: [../frameworks/01_qiskit.md](../frameworks/01_qiskit.md). Builds on [QFT](./07_qft.md) +
[QPE](./08_qpe.md). Resource context: [../state-of-the-art.md](../state-of-the-art.md) §4.
