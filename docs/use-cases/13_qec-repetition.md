# 13 · QEC — repetition (bit-flip) code, and below-threshold scaling

**Category:** noise-and-qec · **Lane:** precompute · **Solvers:** `qec-stim` (Stim + PyMatching),
`qec-baseline` (unprotected qubit, classical model) · **Variants:** 6 (distance × p).

## The problem

Protect a qubit from bit-flips. Unlike *mitigation* (case 12, which only reduces bias), error **correction**
encodes one logical qubit in `d` physical qubits, measures parity stabilizers to detect flips, and decodes
them — and it **scales**: below a noise threshold, a larger code has a *smaller* logical error. This case
runs the real QEC toolchain and shows that scaling (and where it stops).

## Components & variables

- **Code:** the distance-`d` repetition code (`2d−1` qubits: `d` data + `d−1` parity ancillas), `d` rounds.
- **Noise:** depolarizing (`before_round_data_depolarization = p`) + measurement flips — a realistic
  phenomenological model.
- **Decoder:** **PyMatching** minimum-weight perfect matching, built from Stim's detector error model.

## Formalization

The repetition code corrects any single bit-flip (and a majority for larger weight). The **logical error
rate** is the fraction of shots where the decoder's correction disagrees with the true logical observable.
Below threshold it falls with distance; above threshold, adding qubits *increases* it (more places to fail).
The unprotected baseline: a lone qubit under the same noise flips with probability
`p_phys = (1 − (1 − 2·(2p/3))^rounds)/2`.

## What each variant shows

Distance 3 and 5 at `p ∈ {0.05, 0.1, 0.2}`. The variant-bar pairs `d=3` vs `d=5` at each noise rate so you
can see distance help — or stop helping.

## Solvers & results (from the committed traces, seed 42, 50 000 shots)

| p | d=3 logical | d=5 logical | unprotected (1 qubit) | distance helps? |
|---|---|---|---|---|
| 0.05 | 0.0266 | **0.0088** | 0.093 | ✓ (d5 ≪ d3) |
| 0.10 | 0.0908 | **0.0562** | 0.175 | ✓ |
| 0.20 | 0.2526 | 0.2532 | 0.303 | ✗ (≈ equal — near/above threshold) |

At `p = 0.05` and `0.1` the distance-5 code clearly beats distance-3 and both beat the unprotected qubit —
**below threshold, more qubits = better logical qubit**. At `p = 0.2` the distance-5 improvement vanishes:
the code is near its threshold, where adding distance no longer helps. This crossover is the honest heart
of fault tolerance.

## How to read & use the viz

Compare the logical-error bars for `d=3` vs `d=5` across the noise rates: the gap (d5 below d3) is the
below-threshold benefit, and it closes as `p` rises toward threshold. Both stay under the unprotected line
until the noise gets large.

## Honest verdict

> This is error **correction**, not mitigation: it *scales* — below threshold, adding physical qubits
> lowers the logical error (the premise of fault tolerance, and the miniature of Google Willow's 2024
> below-threshold result). But it is **one logical qubit** of a bit-flip-only code; a useful
> fault-tolerant machine needs **hundreds-to-thousands of logical qubits** (each ~1000 physical) running
> billions of gates — three-to-four orders of magnitude beyond this, and beyond any hardware today.

## References

Google Quantum AI, "Quantum error correction below the surface code threshold", arXiv:2408.13687 (2024);
Gidney, Quantum 5, 497 (2021), doi:10.22331/q-2021-07-06-497. Engine:
[../frameworks/04_stim.md](../frameworks/04_stim.md). Contrast with mitigation: [12_noise.md](./12_noise.md).
