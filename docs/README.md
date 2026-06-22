# CAOS_QLAB — documentation

This wiki is a **guide for experimenting with quantum computing honestly**: for each problem it shows the
*real, dedicated frameworks* that attack it, how the engine runs them, and — always — the **classical
baseline that is, today, still more practical**. Two planes underlie everything: a lightweight **live**
lane in the browser and a no-restriction **local precompute** lane that runs the heavy real engines and
commits a seeded trace the static site replays. The contract underneath: a run is a pure function of
`(params, seed)`, the committed **trace** is the source of truth, and the front end only animates it —
*replay = truth*.

## How to read this wiki

- **Numbered for reading order.** Section nodes are prefixed `01_`, `02_`, … in the order they are meant to
  be read. Read a section top to bottom for the full picture, or jump to the node you need.
- **Every node is a folder *and* a sibling index file.** A node `X` is documented by `X.md` (the entry
  point) and a folder `X/` holding its in-order pages. Index files end with cross-links to siblings.
- **All links are relative.**

## The sections

- [**State of the art**](./state-of-the-art.md) — the honest, sourced, dated assessment (2025–2026): what
  the hardware can and cannot do, what runs on simulators, the cloud services + real costs, and the
  hype-vs-reality table. **Read this first** — it is the reason the lab is built the way it is.
- [**Architecture**](./architecture.md) — the Problem × Solver engine, the trace contract, the measured
  live/precompute gate, the three lanes (live JS · precompute · real-hardware), and the static deploy.
- [**Frameworks**](./frameworks.md) — the real quantum-computing software landscape: what each SDK /
  simulator is, its license, maturity, when to use it (and which famous names are dead), with the
  install/usage/apply node for each tool QLab actually consumes.
- [**Problem types**](./problem-types.md) — the decision map: which kind of formulation a question needs,
  and the classical-baseline doctrine (why every quantum method is shown next to a classical one).
- [**Use cases**](./use-cases.md) — the worked cases, each solved end to end across multiple solvers, with
  the catalog of what ships today and the roadmap.
- [**Guides**](./guides.md) — the runtime how-tos: the precompute pipeline, the live (JS) lane, and the
  optional real-hardware lane (IBM Open / Braket / Azure).

## Case → solvers map (today)

| Case | Problem type | Solvers (real frameworks) | Lane |
|---|---|---|---|
| [State preparation](./use-cases/01_state-prep.md) | entanglement | gate circuit (Qiskit) · direct amplitudes (classical) | live |
| [MaxCut](./use-cases/02_maxcut.md) | variational optimization | QAOA (Qiskit) · QAOA (PennyLane) · brute force + greedy (classical) | precompute |

The roadmap (oracle algorithms, Grover, QFT/QPE, Shor-toy, VQE, QML, noise + mitigation, QEC) is in
[use-cases.md](./use-cases.md); the frameworks behind each are in [frameworks.md](./frameworks.md).

## What this app IS and is NOT

- **IS:** a didactic lab that runs the real frameworks on small problems, animates the quantum state, and
  honestly compares quantum methods to classical baselines. A teaching + workforce tool.
- **IS NOT:** a claim that quantum computers beat classical ones today (they do not, at these scales — see
  [state-of-the-art](./state-of-the-art.md)); a production quantum-advantage engine; a service that runs
  arbitrary circuits on hardware for you.

## Honesty

Numbers are computed by the engines, never typed in. Synthetic/illustrative content is labeled. Deprecated
or dead tools (ProjectQ, Strawberry Fields, Intel-QS, classic .NET Q#, Qiskit Optimization) are taught as
history, never used as live dependencies. Data policy + the two contracts: [../data/README.md](../data/README.md).
Licenses: [../LICENSES.md](../LICENSES.md) · [../ATTRIBUTION.md](../ATTRIBUTION.md).
