# Use cases — the worked catalog + roadmap

Each case is a `Problem` solved end to end by one or more `Solver` adapters, with the classical baseline
alongside. **Lane** is the *measured* verdict. The catalog grows case-by-case; docs are authored as each
lands (ADR-0056).

## Shipping today (v0.01.000) — run end to end with real engines + committed traces

| # | Case | Category | Solvers (frameworks) | Variants | Lane | Verdict |
|---|---|---|---|---|---|---|
| [01](./use-cases/01_state-prep.md) | **State preparation** | entanglement | gate circuit (Qiskit) · direct amplitudes (classical) | 7 (Bell Φ⁺/Φ⁻/Ψ⁺/Ψ⁻, GHZ-3, GHZ-4, W-3) | live | classical describes 2–4 q instantly; entanglement is the concept |
| [02](./use-cases/02_maxcut.md) | **MaxCut** | variational | QAOA (Qiskit) · QAOA (PennyLane) · QAOA (Cirq) · brute force + greedy (classical) | 6 graphs (3–6 nodes) | precompute | exact optimum in µs; all 3 QAOA frameworks match, none beats |
| [03](./use-cases/03_bernstein-vazirani.md) | **Bernstein–Vazirani** | oracle-algorithms | BV circuit (Qiskit) · oracle queries (classical) | 6 hidden strings (3–6 bits) | live | recovers s in **1** quantum query vs **n** classical — a real query-complexity advantage |
| [04](./use-cases/04_deutsch-jozsa.md) | **Deutsch–Jozsa** | oracle-algorithms | DJ circuit (Qiskit) · oracle queries (classical) | 6 (constant + balanced, 3–4 q) | live | constant vs balanced in **1** quantum query vs up to **2ⁿ⁻¹+1** classical |
| [05](./use-cases/05_simon.md) | **Simon** | oracle-algorithms | Simon circuit + GF(2) solve (Qiskit) · collision search (classical) | 6 periods (n=2–3) | precompute | hidden period in **O(n)** quantum queries vs **~2ⁿ/²** classical — first exponential separation |
| [06](./use-cases/06_grover.md) | **Grover** | flagship-algorithms | oracle + diffuser (Qiskit) · linear scan (classical) | 6 (N=4–16, single + multi-marked) | live | finds the marked item in **~√N** queries vs classical **~N/2** — quadratic (asymptotic) speedup |
| [07](./use-cases/07_qft.md) | **QFT** | flagship-algorithms | QFT circuit (Qiskit) · FFT (classical) | 6 (n=3–4 basis states) | live | transform in **O(n²)** gates vs classical **O(n·2ⁿ)** — cheaper to apply, but unreadable → a subroutine |

## Roadmap (the catalog, ordered beginner → advanced)

From the case-catalog dossier; each lands with its solver set + classical baseline + docs. **Live** = clean
small unitary (JS lane); **precompute** = needs noise / feed-forward / optimization / >12 q.

| # | Case | Category | Lane | Key solvers planned |
|---|---|---|---|---|
| 03 | Single-qubit gates + Bloch sphere | fundamentals | live | circuit (Qiskit) |
| 04 | Superposition & measurement statistics | fundamentals | live | circuit |
| 05 | Phase & interference | fundamentals | live | circuit |
| 06 | Quantum random-number generator | fundamentals | live | circuit + classical PRNG contrast |
| 07 | CHSH / Bell-inequality test | entanglement | precompute | Qiskit (angle sweep) vs local-hidden-variable bound |
| 08 | Superdense coding | entanglement | live | circuit |
| 09 | Quantum teleportation | entanglement | precompute | Qiskit (mid-circuit measure + feed-forward) |
| 10 | Deutsch–Jozsa | oracle-algorithms | live | ✅ shipping (case 04) |
| 11 | Bernstein–Vazirani | oracle-algorithms | live | ✅ shipping (case 03) |
| 12 | Simon's algorithm | oracle-algorithms | precompute | ✅ shipping (case 05) |
| 13 | Grover search | flagship-algorithms | live | ✅ shipping (case 06) |
| 14 | Quantum Fourier Transform | flagship-algorithms | live | ✅ shipping (case 07) |
| 15 | Quantum phase estimation | flagship-algorithms | precompute | circuit (precision sweep) |
| 16 | Shor (toy, factor 15) | flagship-algorithms | precompute | circuit vs classical factoring + resource-cost panel |
| 17 | VQE — H₂ ground state | variational | precompute | VQE (PennyLane + Qiskit) vs exact diagonalization (FCI) |
| 18 | QAOA — MaxCut | variational | precompute | ✅ shipping (case 02) |
| 19 | Quantum kernel / variational classifier | variational | precompute | PennyLane vs classical SVM/MLP |
| 20 | Noise + measurement-error mitigation | noise-and-qec | precompute | Aer noise + Mitiq vs noiseless |
| 21 | Repetition / bit-flip code | noise-and-qec | precompute | Stim / Qiskit |
| 22 | Surface-code demo | noise-and-qec | precompute | Stim |
| — | BB84 / QKD (optional) | fundamentals | live | circuit (mostly classical bookkeeping) |

**Honest sizing note:** every case is shipped with the solvers it genuinely supports; regimes/variants are
real (a parametric family where one exists), never padded to hit a count.

## See also

- [problem-types.md](./problem-types.md) — the formulation families + the classical-baseline doctrine.
- [frameworks.md](./frameworks.md) · [guides.md](./guides.md) · [state-of-the-art.md](./state-of-the-art.md).
