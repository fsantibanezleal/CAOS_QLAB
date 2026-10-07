# 19 · Superposition, measurement statistics & the quantum RNG: 02 · Variants and results

## What each variant shows

1–4 qubits (uniform, entropy 1–4 bits) and two biased single-qubit coins `RY(π/3)`, `RY(2π/3)`. Selecting
one shows the histogram filling out and its entropy.

## Solvers & results (from the committed traces, seed 42, 2048 shots)

| Variant | outcomes | Shannon entropy | uniform? |
|---|---|---|---|
| qrng-1 | 2 | **1.000** | ✓ |
| qrng-2 | 4 | **2.000** | ✓ |
| qrng-3 | 8 | **3.000** | ✓ |
| qrng-4 | 16 | **4.000** | ✓ |
| qrng-bias30 (RY π/3) | 2 | 0.811 | ✗ (biased) |
| qrng-bias60 (RY 2π/3) | 2 | 0.811 | ✗ (biased) |

The uniform cases hit exactly `n` bits of entropy; the biased coins give `H(0.75) = 0.811` bits. The
classical PRNG produces statistically identical histograms.

Back to [19 · Superposition, measurement statistics & the quantum RNG](../19_qrng.md).
