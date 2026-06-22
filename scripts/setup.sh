#!/usr/bin/env bash
# CAOS_QLAB — create the local Python .venv and install deps (macOS / Linux / Git-Bash).
set -euo pipefail
cd "$(dirname "$0")/.."

PY="${PYTHON:-python3}"
if [ ! -d ".venv" ]; then
  echo "Creating .venv..."
  "$PY" -m venv .venv
fi
VENV_PY=".venv/bin/python"
[ -x "$VENV_PY" ] || VENV_PY=".venv/Scripts/python.exe"  # Git-Bash on Windows

"$VENV_PY" -m pip install --upgrade pip
# Core (live/Pyodide-thin engine) + dev tooling + the dedicated precompute engines (Qiskit + qiskit-aer,
# PennyLane, ...) the cases use to generate the committed statevector/measurement traces.
"$VENV_PY" -m pip install -r requirements.txt -r requirements-dev.txt -r requirements-precompute.txt

echo
echo "Optional real-hardware lane (qiskit-ibm-runtime / amazon-braket-sdk / azure-quantum):"
echo "  $VENV_PY -m pip install -r requirements-hardware.txt   # see docs/guides/03_real-hardware-lane.md"
echo "  (needs a token in .env — copy .env.example; tokens live in the CAOS_MANAGE vault)"
echo
echo "Ready. Next:"
echo "  $VENV_PY -m pytest                  # run the tests"
echo "  ./scripts/precompute.sh c01_bell    # build the Bell-state trace + manifest"
