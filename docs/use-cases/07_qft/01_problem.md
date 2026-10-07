# 07 · Quantum Fourier Transform: 01 · The problem and its formalization

## The problem

Apply the discrete Fourier transform on a quantum register. The QFT sends a basis state `|k⟩` to a
phase-ramp superposition, and is the engine inside phase estimation and Shor. The honest lesson it teaches:
the QFT is *exponentially cheaper to apply* than a classical FFT, but its output **cannot be read out**, 
so it is a subroutine, not a standalone speedup.

## Formalization

The QFT on `n` qubits (`N = 2ⁿ`):
```
QFT |k⟩ = (1/√N) Σ_{j=0}^{N-1} e^{2πi kj/N} |j⟩
```
Circuit: for each qubit a Hadamard followed by a ladder of controlled-phase rotations
`CP(π/2^{(t−c)})`, then bit-reversal swaps, **O(n²)** gates. The classical FFT computes the same transform
of an amplitude vector in **O(N log N) = O(n·2ⁿ)** operations, but returns all `N` amplitudes *readably*.

## References

Coppersmith, arXiv:quant-ph/0201067; Nielsen & Chuang (2010). Engine:
[../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md). Builds toward phase estimation / Shor.

Back to [07 · Quantum Fourier Transform](../07_qft.md).
