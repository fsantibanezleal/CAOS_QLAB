# 08 · Quantum Phase Estimation: 01 · The problem and its formalization

## The problem

Given a unitary `U` and an eigenstate `|ψ⟩` with `U|ψ⟩ = e^{2πiφ}|ψ⟩`, estimate the phase `φ`. QPE is the
QFT's first real application and the engine inside Shor's order-finding and quantum chemistry. Here
`U = P(2πφ)` (a phase gate) with eigenstate `|1⟩`, so `φ` is exactly known, which lets us **verify** the
estimate.

## Formalization

With `t` counting qubits: put them in superposition, apply `controlled-U^{2^j}` (each writes the phase
`e^{2πi φ 2^j}` onto counting qubit `j` by phase kickback), then an **inverse QFT** turns the phase ramp
into a binary number. Measuring the counting register gives `m`, and
```
φ̂ = m / 2ᵗ      (resolution 2^{-t})
```
If `φ = m/2ᵗ` exactly, the estimate is exact with probability 1; otherwise QPE returns the nearest bin with
high probability (and the rest spread over neighbors).

## References

Kitaev, arXiv:quant-ph/9511026; Nielsen & Chuang (2010). Engine:
[../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md). Builds on the [QFT](../07_qft.md); feeds toy-Shor.

Back to [08 · Quantum Phase Estimation](../08_qpe.md).
