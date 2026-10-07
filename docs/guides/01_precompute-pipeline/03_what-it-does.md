# 01 · The precompute pipeline: 03 · What it does

## What it does

For the chosen case/variant the pipeline asks the registry for every **applicable** solver (quantum +
classical), runs each via the uniform `run(...)`, then:

1. writes a trace bundle to `data/artifacts/<case>/<variant>.json` (the primary circuit solver's full step
   trace + every solver's value/cost/notes + the comparison verdict + references);
2. classifies the **lane** from measurements (qubits, run-ms, trace-bytes, unitary-only) and writes
   `manifests/<case>__<variant>.json`;
3. prints a summary: per-solver result + cost, and the **classical-vs-quantum verdict**.

Back to [01 · The precompute pipeline](../01_precompute-pipeline.md).
