# Run the precompute pipeline. Pass-through args, e.g.:  .\scripts\precompute.ps1 c01_bell --seed 7
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
& ".\.venv\Scripts\python.exe" -m qlab.pipeline @args
