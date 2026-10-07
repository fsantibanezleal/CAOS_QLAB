# 13 · QEC: 01 · The problem and its formalization

## The problem

Protect a qubit from bit-flips. Unlike *mitigation* (case 12, which only reduces bias), error **correction**
encodes one logical qubit in `d` physical qubits, measures parity stabilizers to detect flips, and decodes
them, and it **scales**: below a noise threshold, a larger code has a *smaller* logical error. This case
runs the real QEC toolchain and shows that scaling (and where it stops).

## Components & variables

- **Code:** the distance-`d` repetition code (`2d−1` qubits: `d` data + `d−1` parity ancillas), `d` rounds.
- **Noise:** depolarizing (`before_round_data_depolarization = p`) + measurement flips: a realistic
  phenomenological model.
- **Decoder:** **PyMatching** minimum-weight perfect matching, built from Stim's detector error model.

## Formalization

The repetition code corrects any single bit-flip (and a majority for larger weight). The **logical error
rate** is the fraction of shots where the decoder's correction disagrees with the true logical observable.
Below threshold it falls with distance; above threshold, adding qubits *increases* it (more places to fail).
The unprotected baseline: a lone qubit under the same noise flips with probability
`p_phys = (1 − (1 − 2·(2p/3))^rounds)/2`.

## References

Google Quantum AI, "Quantum error correction below the surface code threshold", arXiv:2408.13687 (2024);
Gidney, Quantum 5, 497 (2021), doi:10.22331/q-2021-07-06-497. Engine:
[../../frameworks/04_stim.md](../../frameworks/04_stim.md). Contrast with mitigation: [12_noise.md](../12_noise.md).

Back to [13 · QEC](../13_qec-repetition.md).
