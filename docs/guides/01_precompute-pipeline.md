# 01 · The precompute pipeline

The offline lane: run the real engines locally, produce committed JSON traces + manifests the static site
replays.

## Setup

```powershell
.\scripts\setup.ps1          # Windows — creates .venv (Python 3.12), installs core+dev+precompute
```
```bash
./scripts/setup.sh           # macOS / Linux / Git-Bash
```
This installs the pinned engines (Qiskit 2.4.2, qiskit-aer 0.17.2, PennyLane 0.45.0, Stim 1.16.0) into
`.venv`. (The optional real-hardware SDKs are a separate `requirements-hardware.txt` — see
[03_real-hardware-lane.md](./03_real-hardware-lane.md).)

## Run a case

```bash
python -m qlab.pipeline --list                       # list cases + variants
python -m qlab.pipeline maxcut                        # default variant, all applicable solvers
python -m qlab.pipeline maxcut --instance pentagon --seed 7
python -m qlab.pipeline maxcut --all                  # every variant (the full variant-bar)
python -m qlab.pipeline state-prep --solver state-qiskit   # one solver only
```
or via the wrappers: `./scripts/precompute.sh maxcut --all` / `.\scripts\precompute.ps1 maxcut --all`.

## What it does

For the chosen case/variant the pipeline asks the registry for every **applicable** solver (quantum +
classical), runs each via the uniform `run(...)`, then:

1. writes a trace bundle to `data/artifacts/<case>/<variant>.json` (the primary circuit solver's full step
   trace + every solver's value/cost/notes + the comparison verdict + references);
2. classifies the **lane** from measurements (qubits, run-ms, trace-bytes, unitary-only) and writes
   `manifests/<case>__<variant>.json`;
3. prints a summary: per-solver result + cost, and the **classical-vs-quantum verdict**.

## Read the output

```
=== maxcut / square === lane=precompute
  [classical   ] maxcut-bruteforce  value={'cut': 4, 'bitstring': '0101'}  cost={'wall_ms': 0.013, 'evaluated': 16}
  [quantum-sim ] qaoa-qiskit        value={'cut': 4, ... 'expectation': 3.00}  cost={'wall_ms': 192, 'qubits': 4, ...}
  → Exact classical brute force found the optimum cut = 4 in 0.013 ms. QAOA (p=1) reached cut = 4. …
```

## Reproduce / verify

A run is a pure function of `(params, seed)`; re-running regenerates byte-identical artifacts. CI runs
`ruff` + `pytest` + a pipeline smoke (regenerate one case) and rejects committed `.env`/raw-data/leaked
paths. Add a new case = a `Problem` subclass + a `Solver` adapter (see
[../architecture/02_problem-solver-engine.md](../architecture/02_problem-solver-engine.md)); it appears in
`--list` automatically.
