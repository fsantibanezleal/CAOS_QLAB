# 10 · VQE — H₂ ground state (the first learned method)

**Category:** variational · **Lane:** precompute · **Solvers:** `vqe-pennylane` (variational), `vqe-classical`
(exact diagonalization / FCI) · **Variants:** 6 bond lengths.

## The problem

Find the ground-state energy of the hydrogen molecule H₂ as a function of bond length — the dissociation
curve. VQE is the flagship *learned* quantum method: a parametrized circuit is **trained** (its angle
optimized) to minimize the measured energy. QLab runs it on the **real** H₂ Hamiltonian and checks it
against exact diagonalization.

## Components & variables

- **Hamiltonian:** the real electronic Hamiltonian of H₂ in the STO-3G minimal basis, built by PennyLane's
  **differentiable Hartree-Fock** (no external chemistry backend), Jordan-Wigner mapped to **4 qubits**.
- **Ansatz:** the Hartree-Fock reference `|1100⟩` plus a single `DoubleExcitation(θ)` — the one excitation
  that captures H₂'s correlation. One trainable parameter `θ`.

## Formalization

The variational principle guarantees `⟨ψ(θ)|H|ψ(θ)⟩ ≥ E₀` for any `θ`, so minimizing the energy approaches
the true ground state:
```
E_VQE = min_θ ⟨ψ(θ)| H |ψ(θ)⟩,   |ψ(θ)⟩ = DoubleExcitation(θ) · |HF⟩
```
QLab scans `θ ∈ [−π, π]` (100 points, deterministic) and takes the minimum — and compares to the exact
ground energy from diagonalizing the 16×16 Hamiltonian matrix (full configuration interaction in this basis).

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

## How to read & use the viz

The energy-vs-θ landscape is a single smooth well; VQE rolls to its bottom. Across the variant-bar the
minima trace the dissociation curve — bonded around 0.74 Å, flattening as the atoms separate.

## Honest verdict

> VQE recovers the H₂ ground energy to chemical accuracy — a genuine learned/variational method. But H₂ in
> a minimal basis is a **4×4 matrix** a laptop diagonalizes in microseconds, so there is **no advantage**
> here; this is pedagogy. Scaling VQE to molecules classical methods *can't* handle runs into **barren
> plateaus** (vanishing gradients) and deep ansätze — the open problem that keeps near-term quantum
> chemistry from a clean advantage.

## References

Peruzzo et al., Nat. Commun. 5:4213 (2014), doi:10.1038/ncomms5213; McArdle et al., Rev. Mod. Phys. 92,
015003 (2020), doi:10.1103/RevModPhys.92.015003. Engine: [../frameworks/02_pennylane.md](../frameworks/02_pennylane.md).
Sibling variational case: [02_maxcut.md](./02_maxcut.md) (QAOA).
