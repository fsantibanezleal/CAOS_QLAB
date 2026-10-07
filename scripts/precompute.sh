#!/usr/bin/env bash
# Run the precompute pipeline. Pass-through args, e.g.:  ./scripts/precompute.sh state-prep --all
set -euo pipefail
cd "$(dirname "$0")/.."
VENV_PY=".venv/bin/python"
[ -x "$VENV_PY" ] || VENV_PY=".venv/Scripts/python.exe"
"$VENV_PY" data-pipeline/run.py "$@"
