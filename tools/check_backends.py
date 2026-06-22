"""Validate quantum-backend connectivity from the configured credentials.

Reads QLab `.env` (if present) + the environment, then reports which providers are configured and — for
IBM Quantum — actually reaches the service and lists devices. Other providers are reported as
"configured" (a live call there can cost money / needs the SDK), so this script is safe + free to run.

    .venv/Scripts/python.exe tools/check_backends.py
    ./scripts/check-backends.sh   /   .\scripts\check-backends.ps1

Exit code 0 always (it is a report, not a gate). Tokens live in the CAOS_MANAGE vault; copy the ones you
want to exercise into QLab `.env` (git-ignored) or export them.
"""

from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())


def _configured(*keys: str) -> bool:
    return all(os.environ.get(k) for k in keys)


def check_ibm() -> tuple[str, str]:
    if not os.environ.get("QISKIT_IBM_TOKEN"):
        return "not configured", "set QISKIT_IBM_TOKEN (free Open Plan: quantum.cloud.ibm.com)"
    try:
        from qiskit_ibm_runtime import QiskitRuntimeService

        svc = QiskitRuntimeService(channel="ibm_quantum_platform",
                                   token=os.environ["QISKIT_IBM_TOKEN"],
                                   instance=os.environ.get("QISKIT_IBM_INSTANCE") or None)
        names = [b.name for b in svc.backends(operational=True, simulator=False)][:5]
        return "REACHABLE", f"devices: {', '.join(names) or '(none operational right now)'}"
    except Exception as exc:  # noqa: BLE001
        return "configured (error)", f"{type(exc).__name__}: {exc}"[:120]


def main() -> None:
    load_dotenv(ROOT / ".env")
    rows = [
        ("IBM Quantum (free Open)", *check_ibm()),
        ("Q-CTRL Fire Opal (free)", "configured" if _configured("QCTRL_API_KEY") else "not configured",
         "free error-suppression tier; verify in the Q-CTRL portal"),
        ("qBraid (free)", "configured" if _configured("QBRAID_API_KEY") else "not configured",
         "multi-backend broker; verify in the qBraid console"),
        ("AWS Braket (low-cost)", "configured" if _configured("AWS_ACCESS_KEY_ID", "AWS_BRAKET_S3_BUCKET")
         else "not configured", "superconducting only; set an AWS Budgets alert"),
        ("Azure Quantum ($500)", "configured" if _configured("AZURE_QUANTUM_WORKSPACE") else "not configured",
         "ion-trap demo only; stay within the one-time credit"),
    ]
    width = max(len(r[0]) for r in rows)
    print("\nQLab backend connectivity\n" + "=" * 60)
    for name, status, detail in rows:
        print(f"  {name:<{width}}  {status:<18}  {detail}")
    print("\nTip: only IBM is pinged live (free); others report config only.\n")


if __name__ == "__main__":
    main()
