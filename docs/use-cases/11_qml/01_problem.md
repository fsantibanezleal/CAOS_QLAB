# 11 · QML: 01 · The problem and its formalization

## The problem

Binary-classify 2-D points. A *quantum* feature map embeds each point `x` into a quantum state `|φ(x)⟩`;
the **fidelity kernel** `K(x,x') = |⟨φ(x)|φ(x')⟩|²` is estimated on the device and fed to a classical SVM.
We compare it, on identical data, to a classical RBF-SVM, to see honestly whether the quantum kernel buys
anything (it does not, here).

## Components & variables

- **Feature map (2 qubits):** angle embedding of `(x₀, x₁)` plus an `IsingZZ(x₀·x₁)` entangling term for a
  second-order feature.
- **Kernel:** `K(a,b)` = probability of returning to `|00⟩` after `feature_map(a)` then `feature_map(b)†`
 , i.e. the state fidelity. The Gram matrix feeds `sklearn.SVC(kernel="precomputed")`.
- **Classical baseline:** `sklearn.SVC(kernel="rbf")` on the raw features.

## References

Havlíček et al., Nature 567:209 (2019), doi:10.1038/s41586-019-0980-2; Huang et al., Nat. Commun. 12:2631
(2021), doi:10.1038/s41467-021-22539-9. Engine: [../../frameworks/02_pennylane.md](../../frameworks/02_pennylane.md).

Back to [11 · QML](../11_qml.md).
