# 17 · Superdense coding: 02 · Variants and results

## What each variant shows

The four 2-bit messages `00, 01, 10, 11`, the **complete** set (not padded). Selecting one shows the
encoding gate, the Bell-state the pair becomes, and Bob's exact decode.

## Solvers & results (from the committed traces, seed 42)

| Message | encode | Bell state | Bob decodes | correct |
|---|---|---|---|---|
| 00 | I | Φ⁺ | 00 | ✓ |
| 01 | X | Ψ⁺ | 01 | ✓ |
| 10 | Z | Φ⁻ | 10 | ✓ |
| 11 | ZX | Ψ⁻ | 11 | ✓ |

Every message is recovered exactly: **2 classical bits from 1 transmitted qubit**.

Back to [17 · Superdense coding](../17_superdense.md).
