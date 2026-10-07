# 12 · Noise & error mitigation (ZNE): 02 · Variants and results

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
(only 1.5× at p=0.05, depth 3), the linear extrapolation breaks down when the device is too noisy. This is
the honest behavior of ZNE.

Back to [12 · Noise & error mitigation (ZNE)](../12_noise.md).
