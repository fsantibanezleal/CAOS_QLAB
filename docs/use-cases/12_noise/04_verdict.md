# 12 · Noise & error mitigation (ZNE): 04 · The honest verdict

## Honest verdict

> ZNE recovers much of the lost signal, but it is **mitigation (bias reduction), not error correction**;
> its sampling cost grows **exponentially** with circuit size; and it degrades as noise rises. Crucially,
> at any classically-simulable scale a statevector simulator returns the exact `1.0` for **free**, so
> mitigation only matters on hardware beyond classical reach, and even there it is a NISQ *bridge*, not a
> path to scalable computation. (Error *correction*, the real fix, is the next cases: repetition + surface codes.)

Back to [12 · Noise & error mitigation (ZNE)](../12_noise.md).
