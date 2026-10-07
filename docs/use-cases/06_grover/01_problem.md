# 06 · Grover's search: 01 · The problem and its formalization

## The problem

Find the marked item(s) in an unstructured set of `N = 2ⁿ` items, given only an oracle that recognizes a
marked item. Grover finds one in `~(π/4)√(N/M)` oracle queries (`M` = number marked); a classical scan in
random order needs `(N+1)/(M+1)` on average (derivation below). The famous **quadratic** speedup, the most broadly applicable quantum algorithm, since
"unstructured search" hides inside countless problems.

## Components & variables

- **Register:** `n` qubits (`N = 2ⁿ` items). **Oracle:** a phase flip `|w⟩ → −|w⟩` on each marked `w`.
- **Diffuser:** inversion about the mean, `H^n X^n (MCZ) X^n H^n`: reflects amplitudes about their average.

## Formalization

Start in the uniform superposition `|s⟩ = H^{⊗n}|0⟩`. One **Grover iteration** `G = D·O` (oracle then
diffuser) is a rotation by `2θ` in the 2-D plane spanned by the marked and unmarked states, where
`sin θ = √(M/N)`. After `k` iterations the marked amplitude is `sin((2k+1)θ)`, maximized at
```
k* = round( (π/2 − θ) / (2θ) ) ≈ (π/4)√(N/M)
```
Run **too many** iterations and `sin((2k+1)θ)` turns back down, the over-rotation Grover is famous for.

## References

Grover, STOC '96 (1996), doi:10.1145/237814.237866; Nielsen & Chuang (2010). Engine:
[../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md).

Back to [06 · Grover's search](../06_grover.md).
