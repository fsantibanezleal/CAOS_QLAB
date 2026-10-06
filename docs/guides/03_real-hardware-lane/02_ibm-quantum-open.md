# 03 · The real-hardware lane (optional, opt-in): 02 · IBM Quantum Open (the recommended free path)

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
the **noisy real-hardware histogram next to the ideal simulator**, the most honest possible noise lesson.

Back to [03 · The real-hardware lane (optional, opt-in)](../03_real-hardware-lane.md).
