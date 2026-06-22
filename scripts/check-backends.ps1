# Report quantum-backend connectivity from the configured credentials (safe + free; pings only IBM).
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
& ".\.venv\Scripts\python.exe" tools\check_backends.py
