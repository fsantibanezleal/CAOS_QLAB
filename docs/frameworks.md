# Frameworks — the real quantum-computing software landscape

QLab teaches the **real, dedicated tools** by running them as solver adapters. This is the honest map of
the 2026 ecosystem: what each is, its license, its maturity, when to use it — and **which famous names are
dead or frozen** (teach them as history, never as a live dependency). Versions verified 2026-06-21.

> **The student trap (read first):** pre-2024 **Qiskit 0.x** tutorials do **not** run on today's 1.x/2.x
> (`opflow`/`algorithms` removed, Primitives V2, BackendV2, terra merge). QLab pins Qiskit 2.4.2 and teaches
> the modern API. Budget time for this when following old material.

## What QLab standardizes on (the core stack)

These are documented with an install/usage/apply node as they enter the engine (per ADR-0056, docs grow
with the code). **Bold** = already wired as a solver adapter.

1. **[Qiskit 2.x + qiskit-aer](./frameworks/01_qiskit.md)** — Apache-2.0 — the industry standard; broadest
   ecosystem + realistic noise simulation. *(state-prep + QAOA adapters live.)*
2. **[PennyLane + Lightning](./frameworks/02_pennylane.md)** — Apache-2.0 — the QML / autodiff / variational
   pillar; clean CPU→GPU→TN device swap. *(QAOA adapter live; VQE/QML next.)*
3. **[Cirq (+ qsim)](./frameworks/03_cirq.md)** — Apache-2.0 — explicit topology / moment-level control;
   fast Google statevector. *(QAOA adapter live — the third MaxCut cross-check.)*
4. **Stim** — Apache-2.0 — the stabilizer/QEC pillar; the only way to reach thousands of qubits; the right
   tool to teach error correction honestly. *(planned — the QEC cases.)*
5. **pytket** — Apache-2.0 (now fully open) — the cross-compiler/router; teaches real compilation quality
   (cuts depth/gate-count vs naive transpile). *(planned — the compilation case.)*
6. **Qulacs** — MIT — fastest low-overhead CPU statevector; the "why is this so fast" lesson. *(planned.)*
7. **NVIDIA cuQuantum (+ CUDA-Q)** — proprietary (free) / Apache-2.0 — the GPU scaling story; the shared
   engine behind Aer-GPU, lightning.gpu, qsim-GPU. *(reference / optional GPU lane.)*
8. **Mitiq** — **GPL-3.0** ⚠ — error *mitigation* (ZNE/PEC/readout), distinct from Stim's correction.
   *(planned — the noise case; mind the copyleft license for redistribution.)*

**Plus two for breadth:** **quimb** (Apache-2.0, tensor networks — the third simulation paradigm) and
**OpenFermion** (Apache-2.0, fermionic Hamiltonians — the VQE chemistry on-ramp).

## Realistic-hardware SDKs (the optional real-hardware lane)

- **qiskit-ibm-runtime** (Apache-2.0) — IBM Quantum Open (free real hardware). The primary path.
- **amazon-braket-sdk** (Apache-2.0) — multi-vendor; offline `LocalSimulator` is free; a rare offline
  neutral-atom path (`braket_ahs`).
- **azure-quantum** (proprietary SDK) — IonQ / Quantinuum / Rigetti / PASQAL; $500 one-time credit.

See [guides/03_real-hardware-lane.md](./guides/03_real-hardware-lane.md) and
[state-of-the-art.md](./state-of-the-art.md) §5 for costs.

## Interop / IR (how it all connects)

**OpenQASM 2** = the portable text exchange baseline (universal, lossy for advanced features); **OpenQASM
3** = the modern quantum-classical language (dynamic control flow, timing) with real-but-uneven support.
**pytket** = the optimizing object-level cross-compiler+router. **QIR** = the LLVM target for whole
programs. Mental model: *QASM = portable text · pytket = optimizing cross-compiler · Qiskit transpiler =
in-ecosystem router · QIR = LLVM whole-program target.* Not every gate survives every conversion — validate
round-trips.

## Explicitly history — do NOT depend on these

| Tool | Status | Teach as |
|---|---|---|
| **ProjectQ** | abandoned (last release 2022) | early compiler-pass ideas |
| **Strawberry Fields** | archived read-only (Jan 2026) | continuous-variable / photonic concepts |
| **Intel Quantum SDK / Intel-QS** | Intel ceased development | MPI-distributed statevector pedagogy → use QuEST instead |
| **Classic .NET Q#** | retired (~2023) | superseded by the modern `qdk` Python package |
| **Qiskit Optimization** | abandoned by IBM ("as-is") | QUBO/Ising concepts → migrate off it |
| **Classiq** | cloud-only | cannot anchor a local lab (no offline execution) |

## The scaling decision tree (what to reach for)

- Clifford-only / huge-n / QEC → **Stim** (thousands of qubits).
- Universal ≤ ~30 q → CPU statevector (**Qulacs** / `lightning.qubit` / **Aer**).
- Universal ~30–36 q → GPU statevector via **cuQuantum** (`lightning.gpu` / Aer-GPU / qsim-GPU).
- Low-entanglement / structured, 100s–1000s q → tensor networks (**quimb** / cuTensorNet).
- Need a cluster → **QuEST** or **CUDA-Q**.

(Full reasoning + memory law in [state-of-the-art.md](./state-of-the-art.md) §3.)

## Per-tool nodes

Each tool QLab consumes gets a node (`install / usage / applying`) as it lands:
[Qiskit](./frameworks/01_qiskit.md) · [PennyLane](./frameworks/02_pennylane.md) · Cirq · Stim · pytket ·
Qulacs · Mitiq · quimb · OpenFermion *(stubs filled as each adapter ships)*.
