"""Problem catalog. Importing this package registers every problem (one import line per module).
Adding a problem = add its module here; nothing else changes.
"""

from qlab.problems import bernstein_vazirani, maxcut, state_prep  # noqa: F401  (import = registration)

__all__ = ["state_prep", "maxcut", "bernstein_vazirani"]
