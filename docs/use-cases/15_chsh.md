# 15 · CHSH / Bell inequality — where quantum genuinely beats classical

**Category:** entanglement · **Lane:** live · **Solvers:** `chsh-qiskit` (correlators from real observables),
`chsh-classical` (local-hidden-variable bound) · **Variants:** 6.

## The problem

Two parties share a pair and each measures in one of two settings. The CHSH quantity
`S = E(a₀,b₀) + E(a₀,b₁) + E(a₁,b₀) − E(a₁,b₁)` is bounded by `|S| ≤ 2` for **any** classical
(local-hidden-variable) theory, but quantum mechanics reaches `|S| = 2√2 ≈ 2.83`. This is the rare,
important case where quantum **genuinely** beats classical — and the honest reason it matters (and the
honest reason it is *not* a computational speedup).

## Components & variables

- **State:** a Bell pair `|Φ⁺⟩` (or a separable `|00⟩` for the control).
- **Measurements:** each party measures along an axis in the X–Z plane at angle `θ`: the observable
  `M(θ) = cos θ·Z + sin θ·X`. The correlator `E(a,b) = ⟨M(a) ⊗ M(b)⟩` is computed from the exact state.

## Formalization

For `|Φ⁺⟩`, `E(a,b) = cos(a − b)`. With the optimal angles `a₀=0, a₁=π/2, b₀=π/4, b₁=−π/4`:
```
S = cos(−π/4) + cos(π/4) + cos(π/4) − cos(3π/4) = 4·(√2/2) = 2√2 ≈ 2.828   (the Tsirelson bound)
```
No local-hidden-variable assignment can exceed 2 — so measuring `S > 2` experimentally rules out local
realism. A separable state has `E(a,b) = cos a·cos b`, which can never push `S` past 2.

## What each variant shows

Optimal angles (→ 2√2), sub-optimal and weak angles (smaller violations), aligned bases (`S = 2`, the
boundary), rotated-optimal (still 2√2 — rotation invariance), and a separable state (no violation).

## Solvers & results (from the committed traces, seed 42)

| Variant | S (quantum) | classical bound | exceeds? |
|---|---|---|---|
| optimal | **2.828** | 2 | ✓ (= Tsirelson) |
| sub-optimal | 2.732 | 2 | ✓ |
| weak | 2.511 | 2 | ✓ |
| aligned | 2.000 | 2 | — (at the bound) |
| rotated-optimal | **2.828** | 2 | ✓ |
| **separable** | 1.414 | 2 | ✗ (no entanglement → no violation) |

The Bell state with good angles hits 2√2; the separable state can't even reach 2. The correlators
(`E00,E01,E10,E11`) are in each trace.

## How to read & use the viz

Plot `S` against the two reference lines — the classical bound at 2 and Tsirelson at 2√2. Watch the Bell
variants sit above 2 (up to 2.83), the aligned case touch 2, and the separable state fall well below. The
per-setting correlators show how the four terms combine.

## Honest verdict

> This is one of the **few** places quantum genuinely beats classical: `S = 2√2 > 2` cannot be reproduced
> by any local-hidden-variable theory — Bell-test violations rule out local realism, the basis of the
> **2022 Nobel Prize in Physics**. But be precise about what kind of advantage it is: a **nonlocality**
> result (and a real edge in the CHSH *game*: quantum wins ~85.4% vs classical 75%), **not** a faster
> computation. And it strictly requires entanglement — the separable state shows no violation at all. The
> quantum effects here are real; it is the *computational-speedup* marketing elsewhere that is overhyped.

## References

Clauser, Horne, Shimony & Holt, PRL 23, 880 (1969), doi:10.1103/PhysRevLett.23.880; Nobel Prize in Physics
2022. Engine: [../frameworks/01_qiskit.md](../frameworks/01_qiskit.md). Foundation:
[01_state-prep.md](./01_state-prep.md) (Bell states).
