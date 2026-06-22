# 03 · Cirq — 03 · Applying (the `qaoa-cirq` adapter)

QLab's `qaoa-cirq` solver (`qlab/solvers/cirq_solvers.py`) attacks the MaxCut problem on `cirq.Simulator`.
It is a textbook example of the adapter contract: a subclass of `Solver` with `applicable()` and `run()`,
self-registered with `@register_solver`, returning the same `SolverResult` as every other framework.

## The method

1. **Ansatz** (p=1): `H` on all qubits → a cost layer `cirq.ZZ(q_u, q_v) ** γ` per edge → a mixer
   `cirq.rx(2β)` on every qubit.
2. **Objective:** instead of building Pauli operators, QLab computes the cut expectation directly from the
   statevector — `⟨C⟩ = Σ_x p(x)·cut(x)` where `p(x) = |amplitude_x|²` and `cut(x)` is the problem's
   `cut_value`. This is convention-agnostic: whatever the exact gate parameterization, the *reported* cut
   is the true cut of the actual state.
3. **Optimization:** a deterministic 24×24 grid over `(γ, β) ∈ [0,π]²` (same lattice as the Qiskit and
   PennyLane adapters), keeping the maximum `⟨C⟩`.
4. **Readout:** the most-probable bitstring at the best angles → its cut value.

## Why a third QAOA framework

It is the lab's validation discipline (one problem, several real engines). Qiskit, PennyLane and Cirq use
different conventions and code paths; that they all reach the same cut (2/4/4/4/4/7 on the shipped graphs)
validates all three — and a disagreement would surface a real bug. None beats the classical brute-force
optimum, which is the honest point of the case.

## Adding the next framework

Copy this adapter's shape for the next engine (Qulacs, a hardware backend, …): set
`name/label/framework/paradigm`, implement `applicable()` + `run()`, decorate with `@register_solver`, add
the module to `qlab/solvers/__init__.py` (guarded import). Nothing else changes. See
[../../abstractions.md](../../abstractions.md).

## Related

- The case: [../../use-cases/02_maxcut.md](../../use-cases/02_maxcut.md). Sibling engines:
  [../01_qiskit.md](../01_qiskit.md) · [../02_pennylane.md](../02_pennylane.md).
