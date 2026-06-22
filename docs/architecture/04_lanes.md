# 04 · The three lanes — what runs where

| | **Live** | **Precompute** | **Real-hardware** *(opt-in)* |
|---|---|---|---|
| Runs on | visitor's browser CPU | your local `.venv` | a real QPU (IBM/Braket/Azure) |
| Engine | `quantum-circuit` (JS state-vector) | Qiskit + Aer, PennyLane, Stim, … | IBM Open / Braket / Azure |
| When | small clean unitary circuits, ≤12 q | noise, optimization, feed-forward, >12 q | the "ran on real hardware" moment |
| Output | a fresh trace, instantly | a committed trace + manifest | a committed trace with `ran_on` provenance |
| Cost | $0 | $0 (local) | free (IBM Open) → real money (see costs) |

## Live (browser, JavaScript)

The "aha" of quantum is *interaction*: drag `RY` and watch the Bloch vector tip; slide a Grover iteration
and watch the marked amplitude grow. Small, clean unitary circuits re-simulate in real time in a Web Worker
via `quantum-circuit` (MIT, ≤ ~12 qubits responsive). **Qiskit is not used here** — no Pyodide wheels for
`rustworkx`/`symengine`/`qiskit-aer`. The live engine and the committed traces share the same trace shape,
so the renderer is identical. Cases that try to push the live sim too far fail gracefully and offer the
precomputed trace.

## Precompute (local `.venv`)

The real, heavy engines run offline and commit a seeded trace + manifest. This is where the lab's physics
actually lives. Required for: realistic **noise** models (Aer), **mid-circuit measurement + classical
feed-forward** (teleportation, QEC), **optimization loops** (VQE/QAOA/QML training), **> 12 qubits**, and
anything that takes more than ~1.5 s. The pipeline (`python -m qlab.pipeline <case>`) runs every applicable
solver, including the classical baselines, and writes the comparison verdict. See
[../guides/01_precompute-pipeline.md](../guides/01_precompute-pipeline.md).

## Real-hardware (optional, opt-in, local-only)

A case can be submitted to a real QPU; the returned counts are committed as a trace with a `ran_on` badge
("IBM Heron r2 · ibm_kingston · 2026-…"). This runs **locally**, with a token from the private vault — the
published static site ships no secrets and makes no live hardware calls. The cheapest honest path is **IBM
Quantum Open** (free, 10 min QPU / 28-day window on a 156-qubit Heron r2). See
[../guides/03_real-hardware-lane.md](../guides/03_real-hardware-lane.md) and
[../state-of-the-art.md](../state-of-the-art.md) §5 for the cost reality.

## Read next

- [05_deploy.md](./05_deploy.md) — how the static site is built and served.
