# 03 · The real-hardware lane (optional, opt-in)

Run a case on a **real quantum computer** and commit the returned counts as a trace with a `ran_on`
provenance badge. This is the *"this actually ran on a 156-qubit quantum computer"* moment.

> **Off by default.** This lane runs **locally** with your own token in `.env`; the published static
> site ships no secrets and makes no live hardware calls. It is gated on an account/tier decision.

> **Wired now (v0.05.000).** The opt-in `ibm-hardware` solver (`qversus.solvers.hardware_solvers`) is in the
> engine and dormant until a token exists. Validate connectivity any time (free, only IBM is pinged):
> `python tools/check_backends.py` (or `scripts/check-backends.{ps1,sh}`).

## Read in order

1. [01 · Setup](./03_real-hardware-lane/01_setup.md).
2. [02 · IBM Quantum Open (the recommended free path)](./03_real-hardware-lane/02_ibm-quantum-open.md).
3. [03 · Costs (the honest reality)](./03_real-hardware-lane/03_costs.md).
4. [04 · Adding a hardware solver](./03_real-hardware-lane/04_adding-a-hardware-solver.md).
