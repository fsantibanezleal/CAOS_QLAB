# State of the art — quantum computing in 2025–2026 (the honest assessment)

> **One-line frame.** In 2025–2026, quantum computers are real, impressive **scientific instruments** — not
> yet useful computers. The best machines have ~50–156 high-quality qubits with two-qubit error rates near
> 10⁻³, so circuits drown in noise after at most a few thousand operations. Error correction crossed a
> genuine threshold (Google Willow, Dec 2024), but that was *one* logical qubit, ~8 orders of magnitude
> from breaking cryptography. **Does a quantum computer beat a classical one at anything you'd pay for? Not
> yet.** This page is the reason QLab is built to compare every quantum method against a classical baseline.

All numbers are dated to their source and should be re-checked against live vendor data sheets before being
quoted; this is a fast-moving field. This page is distilled from a deep-research review (full sourcing at
the bottom).

---

## 1. Hardware reality

Two qubit modalities dominate the credible frontier: **superconducting transmons** (IBM, Google — fast,
fixed 2D connectivity, more noise) and **trapped ions / neutral atoms** (Quantinuum, IonQ, QuEra — slower
gates, all-to-all or reconfigurable connectivity, lower error). The single most important number is the
**two-qubit gate error**, because it sets how deep a circuit can go before noise destroys the signal.

| Device (vendor) | Modality | Physical qubits | 2-qubit error (median, dated) | Headline metric |
|---|---|---|---|---|
| IBM Heron r2 ("Kingston") | superconducting | 156 | ~3×10⁻³; best pairs <1×10⁻³ | ~330k CLOPS; GA 2026-03-21 |
| IBM Nighthawk | superconducting | 120 | — | targets 5k→15k gates/circuit (depth-focused) |
| IBM Condor | superconducting | **1,121** | (not the usable workhorse) | largest single chip — mostly a count milestone |
| Google Willow | superconducting | 105 | "below-threshold" regime | first below-threshold QEC (Dec 2024) |
| Quantinuum H2 | trapped ion | 56, all-to-all | ≲2×10⁻³ ("three 9s" on all pairs) | **Quantum Volume 2²⁵** (Sep 2025) |
| IonQ Tempo | trapped ion | 100 | — | **#AQ 64** (Sep 2025) |
| QuEra (Harvard/MIT) | neutral atoms | 256→3,000+ atoms | reconfigurable | **48 logical qubits**; magic-state distillation (2025) |

**How to read these:**
- **Qubit count is the most over-marketed number.** Condor's 1,121 qubits are not 1,121 *usable* qubits —
  IBM itself pivoted its useful roadmap to the 120–156-qubit Heron/Nighthawk line because *depth and
  fidelity*, not raw count, gate what runs.
- **Two-qubit error ~10⁻³** is today's best. A circuit with ~1,000 two-qubit gates accumulates order-1
  expected error, so *useful* depth before noise dominates is in the low thousands of gates at best, far
  fewer without mitigation.
- **Vendor metrics are not comparable.** Quantum Volume (largest reliable square circuit), CLOPS (speed,
  not capability), and IonQ's #AQ measure different things across modalities — treat single-number
  comparisons skeptically.

### Google Willow's below-threshold result (Dec 2024) — what it does and doesn't mean

Google showed, for the first time on a superconducting chip, **quantum error correction below the
surface-code threshold**: scaling the code from distance 3→5→7 made the logical error rate *fall* (~2.14×
per step); the distance-7 logical qubit (101 physical qubits) hit ~0.143% logical error per cycle.
**Means:** the central premise of fault tolerance — adding physical qubits makes the logical qubit *better*
— is now experimentally real. **Does NOT mean:** it was **one** logical qubit used as a memory (not a
computation); the ~10⁻³/cycle logical error is still ~8 orders of magnitude from crypto-scale needs; no
useful computation was demonstrated.

### Logical qubits / QEC status

A handful of logical qubits doing shallow operations exist (Quantinuum + Microsoft: 12 logical qubits,
2024; QuEra: 48 logical qubits + logical magic-state distillation, 2025; Google: 1 below-threshold logical
qubit). A *useful* fault-tolerant machine needs **hundreds to thousands of logical qubits running
millions–billions of logical gates**. IBM's public roadmap targets ~200 logical qubits / 100M gates by
2029 (Starling), ~2,000 logical / 1B gates by 2033+ (Blue Jay) — **roadmap targets, not delivered
hardware**; treat 2029+ dates as aspirational.

---

## 2. What actually runs (NISQ algorithms) — and whether it beats classical

NISQ = Noisy Intermediate-Scale Quantum (~50–150 noisy qubits, no error correction). Honest summary:
**didactic algorithms run and teach beautifully; "advantage" algorithms run but rarely (mostly never) beat
a good classical computer at these scales.** This is exactly what QLab demonstrates by running both.

| Algorithm | Runs today? | Beats classical at lab scale? | QLab framing |
|---|---|---|---|
| Bell / GHZ / W state prep | ✅ exactly | n/a (it's a state, not a computation) | the concept of entanglement; classical writes 2ⁿ amplitudes instantly |
| Deutsch–Jozsa / Bernstein–Vazirani / Simon | ✅ | ❌ (no speedup at this size) | oracle/interference structure; honest "no speedup here" |
| Grover search | ✅ | ❌ (√N is asymptotic; oracle overhead loses) | amplitude amplification; classical O(N) wins at small N |
| QFT / QPE | ✅ | ❌ | building block; classical FFT is trivial here |
| Shor (toy N=15, 21) | ✅ toy only | ❌ | period-finding; **real RSA-2048 needs ~10⁶ physical qubits** (§4) |
| VQE (H₂, LiH) | ✅ on sim / tiny hw | ❌ (full CI on a laptop) | hybrid variational; barren plateaus block scaling |
| QAOA (MaxCut) | ✅ | ❌ (Goemans–Williamson & local algos win) | **QLab's flagship honesty case** — see below |
| Quantum kernels / variational QML | ✅ | ❌ (no practical advantage on real data) | the most over-hyped area |
| Quantum simulation of physics/chemistry | ✅ | the **credible near-term frontier** (still being chased classically) | where "hard for classical" is at least plausible |
| Random circuit sampling ("supremacy") | ✅ | technically yes, but **useless + unverifiable** | a complexity point, not utility |

**QAOA / MaxCut, concretely (QLab runs this).** QAOA produces approximate cuts but, on the graph families
studied, classical methods win: Goemans–Williamson's 0.878-approximation SDP and even simple local
algorithms outperform low-depth QAOA (Barak–Marwaha 2021; Hastings). In QLab, exact brute force finds the
optimal cut in microseconds on every shipped graph; QAOA (Qiskit *and* PennyLane) matches it but never
beats it — and costs far more. That is the honest, expected result.

### Error mitigation ≠ error correction

Conflating these is a common marketing move. **Correction (QEC)** encodes one logical qubit in many and
actively fixes errors; scalable, but not yet available at useful scale. **Mitigation (ZNE, PEC, readout
correction, dynamical decoupling)** post-processes to reduce *bias in an expectation value* without fixing
the state — buys a few effective gate-layers *today* but with **exponential** sampling overhead. EM is a
NISQ bridge, not a path to scalable computation.

**The canonical case study:** IBM's 2023 *Nature* "utility before fault tolerance" (127-qubit kicked-Ising,
ZNE) was a real, large, mitigated experiment — and was **reproduced classically (tensor networks on
laptops/clusters) within months**, more accurately. "Utility" ≠ "advantage". Quantum did something
impressive; classical caught up; both are true.

---

## 3. What can you run on simulators (where almost all hands-on learning happens)

A full state vector is **2ⁿ complex amplitudes** (16 bytes each, double). Each +1 qubit doubles memory and
~doubles time. Practical full-statevector ceilings:

| Hardware | Honest practical max (double precision) |
|---|---|
| Laptop (16 GB) | **~28–30 qubits** |
| 24 GB GPU | ~31–32 qubits |
| 1 TB workstation | ~34–35 qubits |
| Multi-GPU 8×80 GB | ~36 qubits |
| Supercomputer (MPI) | ~45–49 qubits (record-class) |

Past the statevector wall you **change method, not hardware**: **tensor networks** (quimb / cuTensorNet)
reach 100s–1000s of qubits for *low-entanglement* circuits (but die on volume-law entanglement), and
**stabilizer** simulation (Stim) reaches **thousands–tens of thousands** of qubits for *Clifford-only*
circuits (the right tool for error-correction studies). GPUs (NVIDIA cuQuantum) only pay off above ~20–24
qubits. QLab teaches this decision tree explicitly — see [frameworks.md](./frameworks.md).

---

## 4. Resource estimates (grounding expectations)

- **Breaking RSA-2048 (Shor):** Gidney 2025 — **<1 million** noisy physical qubits, <1 week (down ~20× from
  the 2019 estimate of ~20M). Today's largest usable devices are ~100–156 high-quality qubits. **Gap: 3–4+
  orders of magnitude + fault tolerance we don't have.** No credible path before ~2030, likely later.
  "Harvest now, decrypt later" is a real *policy* concern, not a "next year" capability.
- **Useful quantum chemistry (FeMoco):** modern algorithms need ~**1,100+ logical qubits** and ~**3×10⁸
  logical T-gates** — squarely in the Starling-class (2029+) regime, optimistically. And classical methods
  recently solved a FeMoco *model* to chemical accuracy, so even the "killer app" baseline keeps moving.

---

## 5. Cloud services & real costs (USD)

Real quantum **hardware** is genuinely free only via **IBM Quantum Open Plan**; everything else free is a
simulator or time-limited credits. On gate-based **ion-trap** machines a *single trivial job* costs real
money because of minimum-charge floors; **superconducting** QPUs are far cheaper per circuit; simulators
dominate value-per-dollar.

| Provider · device | Pricing (dated 2025-09→2026-04) | What $100 buys (1000-shot circuits) |
|---|---|---|
| **IBM Quantum Open** | free: **10 min QPU / 28-day window** (156-q Heron r2) | n/a — free |
| IBM Pay-As-You-Go | **$1.60/s** QPU runtime ($96/min) | ~1 min of QPU |
| AWS Braket SV1 (sim) | $0.075/min, 3-s min | thousands of circuits |
| AWS Braket IonQ Aria | $0.30/task + $0.03/shot | **~3 circuits** |
| AWS Braket IQM Garnet (superconducting) | $0.30 + $0.00145/shot | **~57 circuits** |
| AWS Braket Rigetti (superconducting) | $0.30 + ~$0.0009/shot | **~83 circuits** |
| Azure IonQ Aria | **min $97.50 / program** (mitigation on) | ~1 circuit (hits the floor) |
| Azure Quantinuum H2 | subscription $125k–175k/month | enterprise only |
| qBraid (broker) | Standard $20/mo · Pro $100/mo (1 credit = $0.01) | convenience + sim/CPU time, not free hardware |

**Free credits beyond IBM:** AWS Braket 1 simulator-hour/month (first 12 months, no free hardware); Azure
**$500 one-time**; IonQ research credits (academics, up to $10k); Quantinuum QCUP (US researchers).

### The budget tiers (honest)

- **$0:** unlimited local simulation (Qiskit Aer / Braket LocalSimulator) to ~28–30 qubits, **plus ~10
  min/month of real 156-qubit IBM hardware** — enough for Bell/GHZ, small VQE/QAOA, teaching noise. *A
  complete genuine quantum course is teachable at $0.*
- **~$20–50/month:** mostly *convenience* (a managed notebook like qBraid) + a few dozen to a couple
  hundred **superconducting**-QPU circuits. **Effectively zero meaningful ion-trap time** (one IonQ job can
  exceed the whole budget).
- **Enterprise money:** ion-trap at scale, IBM Flex (~$30k)/Premium, reserved time, parameter sweeps,
  optimization loops on hardware.

**QLab's stance:** build on **local/managed simulators + IBM Quantum Open** (the free real-hardware moment),
keep **Azure's $500** as a one-time "feel a real ion-trap result once" treat, and only ever point a *paid*
recommendation at **superconducting** QPUs (IQM/Rigetti via Braket/qBraid) for cheap real-hardware
iteration — never ion-trap for casual use. The real-hardware lane is **optional and opt-in**; the public
site stays static and free.

---

## 6. What's real / what's hype (the table to read before believing marketing)

| Claim you'll hear | Reality (2025–2026) | Verdict |
|---|---|---|
| "1,000+ qubits" | true for raw count; usable high-fidelity devices are ~50–156 | **misleading** |
| "We achieved quantum supremacy" | real but useless + largely unverifiable; classical keeps narrowing gaps | **practically empty** |
| "Quantum advantage on a useful problem" | not demonstrated; 2023 "utility" beaten classically | **not yet** |
| "Quantum will break encryption soon" | needs ~10⁶ physical qubits + fault tolerance | **hype (years away)** |
| "Quantum ML beats classical ML" | no practical advantage on real data | **hype** |
| "QAOA solves optimization better" | classical generally wins | **hype** |
| "Error correction is solved" | below-threshold shown (1 logical qubit); useful FT not built | **real milestone, far from done** |
| "Quantum simulates chemistry today" | only toy molecules already trivial classically | **real but not advantageous** |
| "Quantum simulation of physics is promising" | the credible near-term frontier | **real (research-stage)** |

The three questions to ask any quantum-advantage claim: *Is the problem actually useful? Has an independent
classical computer been beaten on it? Is this delivered hardware or a roadmap slide?* In 2026 the most
valuable thing these machines are doing is **advancing error-correction science and training the people**
who might make them useful in the 2030s — which is exactly what a lab like this is for.

---

## Sources (accessed 2026-06-21)

Hardware: IBM Quantum blog/roadmap (`ibm.com/quantum`, `ibm.com/roadmaps/quantum`); Google "Quantum error
correction below the surface code threshold" (arXiv:2408.13687) + "A verifiable quantum advantage" (2025);
Quantinuum H2 data sheet + QV-2²⁵ announcement; IonQ #AQ 64; QuEra magic-state distillation (2025).
NISQ/advantage: Kim et al. *Nature* 2023 + classical rebuttals (PRX Quantum 5.010308; Phys. Rev. Research
6.013326; Sci. Adv. adk4321); Barak–Marwaha (arXiv:2106.05900); "A brief history of quantum vs classical
computational advantage" (arXiv:2412.14703). Resources: Gidney 2025 (arXiv:2505.15917); Reiher et al. PNAS
2017 + arXiv:1809.10307. Costs: IBM Plans overview + Pay-As-You-Go; AWS Braket pricing; Microsoft Learn
Azure Quantum pricing; qBraid pricing. Simulators/scaling: PyPI/GitHub release data for Qiskit/Aer, qsim,
Qulacs, Stim, cuQuantum, quimb. (Full per-claim URLs are kept in the project's research dossiers.)
