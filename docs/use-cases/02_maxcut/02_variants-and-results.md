# 02 · MaxCut: 02 · Variants and results

## What each variant shows

`triangle` (odd cycle, frustration, max cut 2 of 3), `square` (even cycle, fully cuttable, 4),
`square-diag` (added frustration), `bowtie` (two triangles), `pentagon` (odd 5-cycle, max cut 4),
`petersen-ish` (6-node 3-regular prism, denser, harder for low-depth QAOA, max cut 7). Selecting a graph
updates the graph viz (cut highlighted), the `(γ,β)` energy landscape, the bitstring histogram, and the
comparison panel.

## Solvers & results (from the committed traces, seed 42)

| Graph | optimal (brute force) | greedy | QAOA-Qiskit | QAOA-PennyLane | QAOA-Cirq | classical time |
|---|---|---|---|---|---|---|
| triangle | **2** | 2 | 2 (⟨C⟩=1.99) | 2 | 2 (⟨C⟩=1.99) | ~0.01 ms |
| square | **4** | 2 | 4 (⟨C⟩=3.00) | 4 | 4 (⟨C⟩=2.99) | ~0.01 ms |
| square-diag | **4** | 3 | 4 | 4 | 4 | ~0.02 ms |
| bowtie | **4** | 4 | 4 | 4 | 4 | ~0.02 ms |
| pentagon | **4** | 4 | 4 | 4 | 4 | ~0.02 ms |
| petersen-ish | **7** | 7 | 7 | 7 | 7 | ~0.05 ms |

All **three** quantum frameworks (Qiskit, PennyLane, Cirq) reproduce the optimal cut on every graph, a
genuine three-way cross-check (disagreement would be a bug), using 3–6 qubits and 576 evaluations each
(~150–1300 ms), versus brute force's exact optimum in microseconds.

Back to [02 · MaxCut](../02_maxcut.md).
