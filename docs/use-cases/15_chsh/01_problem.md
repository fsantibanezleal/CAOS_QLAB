# 15 · CHSH / Bell inequality: 01 · The problem and its formalization

## The problem

Two parties share a pair and each measures in one of two settings. The CHSH quantity
`S = E(a₀,b₀) + E(a₀,b₁) + E(a₁,b₀) − E(a₁,b₁)` is bounded by `|S| ≤ 2` for **any** classical
(local-hidden-variable) theory, but quantum mechanics reaches `|S| = 2√2 ≈ 2.83`. This is the rare,
important case where quantum **genuinely** beats classical, and the honest reason it matters (and the
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
No local-hidden-variable assignment can exceed 2, so measuring `S > 2` experimentally rules out local
realism. A separable state has `E(a,b) = cos a·cos b`, which can never push `S` past 2.

## References

Clauser, Horne, Shimony & Holt, PRL 23, 880 (1969), doi:10.1103/PhysRevLett.23.880; Nobel Prize in Physics
2022. Engine: [../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md). Foundation:
[01_state-prep.md](../01_state-prep.md) (Bell states).

Back to [15 · CHSH / Bell inequality](../15_chsh.md).
