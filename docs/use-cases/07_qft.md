# 07 · Quantum Fourier Transform — the flagship subroutine

**Category:** flagship-algorithms · **Lane:** live · **Solvers:** `qft-qiskit` (circuit, validated against
the analytic DFT), `qft-classical` (FFT) · **Variants:** 6.

## The problem

Apply the discrete Fourier transform on a quantum register. The QFT sends a basis state `|k⟩` to a
phase-ramp superposition, and is the engine inside phase estimation and Shor. The honest lesson it teaches:
the QFT is *exponentially cheaper to apply* than a classical FFT, but its output **cannot be read out** —
so it is a subroutine, not a standalone speedup.

## Formalization

The QFT on `n` qubits (`N = 2ⁿ`):
```
QFT |k⟩ = (1/√N) Σ_{j=0}^{N-1} e^{2πi kj/N} |j⟩
```
Circuit: for each qubit a Hadamard followed by a ladder of controlled-phase rotations
`CP(π/2^{(t−c)})`, then bit-reversal swaps — **O(n²)** gates. The classical FFT computes the same transform
of an amplitude vector in **O(N log N) = O(n·2ⁿ)** operations, but returns all `N` amplitudes *readably*.

## What each variant shows

QFT of computational basis states `|k⟩` for `n = 3` (`k = 0,1,4,5`) and `n = 4` (`k = 1,6`). The output is
always uniform in magnitude (`|amp|² = 1/N`) with a **phase ramp** whose slope encodes `k`. Selecting a
variant updates the circuit, the per-step trace (watch the phase wheels turn), and the comparison panel.

## Solvers & results (from the committed traces, seed 42)

| Variant (n, k) | QFT gates (O(n²)) | fidelity vs analytic DFT | classical FFT ops (O(n·2ⁿ)) | lane |
|---|---|---|---|---|
| qft-3-k0 | 7 | **1.000** | 24 | live |
| qft-3-k1 | 8 | **1.000** | 24 | live |
| qft-3-k4 | 8 | **1.000** | 24 | live |
| qft-3-k5 | 9 | **1.000** | 24 | live |
| qft-4-k1 | 13 | **1.000** | 64 | live |
| qft-4-k6 | 14 | **1.000** | 64 | live |

`qft-qiskit` self-validates: it compares its output statevector to the analytic DFT `u[j]=(1/√N)e^{2πikj/N}`
(both sign conventions) and reports the fidelity (1.000 throughout). `qft-classical` runs `numpy.fft` and
returns the full readable spectrum.

## How to read & use the viz

Step through the trace: each qubit's Bloch vector picks up a controlled phase; the amplitude bars stay
uniform in height but their **phases fan out into a ramp**. The point the comparison panel drives home: you
*built* the full spectrum in 7–14 gates, but a measurement collapses it to one sample — you can't read the
ramp out.

## Honest verdict

> The QFT applies the Fourier transform in **O(n²)** gates vs the classical FFT's **O(n·2ⁿ)** — exponentially
> cheaper to *apply*. But measurement returns one sample, so the transformed amplitudes are unreadable. That
> is precisely why the QFT lives *inside* phase estimation and Shor rather than as a faster spectrum
> calculator — for a readable spectrum, the classical FFT wins. (Validated: fidelity 1.000 vs the analytic DFT.)

## References

Coppersmith, arXiv:quant-ph/0201067; Nielsen & Chuang (2010). Engine:
[../frameworks/01_qiskit.md](../frameworks/01_qiskit.md). Builds toward phase estimation / Shor.
