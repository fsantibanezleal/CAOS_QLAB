# 11 · QML: 02 · Variants and results

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

Back to [11 · QML](../11_qml.md).
