# Licenses

CAOS_QLAB code is **MIT** (see [LICENSE](LICENSE)). Its dependencies keep their own licenses; the table
below lists the engines QLab calls and their licenses (verified 2026-06-21). **Watch Mitiq (GPL-3.0)** —
it is copyleft and only enters the build when the error-mitigation case lands; until then QLab ships only
permissive (Apache-2.0 / MIT / BSD) dependencies.

| Package | Role | License |
|---|---|---|
| Qiskit | circuit SDK | Apache-2.0 |
| qiskit-aer | high-performance simulator (noise) | Apache-2.0 |
| qiskit-ibm-runtime | IBM real-hardware lane (optional) | Apache-2.0 |
| PennyLane / PennyLane-Lightning | differentiable QML/VQA + fast sim | Apache-2.0 |
| Cirq / qsimcirq | circuit SDK + simulator *(planned)* | Apache-2.0 |
| Stim | stabilizer/QEC simulator *(planned)* | Apache-2.0 |
| pytket | compiler/transpiler *(planned)* | Apache-2.0 |
| Qulacs | fast CPU statevector *(planned)* | MIT |
| OpenFermion | quantum chemistry *(planned)* | Apache-2.0 |
| **Mitiq** | **error mitigation *(planned)*** | **GPL-3.0** ⚠ copyleft |
| NumPy / SciPy / NetworkX / Matplotlib / scikit-learn | scientific stack + classical-ML baselines | BSD-3-Clause |

Committed artifacts under `data/artifacts/` are computed outputs of these engines (compact JSON traces),
redistributable under this repo's MIT license. No third-party datasets are vendored.
