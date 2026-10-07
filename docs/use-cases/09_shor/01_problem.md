# 09 · Shor (toy: 01 · The problem and its formalization

## The problem

Factor `N`. Shor reduces this to finding the multiplicative **order** `r` of a base `a` (the smallest `r`
with `aʳ ≡ 1 mod N`), which a quantum computer does efficiently via phase estimation; the factors then fall
out of `gcd(a^{r/2}±1, N)`. We run the *real* order-finding for `N = 15`. This is the algorithm behind
"quantum will break RSA", and the best case to see, honestly, how far that is.

## Formalization

Order-finding = QPE on the **modular-multiplication unitary** `U_a|y⟩ = |a·y mod N⟩`. Its eigenvalues are
`e^{2πi s/r}`, so QPE on `U_a` (with `t` counting qubits over a work register holding `y`, started at
`|1⟩`) yields a phase `≈ s/r`. **Continued fractions** recover `r`; if `r` is even and `a^{r/2} ≢ −1`,
```
factors = gcd(a^{r/2} − 1, N),  gcd(a^{r/2} + 1, N)
```
QLab builds `U_a` as a genuine 16×16 permutation unitary (not a pre-encoded answer) and its controlled
powers `U_a^{2^j}`.

## References

Shor, SIAM J. Comput. 26(5):1484 (1997), doi:10.1137/S0097539795293172; Gidney, arXiv:2505.15917 (2025).
Engine: [../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md). Builds on [QFT](../07_qft.md) +
[QPE](../08_qpe.md). Resource context: [../../state-of-the-art.md](../../state-of-the-art.md) §4.

Back to [09 · Shor (toy](../09_shor.md).
