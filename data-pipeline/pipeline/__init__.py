"""QLab's precompute tooling, invoked by path through data-pipeline/run.py; not an installable package.

- build:    the orchestrator (artifact and manifest paths, the bundle, the CLI).
- verdicts: the per-case comparison blocks and bilingual verdicts.
- gate:     the measured live-vs-precompute classifier.
- manifest: the per-case manifest contract.

The engine (problems, solvers, registry, trace schema) is the `qversus` package from PyPI.
"""
