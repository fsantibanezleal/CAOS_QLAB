# Problem types — the decision map + the classical-baseline doctrine

A QLab case is a **`Problem` formulation** attacked by one or more **`Solver` adapters**. This page is the
map of the formulation families and, more importantly, the **doctrine that defines the whole lab**: every
quantum method is shown next to the classical baseline that is, today, still more practical.

## The formulation families (categories)

Each case carries a category (the manifest's `category`), which also picks the default visualizations:

| Category | What it is | Example cases | Typical solvers | Classical baseline |
|---|---|---|---|---|
| **fundamentals** | one/few-qubit state + measurement | single-qubit gates, superposition, phase, QRNG | circuit (Qiskit) | direct amplitudes / a coin |
| **entanglement** | non-classical correlation | Bell, GHZ, W, CHSH, teleportation, superdense | circuit (Qiskit/Cirq) | 2ⁿ amplitude vector (trivial at small n) |
| **oracle-algorithms** | query complexity / interference | Deutsch–Jozsa, Bernstein–Vazirani, Simon | circuit | classical queries (O(1)…O(2ⁿ)) |
| **flagship-algorithms** | the "famous" speedups | Grover, QFT, QPE, Shor (toy) | circuit | linear search / FFT / classical factoring |
| **variational** | hybrid optimize-a-circuit | **MaxCut/QAOA**, VQE, QML | QAOA/VQE (Qiskit + PennyLane) | brute force / Goemans–Williamson / exact diagonalization / sklearn |
| **noise-and-qec** | real devices + correction | noise + mitigation, repetition code, surface code | Aer noise, Stim | noiseless reference / classical decoders |
| **compilation** | turning a circuit into gates | transpile depth/gate-count | pytket vs Qiskit transpiler | — (a quality comparison) |

## The classical-baseline doctrine (the spine)

> *"mostrando que todos tienen soluciones más prácticas todavía."*

Every complex case ships **at least one classical solver** (`paradigm="classical"`), and the pipeline emits
a head-to-head **comparison verdict** that the App surfaces. The honesty contract per case:

- show the quantum result **and** its cost (qubits, gates, shots, wall-time);
- show the classical result **and** its cost (often microseconds, often provably optimal);
- state, in one line, which wins and why.

This is not editorializing — it is the literature's own conclusion (see
[state-of-the-art.md](./state-of-the-art.md)) made concrete and reproducible. MaxCut is the canonical
example: exact brute force returns the optimal cut in microseconds on every lab graph; QAOA (Qiskit *and*
PennyLane) matches but never beats it, at far higher cost. As hardware advances, the same panel will show if
and when that verdict ever flips — the architecture is built to keep score honestly.

## Picking a solver for a problem

A solver declares `applicable(problem)` (usually by `problem.id` or `category`). The registry attaches every
applicable solver automatically, so a new problem in an existing category is immediately attacked by the
classical baselines and any circuit solver that handles it — no wiring. See
[architecture/02_problem-solver-engine.md](./architecture/02_problem-solver-engine.md).

## See also

- [use-cases.md](./use-cases.md) — the worked cases + the roadmap.
- [frameworks.md](./frameworks.md) — the engines behind each solver.
