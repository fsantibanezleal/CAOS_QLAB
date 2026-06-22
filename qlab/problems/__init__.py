"""Problem catalog. Importing this package registers every problem (one import line per module).
Adding a problem = add its module here; nothing else changes.
"""

from qlab.problems import (  # noqa: F401  (import = registration)
    bernstein_vazirani,
    deutsch_jozsa,
    grover,
    maxcut,
    qft,
    qpe,
    simon,
    state_prep,
)

__all__ = ["state_prep", "maxcut", "bernstein_vazirani", "deutsch_jozsa", "simon", "grover", "qft", "qpe"]
