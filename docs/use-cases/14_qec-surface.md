# 14 · QEC — surface code & the threshold crossover

**Category:** noise-and-qec · **Lane:** precompute · **Solvers:** `qec-stim` (Stim + PyMatching),
`qec-baseline` (unprotected qubit, classical model) · **Variants:** 6 (distance × p).

## The problem

The rotated **surface code** is the front-runner architecture for a fault-tolerant qubit: data + measure
qubits on a 2-D lattice, X- and Z-stabilizers measured every round, decoded by matching. Unlike the
[repetition code](./13_qec-repetition.md) (bit-flips only), it corrects **both** bit- and phase-flips. This
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

## What each variant shows

Distance 3 vs 5 at `p ∈ {0.005, 0.01, 0.02}` — straddling the threshold. The variant-bar makes the
crossover visible: does the bigger code help or hurt?

## Solvers & results (from the committed traces, seed 42, 30 000 shots)

| p | d=3 logical (26 q) | d=5 logical (64 q) | regime | distance helps? |
|---|---|---|---|---|
| 0.005 | 0.0080 | **0.0057** | below threshold | ✓ (d5 < d3) |
| 0.010 | 0.0277 | 0.0362 | ~ threshold | ✗ (crossing over) |
| 0.020 | 0.0920 | 0.1799 | above threshold | ✗✗ (d5 ≫ d3) |

At `p = 0.005` the distance-5 code beats distance-3 — **adding qubits makes the logical qubit better**. At
`p = 0.02` the distance-5 code is twice as bad — **above threshold, more qubits = more failure modes**. The
`p = 0.01` row sits right at the crossover. This is the textbook threshold behavior, on the real surface code.

## How to read & use the viz

Put the d=3 and d=5 logical-error bars side by side as you step the noise rate up: the bars *cross* between
`p = 0.005` and `0.02`. Below the crossing, scaling up wins; above it, scaling up loses. That crossing point
is the threshold — the number every fault-tolerance roadmap is fighting to get the hardware below.

## Honest verdict

> This is the heart of fault tolerance: **below threshold, error correction scales** (a bigger code = a
> better logical qubit), and that is the regime Google's Willow chip entered in 2024. But everything here is
> **one** logical qubit; a useful fault-tolerant computer needs **hundreds-to-thousands of logical qubits**,
> each costing ~1000 physical qubits at low enough error — three-to-four orders of magnitude beyond any
> machine today, and on vendor roadmaps no earlier than ~2029. Real, exciting, and far away.

## References

Fowler et al., Phys. Rev. A 86, 032324 (2012), doi:10.1103/PhysRevA.86.032324; Google Quantum AI,
arXiv:2408.13687 (2024). Engine: [../frameworks/04_stim.md](../frameworks/04_stim.md). The mitigation
contrast: [12_noise.md](./12_noise.md); the repetition-code intro: [13_qec-repetition.md](./13_qec-repetition.md).
