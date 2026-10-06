# 14 · QEC: 01 · The problem and its formalization

## The problem

The rotated **surface code** is the front-runner architecture for a fault-tolerant qubit: data + measure
qubits on a 2-D lattice, X- and Z-stabilizers measured every round, decoded by matching. Unlike the
[repetition code](../13_qec-repetition.md) (bit-flips only), it corrects **both** bit- and phase-flips. This
case runs the real toolchain and shows the single most important fact about QEC: the **threshold**.

## Components & variables

- **Code:** distance-`d` rotated surface code (`d=3` ≈ 26 qubits, `d=5` ≈ 64 qubits), `d` rounds.
- **Noise:** circuit-level depolarizing (`after_clifford_depolarization = p`) + measurement flips.
- **Decoder:** **PyMatching** minimum-weight perfect matching from Stim's detector error model.

## Formalization

A code family has a **threshold** `p_th`: a physical error rate below which increasing the code distance
`d` *reduces* the logical error (exponentially in `d`), and above which it *increases* it. Schematically
`p_L ∝ (p / p_th)^{⌊(d+1)/2⌋}` below threshold. The surface code's threshold under realistic circuit noise
is around **~0.5–1%**.

## References

Fowler et al., Phys. Rev. A 86, 032324 (2012), doi:10.1103/PhysRevA.86.032324; Google Quantum AI,
arXiv:2408.13687 (2024). Engine: [../../frameworks/04_stim.md](../../frameworks/04_stim.md). The mitigation
contrast: [12_noise.md](../12_noise.md); the repetition-code intro: [13_qec-repetition.md](../13_qec-repetition.md).

Back to [14 · QEC](../14_qec-surface.md).
