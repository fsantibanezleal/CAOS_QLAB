# 04 · Stim (+ PyMatching): 02 · How QLab uses it (applying)

## How QLab uses it (applying)

The `qec-stim` solver ([../../use-cases/13_qec-repetition.md](../../use-cases/13_qec-repetition.md)):

1. `stim.Circuit.generated("repetition_code:memory", rounds=d, distance=d, …)` builds a noisy
   repetition-code memory experiment (data + ancilla qubits, stabilizer rounds, a logical observable).
2. `circuit.compile_detector_sampler(seed=…)` samples **detection events** + **observable flips** for
   30,000 shots, fast and seeded (reproducible on the same machine and Stim version).
3. `pymatching.Matching.from_detector_error_model(circuit.detector_error_model(decompose_errors=True))`
   builds the MWPM decoder from Stim's own error model; `decode_batch` predicts the logical correction.
4. The **logical error rate** = fraction of shots where the prediction disagrees with the true observable.

This is the standard Stim→DEM→PyMatching toolchain that scales straight up to surface codes.

Back to [04 · Stim (+ PyMatching)](../04_stim.md).
