# 05 · Simon's algorithm: 01 · The problem and its formalization

## The problem

An oracle hides a function `f:{0,1}ⁿ→{0,1}ⁿ` *promised* 2-to-1 with a hidden period `s`: `f(x)=f(x⊕s)` for
all `x`. Recover `s`. Simon's algorithm needs **O(n)** quantum queries; any classical algorithm needs
**~O(2^{n/2})** (you must hunt for a collision). This was the **first provably exponential** quantum
query-complexity separation, and the direct conceptual ancestor of Shor's period-finding.

## Components & variables

- **Input register:** `n` qubits. **Output register:** `n` qubits holding `f(x)`.
- **Oracle:** copy `x` into the output (`CX(i,n+i)`), then: controlled on input qubit `j` (the
  least-significant set bit of `s`), XOR `s` into the output. This makes `f` exactly 2-to-1 with period `s`.

## Formalization

After `H^{⊗n}` on the input and the oracle, measuring (or tracing out) the output leaves the input register
in an equal superposition over a coset `{x₀, x₀⊕s}`. A final `H^{⊗n}` makes the input register yield a
**random `y` with `y·s ≡ 0 (mod 2)`**. Each run gives one such linear constraint; about `n−1` independent
`y`'s determine `s` uniquely by Gaussian elimination over GF(2):
```
collect y₁,…,y_{n−1} (independent),  solve  { y_k · s = 0 }  ⇒  the unique non-zero s
```

## References

Simon, SIAM J. Comput. 26(5):1474 (1997), doi:10.1137/S0097539796298637; Nielsen & Chuang (2010). Engine:
[../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md). Sibling oracle cases:
[03_bernstein-vazirani.md](../03_bernstein-vazirani.md) · [04_deutsch-jozsa.md](../04_deutsch-jozsa.md).

Back to [05 · Simon's algorithm](../05_simon.md).
