# 02 · PennyLane (+ Lightning): 02 · How QLab uses it (applying)

## How QLab uses it (applying)

- **`qaoa-pennylane`** ([../../use-cases/02_maxcut.md](../../use-cases/02_maxcut.md)): builds the MaxCut cost
  Hamiltonian with `qml.qaoa.maxcut(graph)` (a NetworkX graph), evaluates `⟨H_C⟩` on `default.qubit`, and
  grid-searches the *same* `(γ,β)` lattice as the Qiskit adapter. Key correctness detail: PennyLane's
  maxcut cost Hamiltonian is **minimized** to maximize the cut (a cut edge contributes −1), QLab searches
  for the *minimum* `⟨H_C⟩`, then reads the cut off the most-probable bitstring. Running two independent
  frameworks that must agree on the cut is the lab's "two engines, one problem" validation discipline.

Back to [02 · PennyLane (+ Lightning)](../02_pennylane.md).
