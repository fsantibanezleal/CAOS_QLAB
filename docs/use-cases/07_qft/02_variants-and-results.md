# 07 · Quantum Fourier Transform: 02 · Variants and results

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

Back to [07 · Quantum Fourier Transform](../07_qft.md).
