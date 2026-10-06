# 18 · Single-qubit gates & the Bloch sphere: 01 · The problem and its formalization

## The problem

Understand the qubit itself: its state is a point on the **Bloch sphere**, and single-qubit gates are
rotations of that sphere. This is the foundation every later case builds on, and a good place to be honest
about what one qubit *does* and *doesn't* give you over a classical bit.

## Components & variables

- **State:** a pure single-qubit state `|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩` ↔ the Bloch vector
  `r = (sin θ cos φ, sin θ sin φ, cos θ)`, `|r| = 1`.
- **Gates:** `X, Y, Z` (π-rotations about the axes), `H` (pole → equator), `S, T` (Z-rotations adding
  phase), `RX, RY, RZ` (continuous rotations by any angle).

## Formalization

A gate `U` acts on the Bloch vector as the corresponding 3-D rotation. The Bloch components are the Pauli
expectation values `⟨X⟩, ⟨Y⟩, ⟨Z⟩`. For a pure state `|r| = 1` (on the sphere); mixed states sit inside it.

## References

Nielsen & Chuang §1.3 (2010); Holevo (1973). Engine: [../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md).
The first step toward the [entanglement](../01_state-prep.md) and algorithm cases.

Back to [18 · Single-qubit gates & the Bloch sphere](../18_single-qubit.md).
