# 02 · MaxCut: 01 · The problem and its formalization

## The problem

Partition a graph's vertices into two sets to **maximize the number of edges crossing** the partition.
MaxCut is NP-hard in general and is the canonical benchmark for **QAOA** (the Quantum Approximate
Optimization Algorithm), and the canonical honesty lesson, because at lab scale the classical answer is
trivial and optimal.

## Formalization

For a graph `G=(V,E)` and a partition encoded by bits `x ∈ {0,1}^|V|`, the cut value is

```
C(x) = Σ_(u,v)∈E  ½ (1 − Z_u Z_v)        with Z_i = (−1)^x_i
```

QAOA prepares `|ψ(γ,β)⟩ = e^{−iβ_p B} e^{−iγ_p C} ⋯ e^{−iβ_1 B} e^{−iγ_1 C} H^{⊗n}|0⟩`, where `C` is the
cost Hamiltonian above and `B = Σ_i X_i` is the mixer. The classical optimizer tunes `(γ,β)` to maximize
`⟨ψ|C|ψ⟩`; the proposed cut is read off the most-probable bitstring. QLab runs **p=1** with an exact
statevector grid-search over `(γ,β)` (24×24 = 576 evaluations), deterministic and reproducible.

## References

Farhi, Goldstone & Gutmann, "A Quantum Approximate Optimization Algorithm", arXiv:1411.4028 (2014);
Goemans & Williamson, J. ACM 42(6):1115 (1995), doi:10.1145/227683.227684; Barak & Marwaha, "Classical
algorithms vs low-depth QAOA on high-girth graphs", arXiv:2106.05900 (2021). Engines:
[../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md) · [../../frameworks/02_pennylane.md](../../frameworks/02_pennylane.md).

Back to [02 · MaxCut](../02_maxcut.md).
