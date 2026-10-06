# 10 · VQE: 01 · The problem and its formalization

## The problem

Find the ground-state energy of the hydrogen molecule H₂ as a function of bond length, the dissociation
curve. VQE is the flagship *learned* quantum method: a parametrized circuit is **trained** (its angle
optimized) to minimize the measured energy. QLab runs it on the **real** H₂ Hamiltonian and checks it
against exact diagonalization.

## Components & variables

- **Hamiltonian:** the real electronic Hamiltonian of H₂ in the STO-3G minimal basis, built by PennyLane's
  **differentiable Hartree-Fock** (no external chemistry backend), Jordan-Wigner mapped to **4 qubits**.
- **Ansatz:** the Hartree-Fock reference `|1100⟩` plus a single `DoubleExcitation(θ)`: the one excitation
  that captures H₂'s correlation. One trainable parameter `θ`.

## Formalization

The variational principle guarantees `⟨ψ(θ)|H|ψ(θ)⟩ ≥ E₀` for any `θ`, so minimizing the energy approaches
the true ground state:
```
E_VQE = min_θ ⟨ψ(θ)| H |ψ(θ)⟩,   |ψ(θ)⟩ = DoubleExcitation(θ) · |HF⟩
```
QLab scans `θ ∈ [−π, π]` (100 points, deterministic) and takes the minimum, and compares to the exact
ground energy from diagonalizing the 16×16 Hamiltonian matrix (full configuration interaction in this basis).

## References

Peruzzo et al., Nat. Commun. 5:4213 (2014), doi:10.1038/ncomms5213; McArdle et al., Rev. Mod. Phys. 92,
015003 (2020), doi:10.1103/RevModPhys.92.015003. Engine: [../../frameworks/02_pennylane.md](../../frameworks/02_pennylane.md).
Sibling variational case: [02_maxcut.md](../02_maxcut.md) (QAOA).

Back to [10 · VQE](../10_vqe.md).
