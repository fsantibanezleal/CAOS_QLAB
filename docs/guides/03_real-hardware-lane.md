# 03 · The real-hardware lane (optional, opt-in)

Run a case on a **real quantum computer** and commit the returned counts as a trace with a `ran_on`
provenance badge. This is the *"this actually ran on a 156-qubit quantum computer"* moment.

> **Off by default.** This lane runs **locally** with a token from the private vault; the published static
> site ships no secrets and makes no live hardware calls. It is gated on an account/tier decision.

> **Wired now (v0.05.000).** The opt-in `ibm-hardware` solver (`qlab/solvers/hardware_solvers.py`) is in the
> engine and dormant until a token exists. Validate connectivity any time (free, only IBM is pinged):
> `python tools/check_backends.py` (or `scripts/check-backends.{ps1,sh}`).

## Setup

```bash
.venv/bin/python -m pip install -r requirements-hardware.txt   # qiskit-ibm-runtime (+ braket/azure, optional)
cp .env.example .env                                            # then paste your token (NEVER commit .env)
python tools/check_backends.py                                  # confirms the token reaches IBM + lists devices
```

Run a case on real hardware (opt-in — it NEVER runs in a default `--all`):

```bash
python -m qlab.pipeline bernstein-vazirani --instance bv-101 --solver ibm-hardware
```

## IBM Quantum Open (the recommended free path)

IBM Quantum Open Plan is the **only genuinely free real-hardware tier**: ~10 minutes of QPU time per
rolling 28-day window on a 156-qubit Heron r2. Get an API token at `quantum.cloud.ibm.com`, put it in
`.env` (`QISKIT_IBM_TOKEN=…`), then submit via the V2 primitives:

```python
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
service = QiskitRuntimeService(channel="ibm_quantum_platform", token=...)   # from .env
backend = service.least_busy(operational=True, simulator=False)
# transpile the case's circuit to the backend's ISA, then:
job = Sampler(mode=backend).run([(isa_circuit,)])
counts = job.result()[0].data.meas.get_counts()     # → committed as a trace with ran_on provenance
```

The committed trace carries `provenance.ran_on = "ibm_<backend> · Heron r2 · <date>"`, and the app shows
the **noisy real-hardware histogram next to the ideal simulator** — the most honest possible noise lesson.

## Costs (the honest reality)

See [../state-of-the-art.md](../state-of-the-art.md) §5 for the full table. Short version:

- **$0:** IBM Open (~10 min/month real hardware) + unlimited local simulation. Enough for Bell/GHZ, small
  VQE/QAOA, a real noise demo.
- **~$20–50/month:** mostly a managed notebook (qBraid) + dozens–hundreds of **superconducting**-QPU
  circuits (IQM/Rigetti via Braket, ~$1.2–1.75 per 1000-shot circuit). **Effectively no ion-trap time.**
- **Enterprise:** ion-trap at scale (IonQ/Quantinuum), reserved time, optimization loops on hardware.

**Never** point casual use at ion-trap (IonQ Aria via Azure has a **$97.50 minimum per program**). Azure's
**$500 one-time credit** is best spent as a single "feel a real ion-trap result once" treat.

## Adding a hardware solver

A real-hardware backend is just another adapter: a `Solver` with `paradigm="quantum-hardware"` whose
`run(...)` submits the circuit and returns the same `Trace` shape with the `ran_on` badge. Nothing else in
the engine or web changes (see [../architecture/02_problem-solver-engine.md](../architecture/02_problem-solver-engine.md)).
