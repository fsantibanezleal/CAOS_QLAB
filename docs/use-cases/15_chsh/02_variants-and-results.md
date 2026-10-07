# 15 · CHSH / Bell inequality: 02 · Variants and results

## What each variant shows

Optimal angles (→ 2√2), sub-optimal and weak angles (smaller violations), aligned bases (`S = 2`, the
boundary), rotated-optimal (still 2√2, rotation invariance), and a separable state (no violation).

## Solvers & results (from the committed traces, seed 42)

| Variant | S (quantum) | classical bound | exceeds? |
|---|---|---|---|
| optimal | **2.828** | 2 | ✓ (= Tsirelson) |
| sub-optimal | 2.732 | 2 | ✓ |
| weak | 2.511 | 2 | ✓ |
| aligned | 2.000 | 2 |, (at the bound) |
| rotated-optimal | **2.828** | 2 | ✓ |
| **separable** | 1.414 | 2 | ✗ (no entanglement → no violation) |

The Bell state with good angles hits 2√2; the separable state can't even reach 2. The correlators
(`E00,E01,E10,E11`) are in each trace.

Back to [15 · CHSH / Bell inequality](../15_chsh.md).
