#!/usr/bin/env bash
# Report quantum-backend connectivity from the configured credentials (safe + free; pings only IBM).
set -euo pipefail
cd "$(dirname "$0")/.."
VENV_PY=".venv/bin/python"
[ -x "$VENV_PY" ] || VENV_PY=".venv/Scripts/python.exe"
"$VENV_PY" tools/check_backends.py
