"""Seeded RNG. A QLab run is a pure function of (params, seed): same seed → byte-identical trace.

Measurement sampling (shot histograms) is the only stochastic step in the pipeline; everything else
(statevector evolution) is deterministic. We route all sampling through one seeded NumPy Generator so the
committed counts reproduce exactly.
"""

from __future__ import annotations

import numpy as np

DEFAULT_SEED = 42


def make_rng(seed: int = DEFAULT_SEED) -> np.random.Generator:
    """Return a NumPy Generator seeded deterministically (PCG64)."""
    return np.random.default_rng(seed)


def sample_counts(probabilities: np.ndarray, shots: int, seed: int = DEFAULT_SEED) -> dict[str, int]:
    """Sample `shots` measurements from a probability vector over 2**n basis states.

    Returns a {bitstring: count} dict (big-endian bitstrings, qubit 0 = leftmost), omitting zero counts.
    """
    n_states = len(probabilities)
    n_qubits = int(np.log2(n_states))
    rng = make_rng(seed)
    # Guard against tiny negative/round-off so np.random.choice accepts the vector.
    p = np.clip(np.asarray(probabilities, dtype=float), 0.0, None)
    p = p / p.sum()
    draws = rng.choice(n_states, size=shots, p=p)
    counts: dict[str, int] = {}
    for idx, c in zip(*np.unique(draws, return_counts=True)):
        bitstring = format(int(idx), f"0{n_qubits}b")
        counts[bitstring] = int(c)
    return dict(sorted(counts.items()))
