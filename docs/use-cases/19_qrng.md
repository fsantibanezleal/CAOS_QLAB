# 19 · Superposition, measurement statistics & the quantum RNG

**Category:** fundamentals · **Lane:** live · **Solvers:** `qrng-qiskit` (quantum sampling),
`qrng-classical` (pseudo-random generator) · **Variants:** 6.

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

## How to read & use the viz

Watch the histogram fill toward flat as shots accumulate (uniform) or lopsided (biased). The entropy read-
out converges to `n` (or less). Side by side, the quantum and classical histograms look the same — which is
exactly the point.

## Honest verdict

> Statistically, the quantum RNG and a good classical PRNG are **indistinguishable** at this scale — same
> flat histograms, same entropy. The difference is in *kind*, not quality: quantum randomness comes from
> measurement collapse, so it is **fundamental and certifiable** (you can prove it wasn't pre-determined),
> whereas a PRNG is fully deterministic given its seed. **Certifiable true randomness** — useful for
> cryptographic keys and public random beacons — is the genuine quantum value here, not better numbers.
> (Note: the committed trace fixes a seed for reproducibility; real-hardware measurement would be
> irreducibly random.)

## References

Herrero-Collantes & Garcia-Escartin, Rev. Mod. Phys. 89, 015004 (2017), doi:10.1103/RevModPhys.89.015004;
Nielsen & Chuang (2010). Engine: [../frameworks/01_qiskit.md](../frameworks/01_qiskit.md). Builds on
[18_single-qubit.md](./18_single-qubit.md) (superposition).
