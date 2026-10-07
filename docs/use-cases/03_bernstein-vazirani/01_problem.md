# 03 · Bernstein–Vazirani: 01 · The problem and its formalization

## The problem

A hidden bit-string `s` is locked inside an oracle `f(x) = s·x (mod 2)`. Recover `s`. The
Bernstein–Vazirani algorithm does it with a **single** oracle query; any classical algorithm needs `n`
queries (one per bit). It is the cleanest demonstration of a genuine, if oracle-model, quantum query
advantage, and a perfect honesty case: the advantage is real in *query count*, not in wall-clock time.

## Components & variables

- **Input register:** `n` qubits (the candidate string).
- **Answer qubit (ancilla):** prepared in `|−⟩`, so that the oracle's bit-flip becomes a **phase** on the
  input branch (phase kickback).
- **Oracle:** `f(x) = s·x mod 2`, implemented as a CNOT from each input qubit `i` with `s_i = 1` to the
  ancilla.

## Formalization

Start `|0⟩^n|1⟩`, apply `H^{⊗(n+1)}`:
```
H^n|0⟩^n ⊗ H|1⟩ = 2^{-n/2} Σ_x |x⟩ ⊗ |−⟩
```
The oracle maps `|x⟩|−⟩ → (−1)^{s·x}|x⟩|−⟩` (phase kickback). A final `H^{⊗n}` on the input register
interferes the branches:
```
H^n ( 2^{-n/2} Σ_x (−1)^{s·x}|x⟩ ) = |s⟩
```
so measuring the input register yields `s` **deterministically** in one query.

## References

Bernstein & Vazirani, "Quantum complexity theory", SIAM J. Comput. 26(5):1411 (1997),
doi:10.1137/S0097539796300921; Nielsen & Chuang (2010). Engine:
[../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md).

Back to [03 · Bernstein–Vazirani](../03_bernstein-vazirani.md).
