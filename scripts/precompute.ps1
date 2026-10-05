# Run the precompute pipeline. Pass-through args, e.g.:  .\scripts\precompute.ps1 state-prep --all
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
& ".\.venv\Scripts\python.exe" data-pipeline\run.py @args
