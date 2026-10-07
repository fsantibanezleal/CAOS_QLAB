# 19 · Superposition, measurement statistics & the quantum RNG: 01 · The problem and its formalization

## The problem

Where does randomness come from? `H|0⟩` is a genuine 50/50 coin, and measuring a Hadamard'd register
produces uniform random bits. This case builds intuition for superposition and measurement statistics, and
asks the honest question: is a quantum random-number generator actually better than a classical PRNG?

## Components & variables

- **State:** `H^{⊗n}|0⟩` = a uniform superposition over all `2ⁿ` strings (each amplitude `2^{-n/2}`); or a
  biased single qubit `RY(θ)|0⟩`.
- **Statistic:** the measurement histogram and its **Shannon entropy** `H = −Σ p log₂ p` (= `n` bits when
  uniform, less when biased).

## Formalization

For the uniform case every outcome has probability `2^{-n}`, so the entropy is exactly `n` bits. For the
biased coin `RY(θ)`: `p₀ = cos²(θ/2)`, `p₁ = sin²(θ/2)`, and `H = −p₀log₂p₀ − p₁log₂p₁ < 1`.

## References

Herrero-Collantes & Garcia-Escartin, Rev. Mod. Phys. 89, 015004 (2017), doi:10.1103/RevModPhys.89.015004;
Nielsen & Chuang (2010). Engine: [../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md). Builds on
[18_single-qubit.md](../18_single-qubit.md) (superposition).

Back to [19 · Superposition, measurement statistics & the quantum RNG](../19_qrng.md).
