# 02 · The live (JS) lane

The live lane lets a visitor tune a small circuit and watch the state respond in real time — the
interaction that makes quantum click.

## How it works

For a case that clears the [gate](../architecture/03_trace-and-gate.md) (`live`), the web app runs a
**TypeScript state-vector simulator** (`web/src/live/statevector.ts`) directly from the committed
`circuit_ops`. Moving a slider (a rotation angle) re-simulates the circuit and redraws the Bloch sphere /
amplitude bars / histogram instantly. The output is a `Trace` of the same shape the offline pipeline
produces, so the renderers are identical — *"live" is slider-responsiveness, not a different model.*

The engine is **exact**, not an approximation: amplitudes evolve under the true gate matrices (the standard
1-qubit set H/X/Y/Z/S/T/RX/RY/RZ/P plus the 2-qubit CX/CZ/SWAP/CP/RZZ), the per-qubit Bloch vector is the
exact reduced density matrix, and the only stochastic step is shot sampling through a seeded PRNG. It is
verified by construction: with the sliders at the committed angles, the live result reproduces the
committed (Qiskit) trace **bit-for-bit** — same amplitudes, same relative phases, same Bloch vectors. A
case is only offered live if every one of its ops is in the supported set; otherwise it stays replay-only.

> **Design note.** An earlier plan named the `quantum-circuit` (MIT) JS library. We use a small purpose-built
> engine instead — same reasoning as the hand-rolled SVG Bloch sphere (vs three.js): full control of the
> output shape (it emits the exact `Trace` contract, so the renderers are reused verbatim), exact physics, a
> lighter bundle, and deterministic output that screenshot-verification can trust.

## Why JavaScript, not Pyodide

Qiskit and PennyLane **cannot run in the browser**: Qiskit's core (`rustworkx`, `symengine`) and
`qiskit-aer` (C++) have no Pyodide wheels, and PennyLane's Lightning is C++ too. A pure-NumPy sim under
Pyodide would bloat the download (~6–10 MB) for no benefit over a purpose-built JS engine. So the live lane
is a few hundred lines of TypeScript; the real Python engines stay in the offline precompute lane.

## The limit (honest)

A JS state-vector sim is memory-bound at 2ⁿ complex amplitudes. For *responsive* interaction QLab keeps
live circuits to **≤ 12 qubits** (~4096 amplitudes is instant; ~12 q ≈ 64 MB). Anything bigger — or
anything needing noise, mid-circuit feed-forward, or an optimization loop — is **precomputed** and the app
replays its committed trace. When a user pushes a live circuit past the limit, the app fails gracefully and
offers the precomputed trace.

## Sandbox

Alongside the guided cases, the app embeds/links **Quirk** (Apache-2.0) as a free drag-drop circuit
sandbox for open-ended play (Bloch, amplitude and density-matrix displays, bookmarkable circuit URLs).

*(Implementation lands with the web SPA — see [../../web/README.md](../../web/README.md).)*
