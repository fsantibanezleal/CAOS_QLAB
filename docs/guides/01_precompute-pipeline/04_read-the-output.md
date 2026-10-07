# 01 · The precompute pipeline: 04 · Read the output

## Read the output

```
=== maxcut / square === lane=precompute
  [classical   ] maxcut-bruteforce  value={'cut': 4, 'bitstring': '0101'}  cost={'wall_ms': 0.013, 'evaluated': 16}
  [quantum-sim ] qaoa-qiskit        value={'cut': 4, ... 'expectation': 3.00}  cost={'wall_ms': 192, 'qubits': 4, ...}
  → Exact classical brute force found the optimum cut = 4 in 0.013 ms. QAOA (p=1) reached cut = 4. …
```

Back to [01 · The precompute pipeline](../01_precompute-pipeline.md).
