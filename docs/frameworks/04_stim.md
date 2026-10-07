# 04 · Stim (+ PyMatching): the stabilizer / error-correction engine

**Stim** (Craig Gidney / Google, Apache-2.0, pinned `1.16.0`) is an extremely fast **Clifford / stabilizer**
simulator: by the Gottesman-Knill theorem, Clifford circuits are simulable in ~O(n²) memory, so Stim
samples circuits with **thousands of qubits and millions of shots**, exactly what quantum error correction
needs. QLab pairs it with **PyMatching** (a minimum-weight perfect-matching decoder) to run the real QEC
decoding pipeline. Stim is a genuinely *new simulation paradigm* beside the state-vector engines
(Qiskit/PennyLane/Cirq), added as one more adapter.

## Read in order

1. [01 · Installation](./04_stim/01_installation.md).
2. [02 · How QLab uses it (applying)](./04_stim/02_how-qlab-uses-it.md).
3. [03 · When to use it / when not](./04_stim/03_when-to-use-it-when-not.md).

## References

Gidney, "Stim: a fast stabilizer circuit simulator", Quantum 5, 497 (2021), doi:10.22331/q-2021-07-06-497;
PyMatching 2 (Higgott & Gidney). Used by: [use-cases/13_qec-repetition.md](../use-cases/13_qec-repetition.md).
Sibling engines: [Qiskit](./01_qiskit.md) · [PennyLane](./02_pennylane.md) · [Cirq](./03_cirq.md).
