# 01 · Qiskit (+ qiskit-aer): 02 · The 2.x API (what QLab teaches: and the 0.x trap)

## The 2.x API (what QLab teaches: and the 0.x trap)

- The **terra merge (1.0)** ended the metapackage era: install `qiskit` + `qiskit-aer` (+ `qiskit-ibm-runtime`)
  explicitly. `qiskit.opflow` and `qiskit.algorithms` were **removed**, old VQE/QAOA tutorials break.
- **BackendV2** (Target-based); **Primitives V2** (`SamplerV2` returns shots/bitstrings; `EstimatorV2` takes
  PUBs `(circuit, observables, params)` + a `precision`). You no longer call `backend.run()` directly on
  hardware.
- For exact simulation QLab uses **`quantum_info.Statevector`** directly (deterministic, no shots needed for
  the state evolution) and `SparsePauliOp` for observables like the MaxCut cost Hamiltonian.

Back to [01 · Qiskit (+ qiskit-aer)](../01_qiskit.md).
