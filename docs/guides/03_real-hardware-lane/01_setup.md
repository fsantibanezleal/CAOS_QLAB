# 03 · The real-hardware lane (optional, opt-in): 01 · Setup

## Setup

```bash
.venv/bin/python -m pip install -r requirements-hardware.txt   # qiskit-ibm-runtime (+ braket/azure, optional)
cp .env.example .env                                            # then paste your token (never commit .env)
python tools/check_backends.py                                  # confirms the token reaches IBM + lists devices
```

Run a case on real hardware (opt-in, it never runs in a default `--all`):

```bash
python data-pipeline/run.py bernstein-vazirani --instance bv-101 --solver ibm-hardware
```

Back to [03 · The real-hardware lane (optional, opt-in)](../03_real-hardware-lane.md).
