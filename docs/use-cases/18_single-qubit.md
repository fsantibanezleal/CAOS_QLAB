# 18 · Single-qubit gates & the Bloch sphere

**Category:** fundamentals · **Lane:** live · **Solvers:** `gates-qiskit` (state → Bloch vector),
`bit-classical` (the classical bit) · **Variants:** 6 gate sequences.

## The problem

Understand the qubit itself: its state is a point on the **Bloch sphere**, and single-qubit gates are
rotations of that sphere. This is the foundation every later case builds on — and a good place to be honest
about what one qubit *does* and *doesn't* give you over a classical bit.

## Components & variables

- **State:** a pure single-qubit state `|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩` ↔ the Bloch vector
  `r = (sin θ cos φ, sin θ sin φ, cos θ)`, `|r| = 1`.
- **Gates:** `X, Y, Z` (π-rotations about the axes), `H` (pole → equator), `S, T` (Z-rotations adding
  phase), `RX, RY, RZ` (continuous rotations by any angle).

## Formalization

A gate `U` acts on the Bloch vector as the corresponding 3-D rotation. The Bloch components are the Pauli
expectation values `⟨X⟩, ⟨Y⟩, ⟨Z⟩`. For a pure state `|r| = 1` (on the sphere); mixed states sit inside it.

## What each variant shows

`X` (bit-flip to the south pole), `H` (to +X, superposition), `H·Z` (to −X, a phase-flip made visible),
`H·S` (to +Y, the S phase), `RY(π/3)` (a partial tilt), `RX(π/2)` (rotation to −Y). Selecting one steps the
Bloch vector through the gates.

## Solvers & results (from the committed traces, seed 42)

| Variant | gates | Bloch vector | state |
|---|---|---|---|
| sq-x | X | (0, 0, −1) | \|1⟩ |
| sq-h | H | (1, 0, 0) | \|+⟩ |
| sq-hz | H·Z | (−1, 0, 0) | \|−⟩ |
| sq-hs | H·S | (0, 1, 0) | \|+i⟩ |
| sq-ry | RY(π/3) | (0.866, 0, 0.5) | tilted |
| sq-rx | RX(π/2) | (0, −1, 0) | \|−i⟩ |

Every result is a pure state on the unit sphere (`|r| = 1`), exactly where the gate's rotation lands it.

## How to read & use the viz

The Bloch sphere is the whole story: watch the arrow start at the north pole (`|0⟩`) and rotate to its
final position as each gate applies. `H` swings a pole to the equator; `S`/`Z` spin the equator point
around the vertical axis (phase); `RY`/`RX` tilt by a chosen angle.

## Honest verdict

> This is the substrate, not an advantage. A qubit can sit *anywhere* on the Bloch sphere — a continuum of
> states — but a **measurement collapses it to a single classical bit**, and by Holevo's bound one qubit
> stores no more retrievable classical information than one bit. The richness of the sphere (superposition
> and phase) only becomes computational *power* through **interference across many qubits** — which is what
> every later case exploits.

## References

Nielsen & Chuang §1.3 (2010); Holevo (1973). Engine: [../frameworks/01_qiskit.md](../frameworks/01_qiskit.md).
The first step toward the [entanglement](./01_state-prep.md) and algorithm cases.
