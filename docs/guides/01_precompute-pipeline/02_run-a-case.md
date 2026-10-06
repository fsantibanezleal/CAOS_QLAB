# 01 · The precompute pipeline: 02 · Run a case

## Run a case

```bash
python data-pipeline/run.py --list                   # list cases + variants
python data-pipeline/run.py maxcut                    # default variant, all applicable solvers
python data-pipeline/run.py maxcut --instance pentagon --seed 7
python data-pipeline/run.py maxcut --all              # every variant (the full variant-bar)
python data-pipeline/run.py state-prep --solver state-qiskit   # one solver only
```
or via the wrappers: `./scripts/precompute.sh maxcut --all` / `.\scripts\precompute.ps1 maxcut --all`.

Back to [01 · The precompute pipeline](../01_precompute-pipeline.md).
