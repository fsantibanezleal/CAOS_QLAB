# 11 · QML — quantum-kernel classifier (the second learned method, and a hype check)

**Category:** variational · **Lane:** precompute · **Solvers:** `qml-pennylane` (quantum fidelity-kernel +
SVM), `qml-classical` (RBF-SVM) · **Variants:** 6 datasets.

## The problem

Binary-classify 2-D points. A *quantum* feature map embeds each point `x` into a quantum state `|φ(x)⟩`;
the **fidelity kernel** `K(x,x') = |⟨φ(x)|φ(x')⟩|²` is estimated on the device and fed to a classical SVM.
We compare it, on identical data, to a classical RBF-SVM — to see honestly whether the quantum kernel buys
anything (it does not, here).

## Components & variables

- **Feature map (2 qubits):** angle embedding of `(x₀, x₁)` plus an `IsingZZ(x₀·x₁)` entangling term for a
  second-order feature.
- **Kernel:** `K(a,b)` = probability of returning to `|00⟩` after `feature_map(a)` then `feature_map(b)†`
  — i.e. the state fidelity. The Gram matrix feeds `sklearn.SVC(kernel="precomputed")`.
- **Classical baseline:** `sklearn.SVC(kernel="rbf")` on the raw features.

## What each variant shows

Six datasets of increasing difficulty: `linear`, `linear-hard` (overlapping), `circles` (concentric),
`moons`, `xor` (4 clusters), `blobs`. Selecting one shows the data + decision regions and the train/test
accuracy of both classifiers.

## Solvers & results (from the committed traces, seed 42)

| Dataset | quantum-kernel test acc | classical RBF-SVM test acc | winner |
|---|---|---|---|
| linear | 1.00 | 1.00 | tie |
| linear-hard | 0.875 | 0.875 | tie |
| circles | 1.00 | 1.00 | tie |
| moons | 0.875 | **0.938** | **classical** |
| xor | 1.00 | 1.00 | tie |
| blobs | 1.00 | 1.00 | tie |

Both classify the easy/structured sets perfectly; on the harder `moons` the classical RBF-SVM is **better**.
The quantum kernel never wins.

## How to read & use the viz

Look at the two decision boundaries over the same points: where the data is cleanly separable both nail it;
where it is messy (`moons`, `linear-hard`) the classical RBF kernel is at least as good. The accuracy bars
make the "no advantage" conclusion concrete.

## Honest verdict

> The quantum-kernel classifier *works* — it's a real learned method — but it shows **no advantage** over a
> standard classical SVM on these datasets, and is sometimes worse. This matches the literature: provable
> quantum-kernel separations are contrived (built around problems like discrete-log); on real data quantum
> kernels are competitive at best, usually worse, and bottlenecked by data loading. **QML is one of the
> most over-hyped areas of quantum computing**, and this case is built to show that honestly. (Together with
> [VQE](./10_vqe.md), this is QLab's second learned/trained method.)

## References

Havlíček et al., Nature 567:209 (2019), doi:10.1038/s41586-019-0980-2; Huang et al., Nat. Commun. 12:2631
(2021), doi:10.1038/s41467-021-22539-9. Engine: [../frameworks/02_pennylane.md](../frameworks/02_pennylane.md).
