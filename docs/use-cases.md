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
| [08](./use-cases/08_qpe.md) | **QPE** | flagship-algorithms | controlled-powers + inverse QFT (Qiskit) · eigendecomposition (classical) | 6 (t=3–5, exact + finite-precision) | live | estimate eigenphase φ to **2⁻ᵗ**; classical diagonalizes tiny U exactly → QPE is a subroutine for huge U |
| [09](./use-cases/09_shor.md) | **Shor (toy: 15)** | flagship-algorithms | QPE order-finding on the real modular-mult unitary (Qiskit) · trial division (classical) | 6 bases of N=15 | precompute | factors 15→3×5 via order-finding; **RSA-2048 needs ~10⁶ FT qubits** — no near-term crypto threat |
| [10](./use-cases/10_vqe.md) | **VQE (H₂)** | variational | VQE on the real H₂ Hamiltonian (PennyLane diff-HF) · exact diagonalization/FCI (classical) | 6 bond lengths | precompute | matches FCI to **chemical accuracy** along the dissociation curve; H₂ minimal-basis is 4×4 → pedagogy, not advantage (first learned method) |
| [11](./use-cases/11_qml.md) | **QML (quantum kernel)** | variational | quantum fidelity-kernel SVM (PennyLane) · RBF-SVM (classical/sklearn) | 6 datasets | precompute | ties or **loses** to classical SVM — no advantage (second learned method; QML hype check) |
| [12](./use-cases/12_noise.md) | **Noise + mitigation (ZNE)** | noise-and-qec | Aer noise + zero-noise extrapolation (Qiskit) · noiseless statevector (classical) | 6 (p×depth) | precompute | ZNE cuts error 11×→1.5× as noise grows; mitigation ≠ correction; classical exact+free at this scale |

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
| 15 | Quantum phase estimation | flagship-algorithms | live | ✅ shipping (case 08) |
| 16 | Shor (toy, factor 15) | flagship-algorithms | precompute | ✅ shipping (case 09) |
| 17 | VQE — H₂ ground state | variational | precompute | ✅ shipping (case 10) |
| 18 | QAOA — MaxCut | variational | precompute | ✅ shipping (case 02) |
| 19 | Quantum kernel / variational classifier | variational | precompute | ✅ shipping (case 11) |
| 20 | Noise + measurement-error mitigation | noise-and-qec | precompute | ✅ shipping (case 12) |
| 21 | Repetition / bit-flip code | noise-and-qec | precompute | Stim / Qiskit |
| 22 | Surface-code demo | noise-and-qec | precompute | Stim |
| — | BB84 / QKD (optional) | fundamentals | live | circuit (mostly classical bookkeeping) |

**Honest sizing note:** every case is shipped with the solvers it genuinely supports; regimes/variants are
real (a parametric family where one exists), never padded to hit a count.

## See also

- [problem-types.md](./problem-types.md) — the formulation families + the classical-baseline doctrine.
- [frameworks.md](./frameworks.md) · [guides.md](./guides.md) · [state-of-the-art.md](./state-of-the-art.md).
