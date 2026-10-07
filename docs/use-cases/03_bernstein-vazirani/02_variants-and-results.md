# 03 · Bernstein–Vazirani: 02 · Variants and results

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

Back to [03 · Bernstein–Vazirani](../03_bernstein-vazirani.md).
