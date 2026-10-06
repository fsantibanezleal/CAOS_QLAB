# 01 · The precompute pipeline: 01 · Setup

## Setup

```powershell
.\scripts\setup.ps1          # Windows, creates .venv (Python 3.12), installs core+dev+precompute
```
```bash
./scripts/setup.sh           # macOS / Linux / Git-Bash
```
This installs the engine `qversus` (PyPI) and the pinned frameworks (Qiskit 2.4.2, qiskit-aer 0.17.2,
PennyLane 0.45.0, Cirq 1.6.1, Stim 1.16.0) into `.venv`. (The optional real-hardware SDKs are a separate `requirements-hardware.txt`, see
[03_real-hardware-lane.md](../03_real-hardware-lane.md).)

Back to [01 · The precompute pipeline](../01_precompute-pipeline.md).
