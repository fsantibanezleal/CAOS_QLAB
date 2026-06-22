# 04 · Stim (+ PyMatching) — the stabilizer / error-correction engine

**Stim** (Craig Gidney / Google, Apache-2.0, pinned `1.16.0`) is an extremely fast **Clifford / stabilizer**
simulator: by the Gottesman-Knill theorem, Clifford circuits are simulable in ~O(n²) memory, so Stim
samples circuits with **thousands of qubits and millions of shots** — exactly what quantum error correction
needs. QLab pairs it with **PyMatching** (a minimum-weight perfect-matching decoder) to run the real QEC
decoding pipeline. Stim is a genuinely *new simulation paradigm* beside the state-vector engines
(Qiskit/PennyLane/Cirq) — added as one more adapter.

## Installation

```bash
pip install stim==1.16.0 pymatching>=2.0     # in requirements-precompute.txt; the .venv only
```
Both ship native wheels (no CUDA, no build step). Not browser-loadable — a precompute-lane engine.

## How QLab uses it (applying)

The `qec-stim` solver ([../use-cases/13_qec-repetition.md](../use-cases/13_qec-repetition.md)):

1. `stim.Circuit.generated("repetition_code:memory", rounds=d, distance=d, …)` builds a noisy
   repetition-code memory experiment (data + ancilla qubits, stabilizer rounds, a logical observable).
2. `circuit.compile_detector_sampler(seed=…)` samples **detection events** + **observable flips** for
   50,000 shots — fast and seeded (reproducible).
3. `pymatching.Matching.from_detector_error_model(circuit.detector_error_model(decompose_errors=True))`
   builds the MWPM decoder from Stim's own error model; `decode_batch` predicts the logical correction.
4. The **logical error rate** = fraction of shots where the prediction disagrees with the true observable.

This is the standard Stim→DEM→PyMatching toolchain that scales straight up to surface codes.

## When to use it / when not

- **Use:** Clifford circuits, stabilizer codes, QEC threshold studies — the *only* practical way to reach
  thousands of qubits, and the right tool to teach error correction honestly.
- **Not:** any non-Clifford gate (T, Toffoli, arbitrary rotation) — those need a state-vector or
  tensor-network engine. Stim is not a general circuit simulator.

## References

Gidney, "Stim: a fast stabilizer circuit simulator", Quantum 5, 497 (2021), doi:10.22331/q-2021-07-06-497;
PyMatching 2 (Higgott & Gidney). Used by: [use-cases/13_qec-repetition.md](../use-cases/13_qec-repetition.md).
Sibling engines: [Qiskit](./01_qiskit.md) · [PennyLane](./02_pennylane.md) · [Cirq](./03_cirq.md).
