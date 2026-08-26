# CAOS_QLAB — Quantum Laboratory

[![CI](https://img.shields.io/github/actions/workflow/status/fsantibanezleal/CAOS_QLAB/ci.yml?branch=main&label=CI)](https://github.com/fsantibanezleal/CAOS_QLAB/actions)
[![License](https://img.shields.io/github/license/fsantibanezleal/CAOS_QLAB)](LICENSE)
[![Version](https://img.shields.io/github/v/tag/fsantibanezleal/CAOS_QLAB?label=version&sort=semver)](https://github.com/fsantibanezleal/CAOS_QLAB/tags)
[![Live demo](https://img.shields.io/badge/demo-live-2ea44f)](https://qlab.fasl-work.com)
[![DOI](https://img.shields.io/badge/DOI-10.5281%2Fzenodo.21512647-blue)](https://doi.org/10.5281/zenodo.21512647)

Technical report (CC-BY-4.0): *"Classical Still Wins the Wall-Clock: An Honest Quantum-vs-Classical Benchmark of
Twenty Canonical Problems on Five Real Frameworks"*, concept DOI
[10.5281/zenodo.21512647](https://doi.org/10.5281/zenodo.21512647) (source in
[`manuscripts/quantum-vs-classical/`](manuscripts/quantum-vs-classical/)). From the 119 committed traces:
classical wins wall-time on all 20 problems, while genuine quantum phenomena (CHSH nonlocality, Grover's query
advantage) are real but not yet a practical speedup.

**A public, didactic laboratory for quantum computing.** Learn it the honest way: *formulate a problem →
attack it with the real, dedicated frameworks (Qiskit · PennyLane · Cirq · Stim · …) → put every quantum
method next to the classical baseline → read which one actually wins.* Today, on almost every case at lab
scale, **classical still wins** — and QLab shows you exactly why, with the numbers on screen.

**▶ Live app:** **https://qlab.fasl-work.com** · 📖 [Docs / wiki](docs/README.md) · 📝 [Changelog](CHANGELOG.md)

> **Status:** v0.34.000 — **engine + 20-case catalog + the full web SPA are live.** The Problem × Solver
> engine runs **20 cases** across **5 real frameworks** (Qiskit + Aer · PennyLane · Cirq · Stim ·
> classical/NumPy + scikit-learn) with **119 committed, reproducible traces**; every quantum method is shown
> next to its classical baseline. The React SPA ships the six standard pages (App · Introduction ·
> Methodology · Implementation · Experiments · Benchmark), the full visualization suite, and a live
> in-browser re-simulation lane. Built in the open — see the [changelog](CHANGELOG.md).

## Why this exists

Quantum computing is the most over-marketed corner of computing. Most tutorials either stop at a toy
circuit or imply an "advantage" that does not exist yet. QLab does two honest things at once:

1. **Teaches the real, state-of-the-art tools by running them** — not hand-rolled toy simulators. Each
   method is a thin **adapter over a real framework** (Qiskit 2.x + Aer, PennyLane, Cirq, Stim,
   NumPy/scikit-learn for the classical baselines), pinned and reproducible. Adding a framework is one more
   adapter (pytket, Qulacs, OpenFermion are candidates on the roadmap, not yet wired).
2. **Keeps itself honest** — every quantum method is shown next to the **classical baseline that is still,
   today, more practical**, with both costs (qubits, gates, shots, wall-time) side by side. The conclusion
   of the field's own literature — *"does a quantum computer beat a classical one at anything you'd pay
   for? Not yet."* — is built into the architecture, not glossed over. As hardware advances, new solvers
   and real-hardware backends slot into the same abstraction.

## The engine: Problem × Solver (adapters)

QLab is not a folder of one-off scripts. It is a small engine with a clean, extensible abstraction:

- A **`Problem`** is a *formulation* (MaxCut, ground-state energy, search, …) — its variants and the
  observable, independent of method.
- A **`Solver`** is a *thin adapter over one real framework* that attacks a problem and returns a uniform
  result (the answer + its cost + an optional replay trace). Solvers come in three paradigms:
  **quantum-sim** (Qiskit-Aer, PennyLane, …), **quantum-hardware** (a real QPU run, committed), and
  **classical** (the honest baseline).
- Adding a framework is **one new adapter + one registry line** — zero changes to the core, the pipeline,
  or the web. *"No volver a recablear ni replicar todo."*

A *complex case is attacked by many solvers at once* and compared head-to-head (MaxCut: QAOA-Qiskit vs
QAOA-PennyLane vs brute force vs greedy).

## Three lanes (the static, no-backend design)

| Lane | Where it runs | What it's for |
|---|---|---|
| **Live** | your browser (a purpose-built **TypeScript** exact state-vector engine, ≤12 qubits) | tune a small circuit, watch amplitudes/Bloch move in real time |
| **Precompute** | offline `.venv` (the real engines) → committed JSON trace, replayed | noise, optimization loops (VQE/QAOA), mid-circuit feed-forward, >12 qubits |
| **Real-hardware** *(optional, opt-in)* | IBM Quantum Open / Braket / Azure → committed result | the *"this ran on a real 156-qubit quantum computer"* moment |

The published site is **fully static** (GitHub Pages): no backend, no secrets. A run is a pure function of
`(params, seed)` — the committed trace is the source of truth and the front end only animates it
(*replay = truth*). Qiskit cannot run in the browser (no Pyodide wheels), so the live lane is a small
**exact state-vector simulator written in TypeScript** (`web/src/live/statevector.ts`) and everything heavy
is precomputed — see [docs/architecture.md](docs/architecture.md).

## Quickstart (local)

Python **3.12**. Parallel PowerShell + bash scripts:

```powershell
# Windows / PowerShell
.\scripts\setup.ps1                          # create .venv + install (qiskit, aer, pennylane, stim, …)
.\.venv\Scripts\python.exe -m pytest         # core tests + pipeline smoke
.\scripts\precompute.ps1 maxcut --all        # run every MaxCut graph across all solvers → traces + manifests
.\scripts\precompute.ps1 --list              # list the cases
```

```bash
# macOS / Linux / Git-Bash
./scripts/setup.sh
.venv/bin/python -m pytest
./scripts/precompute.sh state-prep --all
```

`precompute` prints, per case/variant: the lane verdict (live vs precompute), each solver's result + cost,
and the **classical-vs-quantum verdict**. Artifacts land in `data/artifacts/<case>/<variant>.json` and
`manifests/<case>__<variant>.json`.

## Cases today — 20, across all six families

**20 worked cases / 119 committed variant traces**, each solved by a quantum solver **and** a classical
baseline shown head-to-head:

- **Fundamentals** — single-qubit gates & the Bloch sphere · superposition & quantum RNG · phase & interference
- **Entanglement** — Bell/GHZ/W state preparation · CHSH · teleportation · superdense coding
- **Oracle algorithms** — Deutsch–Jozsa · Bernstein–Vazirani · Simon
- **Flagship algorithms** — Grover · QFT · quantum phase estimation · Shor (toy, N=15)
- **Variational** — MaxCut (QAOA) · VQE (H₂) · quantum-kernel ML
- **Noise & QEC** — noise + ZNE mitigation · repetition code · surface code

Honest headline: **0 of 20 show a practical, pay-for-it speedup today** — the quantum-vs-classical
comparison is on screen for each. Full catalog + per-case docs: [docs/use-cases.md](docs/use-cases.md).

## How it's organized

```
qlab/
  core/          rng · trace schema · live/precompute gate · manifest · circuit→trace tracer
  problems/      formulations (state_prep, maxcut, …) — solver-agnostic
  solvers/       adapters over real frameworks (qiskit · pennylane · classical · …) + the base ABC
  registry.py    the catalog + the plug-in seam (self-registering problems & solvers)
  pipeline.py    CLI: run a case → trace bundle + comparison + manifest
data/artifacts/  committed compact JSON traces (the source of truth the web replays)
manifests/       per-case manifests (lane verdict + measured numbers + viz bindings + provenance)
docs/            the SimLab-style wiki (architecture · frameworks · problem-types · use-cases · guides)
web/             the React SPA — six pages, full viz suite, live in-browser lane (deployed to Pages)
```

## Honesty

Numbers are computed by the real engines, never typed in. Synthetic/illustrative content is labeled. Every
case states what it is and is **not**, and shows the classical baseline. No "quantum advantage" is claimed
that the literature does not support — see [docs/state-of-the-art.md](docs/state-of-the-art.md) for the
sourced, dated assessment of what quantum hardware can and cannot do in 2025–2026.

## License & attribution

Code: [MIT](LICENSE). Dependencies keep their own licenses — see [LICENSES.md](LICENSES.md) and
[ATTRIBUTION.md](ATTRIBUTION.md). Note **Mitiq is GPL-3.0** (relevant only when the error-mitigation case
lands). A CAOS research investigation by Felipe Santibáñez-Leal.
