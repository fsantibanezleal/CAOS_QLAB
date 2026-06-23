"""CAOS_QLAB — a public, didactic quantum-computing laboratory.

The engine `core` is pure-Python + NumPy (the trace schema, the seeded RNG, the live/precompute gate,
the manifest contract). The cases author their circuits with the *real* dedicated engines (Qiskit + Aer,
PennyLane, Stim) in the offline precompute pipeline; the committed JSON trace is the contract the static
web app replays. See docs/architecture.md.
"""

__version__ = "0.24.0"  # display version 0.24.000 — see CHANGELOG.md
