# 01 · Overview — the static, three-lane design

CAOS_QLAB is a **static** web product: no application server, no request-time database, no backend that
simulates on demand. Every case either runs **live in the visitor's browser** or is **precomputed offline
and replayed**, with an optional **real-hardware** lane that runs locally and commits the result. Keeping
the host static makes the lab free to host, immune to request-time abuse, trivially scalable, and
reproducible by anyone who clones the repo.

## Why static

A quantum lab tempts you to stand up a backend ("let the server run the simulator / submit to hardware").
We deliberately do not:

- **Cost.** GitHub Pages serves the built SPA + the committed traces for free. No VPS, no GPU bill.
- **Abuse surface.** A public endpoint that simulates arbitrary circuits — or worse, submits them to a paid
  QPU — is a denial-of-service *and a financial* target. There is no such endpoint here.
- **Concurrency.** Live runs execute on the visitor's own CPU (a JS simulator in a Web Worker), so "many
  people tuning sliders at once" costs nothing and never queues.
- **Reproducibility.** What ships is the exact engine source + seeded traces. `python -m qlab.pipeline`
  reproduces the committed bytes (see [03_trace-and-gate.md](./03_trace-and-gate.md)).
- **No secrets on the web.** The optional real-hardware lane runs *locally* with a token from the private
  vault; the published site contains no credentials.

## The three lanes (the QLab twist on SimLab's two)

Simulation cost and capability vary enormously, so work is split across three lanes — the choice between
the first two is **measured, not guessed** ([03_trace-and-gate.md](./03_trace-and-gate.md)):

1. **Live (browser, TypeScript).** Small, clean unitary circuits re-simulate in real time as you move a
   slider, via a purpose-built **exact state-vector engine written in TypeScript** (`web/src/live/statevector.ts`,
   ≤ 12 qubits). Zero server compute. **Qiskit cannot run in the browser** — its core (`rustworkx`,
   `symengine`) and `qiskit-aer` (C++) have no Pyodide wheels — so the live lane is hand-written TS, not
   Python-in-WASM and not a third-party JS library.
2. **Precompute (local `.venv`).** The real, heavy engines (Qiskit + Aer, PennyLane, Stim, …) run **offline**
   into a committed seeded trace + manifest, replayed in the app with a step scrubber. Required whenever a
   case needs realistic **noise** (Aer), **mid-circuit measurement + feed-forward** (teleportation, QEC),
   an **optimization loop** (VQE/QAOA training), or **> 12 qubits**.
3. **Real-hardware-replay (optional, opt-in).** A case can be submitted to **IBM Quantum Open**, **AWS
   Braket**, or **Azure Quantum**; the returned counts are committed as a trace with a `ran_on` provenance
   badge. The static site just replays them — the *"this ran on a real 156-qubit quantum computer"* moment.
   See [../guides/03_real-hardware-lane.md](./guides/03_real-hardware-lane.md). *(Gated on an account/tier
   decision; off by default.)*

The **host** plane is the trivial third leg: GitHub Pages serves the built SPA + the committed traces. No
backend. See [05_deploy.md](./05_deploy.md).

## One render path, three producers

All three lanes produce the **same** artifact — a `Trace` (statevector + Bloch + probabilities per step;
see [03_trace-and-gate.md](./03_trace-and-gate.md)). The front end has exactly one set of
replay/animation code; it does not know or care whether a trace was computed live in JS a moment ago,
committed from a Qiskit run months ago, or returned by a real QPU. *"Live" is slider-responsiveness, not a
different model.* This is the deterministic-replay discipline ("the deterministic core is truth; the
presentation layer only renders it") applied to quantum state evolution.

## Read next

- [02_problem-solver-engine.md](./02_problem-solver-engine.md) — the adapter abstraction behind the lanes.
- [03_trace-and-gate.md](./03_trace-and-gate.md) — the artifact contracts + the measured gate.
- [04_lanes.md](./04_lanes.md) — exactly what runs in each lane.
