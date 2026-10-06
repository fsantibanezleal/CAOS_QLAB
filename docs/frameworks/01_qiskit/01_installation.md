# 01 · Qiskit (+ qiskit-aer): 01 · Installation

## Installation

```bash
pip install qiskit==2.4.2 qiskit-aer==0.17.2     # in requirements-precompute.txt; the .venv only
```
Core ships only a reference `BasicSimulator`; the real engine is `qiskit-aer`. The real-hardware lane adds
`qiskit-ibm-runtime` (see [../../guides/03_real-hardware-lane.md](../../guides/03_real-hardware-lane.md)).
**Qiskit does not run in the browser** (`rustworkx`/`symengine`/`aer` are native), it lives in the offline
precompute lane only.

Back to [01 · Qiskit (+ qiskit-aer)](../01_qiskit.md).
