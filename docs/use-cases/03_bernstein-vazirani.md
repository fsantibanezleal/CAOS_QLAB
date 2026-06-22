# 03 · Bernstein–Vazirani — 1 quantum query vs n classical

**Category:** oracle-algorithms · **Lane:** live · **Solvers:** `bv-qiskit` (circuit), `bv-classical`
(oracle queries) · **Variants:** 6 hidden strings.

## The problem

A hidden bit-string `s` is locked inside an oracle `f(x) = s·x (mod 2)`. Recover `s`. The
Bernstein–Vazirani algorithm does it with a **single** oracle query; any classical algorithm needs `n`
queries (one per bit). It is the cleanest demonstration of a genuine — if oracle-model — quantum query
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

## What each variant shows

Six hidden strings of 3–6 bits (`101`, `0111`, `1101`, `11010`, `101101`, `111111`). Selecting one updates
the oracle (which CNOTs appear), the step-by-step statevector/Bloch trace, the measurement histogram (a
single peak at `s`), and the comparison panel (1 vs `n` queries).

## Solvers & results (from the committed traces, seed 42)

| Variant (n) | recovered | quantum queries | classical queries | lane |
|---|---|---|---|---|
| s=101 (3) | 101 ✓ | **1** | 3 | live |
| s=0111 (4) | 0111 ✓ | **1** | 4 | live |
| s=1101 (4) | 1101 ✓ | **1** | 4 | live |
| s=11010 (5) | 11010 ✓ | **1** | 5 | live |
| s=101101 (6) | 101101 ✓ | **1** | 6 | live |
| s=111111 (6) | 111111 ✓ | **1** | 6 | live |

`bv-qiskit` builds the real circuit on `n+1` qubits (≤7 here), traces it, and recovers `s` from the input
register; `bv-classical` queries `f(e_i)` for each basis vector, recovering `s` bit-by-bit in `n` queries.

## How to read & use the viz

Watch the **phase kickback**: after the oracle, the input-register Bloch vectors carry the `(−1)^{s·x}`
phases (invisible to a Z-measurement); the final Hadamards convert phase into a definite bitstring. The
histogram collapses from uniform to a single spike at `s`.

## Honest verdict

> Quantum recovers `s` in **1** oracle query; classical needs **n**. This is a *real* query-complexity
> separation — but it lives in the oracle model, and at these sizes the classical wall-time is just as
> instant. It teaches interference + phase kickback honestly, without overclaiming a practical speedup.

## References

Bernstein & Vazirani, "Quantum complexity theory", SIAM J. Comput. 26(5):1411 (1997),
doi:10.1137/S0097539796300921; Nielsen & Chuang (2010). Engine:
[../frameworks/01_qiskit.md](../frameworks/01_qiskit.md).
