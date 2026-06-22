# 12 · Noise & error mitigation (ZNE)

**Category:** noise-and-qec · **Lane:** precompute · **Solvers:** `noise-qiskit` (Aer noise + ZNE),
`noise-classical` (noiseless statevector) · **Variants:** 6.

## The problem

Real devices are noisy: gates and readout corrupt the result, pulling expectation values toward zero. This
case shows what a noisy device returns for a circuit with a *known* ideal value, and how **zero-noise
extrapolation (ZNE)** claws much of it back — together with the honest limits of mitigation.

## Components & variables

- **Circuit:** a Bell pair (ideal `⟨Z₀Z₁⟩ = 1`), optionally padded with identity `CX·CX` pairs to add
  depth (more noise) without changing the ideal state.
- **Noise model (Aer):** two-qubit depolarizing error `p` on `cx`, one-qubit `p/10` on single-qubit gates;
  exact **density-matrix** simulation (no shot noise → deterministic).
- **ZNE:** amplify noise by global gate folding `U → U(U†U)ᵏ` (noise scale `λ = 1,3,5`), measure `⟨Z₀Z₁⟩`
  at each, then **linearly extrapolate to `λ = 0`**.

## Formalization

For a circuit `U`, folding to `U(U†U)ᵏ` leaves the ideal output unchanged but multiplies the effective
noise by `λ = 2k+1`. Measuring `E(λ)` at `λ ∈ {1,3,5}` and fitting `E(λ) ≈ E₀ + cλ`, the intercept `E₀` is
the zero-noise estimate. (Mitiq is the standard library for this; QLab implements the core technique
directly because Mitiq is GPL-3.0 — see the honesty note.)

## What each variant shows

Depolarizing `p ∈ {0.01, 0.02, 0.03, 0.05}` at depth 1 and 3. Selecting one shows the ideal/noisy/mitigated
`⟨Z₀Z₁⟩`, the ZNE fit (`E` vs `λ`), and ideal-vs-noisy histograms.

## Solvers & results (from the committed traces, seed 42)

| Variant (p, depth) | ideal | noisy | ZNE-mitigated | error cut |
|---|---|---|---|---|
| p=0.01, d1 | 1.0 | 0.970 | **0.997** | ~11× |
| p=0.02, d1 | 1.0 | 0.941 | 0.990 | ~5.8× |
| p=0.05, d1 | 1.0 | 0.857 | 0.946 | ~2.6× |
| p=0.01, d3 | 1.0 | 0.932 | 0.987 | ~5.0× |
| p=0.03, d3 | 1.0 | 0.808 | 0.908 | ~2.1× |
| p=0.05, d3 | 1.0 | 0.698 | 0.801 | ~1.5× |

Mitigation works brilliantly at low noise (11× error reduction) and **progressively less as noise grows**
(only 1.5× at p=0.05, depth 3) — the linear extrapolation breaks down when the device is too noisy. This is
the honest behavior of ZNE.

## How to read & use the viz

The ZNE plot shows `⟨Z₀Z₁⟩` falling as the noise scale `λ` increases; the extrapolated intercept at `λ=0`
is the mitigated estimate. The histograms show how depolarizing noise spreads probability off the ideal
`{00, 11}` peaks.

## Honest verdict

> ZNE recovers much of the lost signal — but it is **mitigation (bias reduction), not error correction**;
> its sampling cost grows **exponentially** with circuit size; and it degrades as noise rises. Crucially,
> at any classically-simulable scale a statevector simulator returns the exact `1.0` for **free** — so
> mitigation only matters on hardware beyond classical reach, and even there it is a NISQ *bridge*, not a
> path to scalable computation. (Error *correction* — the real fix — is the next cases: repetition + surface codes.)

## References

Temme, Bravyi & Gambetta, PRL 119, 180509 (2017), doi:10.1103/PhysRevLett.119.180509;
Giurgica-Tiron et al., arXiv:2005.10921 (2020). Engine: [../frameworks/01_qiskit.md](../frameworks/01_qiskit.md)
(qiskit-aer noise). Honest scale context: [../state-of-the-art.md](../state-of-the-art.md) §2 (mitigation ≠ correction).
