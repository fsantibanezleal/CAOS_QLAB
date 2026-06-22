# 05 · Simon's algorithm — hidden period, exponential separation

**Category:** oracle-algorithms · **Lane:** precompute · **Solvers:** `simon-qiskit` (circuit + GF(2)
solve), `simon-classical` (collision search) · **Variants:** 6.

## The problem

An oracle hides a function `f:{0,1}ⁿ→{0,1}ⁿ` *promised* 2-to-1 with a hidden period `s`: `f(x)=f(x⊕s)` for
all `x`. Recover `s`. Simon's algorithm needs **O(n)** quantum queries; any classical algorithm needs
**~O(2^{n/2})** (you must hunt for a collision). This was the **first provably exponential** quantum
query-complexity separation — and the direct conceptual ancestor of Shor's period-finding.

## Components & variables

- **Input register:** `n` qubits. **Output register:** `n` qubits holding `f(x)`.
- **Oracle:** copy `x` into the output (`CX(i,n+i)`), then — controlled on input qubit `j` (the
  least-significant set bit of `s`) — XOR `s` into the output. This makes `f` exactly 2-to-1 with period `s`.

## Formalization

After `H^{⊗n}` on the input and the oracle, measuring (or tracing out) the output leaves the input register
in an equal superposition over a coset `{x₀, x₀⊕s}`. A final `H^{⊗n}` makes the input register yield a
**random `y` with `y·s ≡ 0 (mod 2)`**. Each run gives one such linear constraint; about `n−1` independent
`y`'s determine `s` uniquely by Gaussian elimination over GF(2):
```
collect y₁,…,y_{n−1} (independent),  solve  { y_k · s = 0 }  ⇒  the unique non-zero s
```

## What each variant shows

Periods of `n=2` (`s=11`) and `n=3` (`001, 101, 110, 011, 111`) — i.e. 4–6 qubits. Selecting one updates
the oracle gates, the step trace, the histogram of observed `y`'s (all orthogonal to `s`), and the
comparison panel.

## Solvers & results (from the committed traces, seed 42)

| Variant (n) | period s | quantum verdict | q queries (O(n)) | classical queries (~2^{n/2}) | lane |
|---|---|---|---|---|---|
| simon-2-11 (2) | 11 | 11 ✓ | 2 | 3 | precompute |
| simon-3-001 (3) | 001 | 001 ✓ | 3 | 5 | precompute |
| simon-3-101 (3) | 101 | 101 ✓ | 3 | 5 | precompute |
| simon-3-110 (3) | 110 | 110 ✓ | 3 | 3 | precompute |
| simon-3-011 (3) | 011 | 011 ✓ | 3 | 5 | precompute |
| simon-3-111 (3) | 111 | 111 ✓ | 3 | 5 | precompute |

`simon-qiskit` reads the input-register marginal (every `y` with `y·s=0`), then solves GF(2) for the unique
non-zero `s`. `simon-classical` queries `f` until two inputs collide → `s = x₁⊕x₂`.

## How to read & use the viz

The histogram shows only `y`'s orthogonal to `s` — exactly half the strings. The GF(2) panel turns those
`y`'s into the recovered `s`. The contrast with the classical collision search is the point: the quantum
algorithm never needs to *find* a collision.

## Honest verdict

> Quantum recovers `s` in **O(n)** queries; classical needs **~2^{n/2}** (birthday). This is the first
> *exponential* query-complexity separation — genuinely deep — but it lives in the oracle/query model, and
> at the tiny `n` here the classical collision search still finishes instantly. Simon is the bridge from
> the oracle algorithms to Shor.

## References

Simon, SIAM J. Comput. 26(5):1474 (1997), doi:10.1137/S0097539796298637; Nielsen & Chuang (2010). Engine:
[../frameworks/01_qiskit.md](../frameworks/01_qiskit.md). Sibling oracle cases:
[03_bernstein-vazirani.md](./03_bernstein-vazirani.md) · [04_deutsch-jozsa.md](./04_deutsch-jozsa.md).
