# 01 · Qiskit (+ qiskit-aer): the primary circuit SDK

**Qiskit** (IBM, Apache-2.0, pinned `2.4.2`) is the de-facto industry-standard SDK for circuit-model
quantum computing: circuits, operators, primitives, a Rust-accelerated transpiler. Its high-performance
simulator is the separate **qiskit-aer** (pinned `0.17.2`), statevector / density-matrix / MPS /
stabilizer / tensor-network methods plus realistic **noise models**. In QLab, Qiskit is the default
authoring engine: it builds the entanglement circuits and the QAOA ansatz, and `qiskit.quantum_info`
(`Statevector`, `partial_trace`, `SparsePauliOp`) drives the step-by-step trace.

## Read in order

1. [01 · Installation](./01_qiskit/01_installation.md).
2. [02 · The 2.x API (what QLab teaches: and the 0.x trap)](./01_qiskit/02_the-2-x-api.md).
3. [03 · How QLab uses it (applying)](./01_qiskit/03_how-qlab-uses-it.md).
4. [04 · When to use it / when not](./01_qiskit/04_when-to-use-it-when-not.md).

## References

Qiskit 2.x docs (`docs.quantum.ibm.com`), the 1.0/2.0 release summaries (`ibm.com/quantum/blog`), and the
migration guide. Used by: [use-cases/01_state-prep.md](../use-cases/01_state-prep.md),
[use-cases/02_maxcut.md](../use-cases/02_maxcut.md). Sibling: [PennyLane](./02_pennylane.md) (the
independent QAOA cross-check).
