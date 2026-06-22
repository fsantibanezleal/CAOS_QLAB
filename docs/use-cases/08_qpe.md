# 08 · Quantum Phase Estimation — read an eigenphase

**Category:** flagship-algorithms · **Lane:** live · **Solvers:** `qpe-qiskit` (controlled-powers + inverse
QFT), `qpe-classical` (eigendecomposition) · **Variants:** 6.

## The problem

Given a unitary `U` and an eigenstate `|ψ⟩` with `U|ψ⟩ = e^{2πiφ}|ψ⟩`, estimate the phase `φ`. QPE is the
QFT's first real application and the engine inside Shor's order-finding and quantum chemistry. Here
`U = P(2πφ)` (a phase gate) with eigenstate `|1⟩`, so `φ` is exactly known — which lets us **verify** the
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

## What each variant shows

Three **exact** cases (`φ = 1/4, 5/8, 3/16`) and three **finite-precision** cases (`φ = 0.3, 0.8, 0.1`)
across `t = 3,4,5`. Selecting one updates the circuit, the per-step trace, the counting-register histogram
(a sharp spike for exact, a dominant peak + neighbors for inexact), and the comparison panel.

## Solvers & results (from the committed traces, seed 42)

| Variant (t) | true φ | φ̂ (QPE) | error | P(top) | lane |
|---|---|---|---|---|---|
| qpe-t3-1_4 | 0.25 | **0.25** | 0.0 | 1.00 | live |
| qpe-t3-5_8 | 0.625 | **0.625** | 0.0 | 1.00 | live |
| qpe-t4-3_16 | 0.1875 | **0.1875** | 0.0 | 1.00 | live |
| qpe-t3-0.3 | 0.3 | 0.25 | 0.050 | 0.58 | live |
| qpe-t4-0.8 | 0.8 | 0.8125 | 0.0125 | 0.88 | live |
| qpe-t5-0.1 | 0.1 | 0.09375 | 0.00625 | 0.88 | live |

The exact cases land perfectly with certainty; the finite-precision cases land on the nearest `m/2ᵗ` bin
with the textbook dominant probability. `qpe-classical` diagonalizes the 2×2 `U` and reads `φ` exactly.

## How to read & use the viz

Step through the trace: each controlled-phase tilts a counting qubit's Bloch vector; the inverse QFT
focuses the phase ramp into one bitstring. The histogram is the estimate. Increase `t` (more counting
qubits) to watch the resolution sharpen — and watch an inexact `φ` spread over neighboring bins.

## Honest verdict

> QPE estimates `φ` to `t` bits (`2^{-t}` resolution). At this toy scale the classical eigendecomposition
> of `U` returns `φ` *exactly and instantly* — QPE only earns its keep when `U` acts on an exponentially
> large space you cannot diagonalize (e.g. `e^{iHt}` for a molecular Hamiltonian, or the modular-exponent
> unitary in Shor). It is a subroutine, and a finite-precision one.

## References

Kitaev, arXiv:quant-ph/9511026; Nielsen & Chuang (2010). Engine:
[../frameworks/01_qiskit.md](../frameworks/01_qiskit.md). Builds on the [QFT](./07_qft.md); feeds toy-Shor.
