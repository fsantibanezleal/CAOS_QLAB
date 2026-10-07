# 06 · Grover's search: amplitude amplification

**Category:** flagship-algorithms · **Lane:** live · **Solvers:** `grover-qiskit` (oracle + diffuser),
`grover-classical` (linear scan) · **Variants:** 6.

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

## What each variant shows

Single-marked at `n = 2, 3, 4` (`|11⟩`, `|101⟩`, `|010⟩`, `|1010⟩`, `|0000⟩`) and a two-marked `n = 3` case.
Selecting one updates the oracle, the per-iteration amplitude bars (watch the marked bar grow), the
histogram, and the comparison panel.

## Solvers & results (from the committed traces, seed 42)

| Variant (N, M) | marked | iterations k | P(marked) | found | classical queries, expected (N+1)/(M+1) | one seeded scan | worst case | lane |
|---|---|---|---|---|---|---|---|---|
| grover-2-3 (4,1) | 11 | 1 | **1.000** | 11 ✓ | 2.5 | 1 | 4 | live |
| grover-3-5 (8,1) | 101 | 2 | 0.945 | 101 ✓ | 4.5 | 7 | 8 | live |
| grover-3-2 (8,1) | 010 | 2 | 0.945 | 010 ✓ | 4.5 | 3 | 8 | live |
| grover-3-2marked (8,2) | 011, 101 | 1 | **1.000** | 011 ✓ | 3.0 | 1 | 7 | live |
| grover-4-10 (16,1) | 1010 | 3 | 0.961 | 1010 ✓ | 8.5 | 4 | 16 | live |
| grover-4-0 (16,1) | 0000 | 3 | 0.961 | 0000 ✓ | 8.5 | 7 | 16 | live |

The success probabilities are exactly the textbook Grover values (`N=4,M=1` is *exact* in one iteration;
`N=8` → 0.945; `N=16` → 0.961). Item labels are the basis index in binary, highest qubit leftmost, the same
order as the histogram keys: item 10 is `1010`, items 3 and 5 are `011` and `101`.

**The classical comparator is an expectation, not one draw.** `grover-classical` scans the N items in a
uniformly random order. The M marked positions then form a uniform M-subset of `{1, …, N}`, and the first
hit T satisfies `P(T ≥ t) = C(N−t+1, M) / C(N, M)`. Summing, `E[T] = Σ_{t=1..N} C(N−t+1, M) / C(N, M) =
C(N+1, M+1) / C(N, M) = (N+1)/(M+1)` by the upper-summation identity (Graham, Knuth and Patashnik,
*Concrete Mathematics*, 2nd ed., 1994, ch. 5). The table reports that expectation as the classical cost; the
seeded scan is kept beside it as an illustration, and the worst case is `N − M + 1`.

## How to read & use the viz

Step through the trace: after each iteration the **marked-state amplitude bar grows** while the others
shrink. The diffuser is the "inversion about the mean", watch the bars reflect about their average. Push
the iteration count past `k*` (in the live lane) to *see the amplitude fall back* (over-rotation).

## Honest verdict

> Quantum: `~(π/4)√(N/M)` queries; classical: `(N+1)/(M+1)` on average. A **quadratic** speedup, the most broadly useful quantum
> result, but it is *asymptotic*, and at the tiny `N` a browser can simulate, the classical scan is still
> instant and cheaper in wall-time. Grover teaches amplitude amplification; the advantage shows only at
> scales far beyond what NISQ hardware can run noiselessly.

## References

Grover, STOC '96 (1996), doi:10.1145/237814.237866; Nielsen & Chuang (2010). Engine:
[../frameworks/01_qiskit.md](../frameworks/01_qiskit.md).
