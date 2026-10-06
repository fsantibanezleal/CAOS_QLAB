# 02 · The live (JS) lane: 03 · The limit (honest)

## The limit (honest)

A JS state-vector sim is memory-bound at 2ⁿ complex amplitudes. For *responsive* interaction QLab keeps
live circuits to **≤ 12 qubits** (~4096 amplitudes is instant; ~12 q ≈ 64 MB). Anything bigger, or
anything needing noise, mid-circuit feed-forward, or an optimization loop, is **precomputed** and the app
replays its committed trace. When a user pushes a live circuit past the limit, the app fails gracefully and
offers the precomputed trace.

Back to [02 · The live (JS) lane](../02_live-lane.md).
