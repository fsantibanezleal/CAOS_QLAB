# 01 · Qiskit (+ qiskit-aer) — the primary circuit SDK

**Qiskit** (IBM, Apache-2.0, pinned `2.4.2`) is the de-facto industry-standard SDK for circuit-model
quantum computing: circuits, operators, primitives, a Rust-accelerated transpiler. Its high-performance
simulator is the separate **qiskit-aer** (pinned `0.17.2`) — statevector / density-matrix / MPS /
stabilizer / tensor-network methods plus realistic **noise models**. In QLab, Qiskit is the default
authoring engine: it builds the entanglement circuits and the QAOA ansatz, and `qiskit.quantum_info`
(`Statevector`, `partial_trace`, `SparsePauliOp`) drives the step-by-step trace.

## Installation

```bash
pip install qiskit==2.4.2 qiskit-aer==0.17.2     # in requirements-precompute.txt; the .venv only
```
Core ships only a reference `BasicSimulator`; the real engine is `qiskit-aer`. The real-hardware lane adds
`qiskit-ibm-runtime` (see [../guides/03_real-hardware-lane.md](../guides/03_real-hardware-lane.md)).
**Qiskit does not run in the browser** (`rustworkx`/`symengine`/`aer` are native) — it lives in the offline
precompute lane only.

## The 2.x API (what QLab teaches — and the 0.x trap)

- The **terra merge (1.0)** ended the metapackage era: install `qiskit` + `qiskit-aer` (+ `qiskit-ibm-runtime`)
  explicitly. `qiskit.opflow` and `qiskit.algorithms` were **removed** — old VQE/QAOA tutorials break.
- **BackendV2** (Target-based); **Primitives V2** (`SamplerV2` returns shots/bitstrings; `EstimatorV2` takes
  PUBs `(circuit, observables, params)` + a `precision`). You no longer call `backend.run()` directly on
  hardware.
- For exact simulation QLab uses **`quantum_info.Statevector`** directly (deterministic, no shots needed for
  the state evolution) and `SparsePauliOp` for observables like the MaxCut cost Hamiltonian.

## How QLab uses it (applying)

`qlab/core/circuit_trace.py` replays a `QuantumCircuit` one instruction at a time on a `Statevector`,
recording — per step — the amplitudes, the per-qubit reduced Bloch vector (`partial_trace` →
`expectation_value(Pauli)`), and the probabilities. The solvers:

- **`state-qiskit`** ([../use-cases/01_state-prep.md](../use-cases/01_state-prep.md)) — builds Bell/GHZ
  circuits (`H`, `CX`, `Z`, `X`), traces them, samples a deterministic histogram.
- **`qaoa-qiskit`** ([../use-cases/02_maxcut.md](../use-cases/02_maxcut.md)) — builds the p=1 QAOA ansatz
  (`H` layer → `rzz(2γ)` per edge → `rx(2β)` mixer), grid-searches `(γ,β)` by **exact** `⟨C⟩` from the
  statevector (deterministic, no removed `qiskit-algorithms` dependency), and emits the optimal-parameter
  trace + the `(γ,β)` energy landscape.

## When to use it / when not

- **Use:** default for teaching, broadest ecosystem, IBM hardware, and **noise simulation** (Aer is the
  reason the noise/mitigation cases are precompute-only). If you teach one framework, this is it.
- **Not:** autodiff/QML ergonomics (→ [PennyLane](./02_pennylane.md)); the fastest small-circuit CPU loops
  (Qulacs can beat Aer); anything in-browser (→ the JS live lane).

## References

Qiskit 2.x docs (`docs.quantum.ibm.com`), the 1.0/2.0 release summaries (`ibm.com/quantum/blog`), and the
migration guide. Used by: [use-cases/01_state-prep.md](../use-cases/01_state-prep.md),
[use-cases/02_maxcut.md](../use-cases/02_maxcut.md). Sibling: [PennyLane](./02_pennylane.md) (the
independent QAOA cross-check).
