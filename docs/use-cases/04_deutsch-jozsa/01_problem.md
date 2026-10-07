# 04 · Deutsch–Jozsa: 01 · The problem and its formalization

## The problem

An oracle hides a function `f:{0,1}ⁿ→{0,1}` *promised* to be either **constant** (same output everywhere)
or **balanced** (0 on exactly half the inputs). Decide which. Deutsch–Jozsa decides with a **single**
quantum query; a deterministic classical algorithm may need `2ⁿ⁻¹+1` queries (just over half the inputs) to
be certain, the historical first exponential quantum–classical query separation.

## Components & variables

- **Input register:** `n` qubits. **Answer qubit (ancilla):** in `|−⟩` for phase kickback.
- **Oracle:** constant-0 = identity; constant-1 = `X` on the ancilla (a global `−1` phase); balanced =
  `f(x)=s·x` (CNOTs from input qubits in `s` to the ancilla), a balanced function for any `s≠0`.

## Formalization

Start `|0⟩ⁿ|1⟩`, apply `H^{⊗(n+1)}` → `2^{-n/2} Σ_x |x⟩|−⟩`. The oracle stamps the phase
`(−1)^{f(x)}`. A final `H^{⊗n}` on the input register gives amplitude on `|0⟩ⁿ` equal to
`2^{-n} Σ_x (−1)^{f(x)}`:
```
f constant ⇒ |amplitude(0…0)| = 1  ⇒ measure all-zeros with certainty
f balanced ⇒ amplitude(0…0) = 0    ⇒ measure something non-zero with certainty
```
So one query + the interference pattern decides it deterministically.

## References

Deutsch & Jozsa, Proc. R. Soc. A 439:553 (1992), doi:10.1098/rspa.1992.0167; Nielsen & Chuang (2010).
Engine: [../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md). Sibling oracle case:
[03_bernstein-vazirani.md](../03_bernstein-vazirani.md).

Back to [04 · Deutsch–Jozsa](../04_deutsch-jozsa.md).
