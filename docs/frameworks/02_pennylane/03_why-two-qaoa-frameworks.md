# 02 · PennyLane (+ Lightning): 03 · Why two QAOA frameworks?

## Why two QAOA frameworks?

SimLab pairs SimPy (live) with Ciw (analytic) on the same queue; QLab pairs QAOA-Qiskit with
QAOA-PennyLane on the same graph. They use different Hamiltonian conventions and different code paths, so
agreement on the cut value (and disagreement would be a bug) validates both, and teaches that the
*physics*, not the *framework*, is what matters. On every shipped graph both reproduce the classical
optimum (2/4/4/4/4/7) and neither beats it.

Back to [02 · PennyLane (+ Lightning)](../02_pennylane.md).
