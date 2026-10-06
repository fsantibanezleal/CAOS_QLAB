# 12 · Noise & error mitigation (ZNE): 01 · The problem and its formalization

## The problem

Real devices are noisy: gates and readout corrupt the result, pulling expectation values toward zero. This
case shows what a noisy device returns for a circuit with a *known* ideal value, and how **zero-noise
extrapolation (ZNE)** claws much of it back, together with the honest limits of mitigation.

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
directly because Mitiq is GPL-3.0, see the honesty note.)

## References

Temme, Bravyi & Gambetta, PRL 119, 180509 (2017), doi:10.1103/PhysRevLett.119.180509;
Giurgica-Tiron et al., arXiv:2005.10921 (2020). Engine: [../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md)
(qiskit-aer noise). Honest scale context: [../../state-of-the-art.md](../../state-of-the-art.md) §2 (mitigation ≠ correction).

Back to [12 · Noise & error mitigation (ZNE)](../12_noise.md).
