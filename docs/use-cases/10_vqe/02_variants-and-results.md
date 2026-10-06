# 10 · VQE: 02 · Variants and results

## What each variant shows

Bond lengths `R ∈ {0.5, 0.74, 1.0, 1.5, 2.0, 2.5} Å` (0.74 ≈ equilibrium). Together they trace the H₂
**dissociation curve**. Selecting one shows the energy-vs-θ landscape (VQE finds its minimum) and the
comparison panel.

## Solvers & results (from the committed traces, seed 42)

| R (Å) | VQE energy (Ha) | exact / FCI (Ha) | error (Ha) | chem. accuracy? |
|---|---|---|---|---|
| 0.50 | −1.05503 | −1.05516 | 1.3e-4 | ✓ |
| 0.74 | −1.137279 | −1.137284 | 5.0e-6 | ✓ |
| 1.00 | −1.101147 | −1.10115 | 3.0e-6 | ✓ |
| 1.50 | −0.998148 | −0.998149 | 1.0e-6 | ✓ |
| 2.00 | −0.948569 | −0.948641 | 7.2e-5 | ✓ |
| 2.50 | −0.936017 | −0.936055 | 3.8e-5 | ✓ |

VQE reaches chemical accuracy (< 1.6×10⁻³ Ha) at every point; the equilibrium energy −1.1373 Ha matches the
textbook H₂/STO-3G value.

Back to [10 · VQE](../10_vqe.md).
