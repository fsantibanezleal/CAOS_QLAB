# CAOS_QLAB: create the local Python .venv and install deps (Windows / PowerShell).
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Test-Path ".venv")) {
    Write-Host "Creating .venv (Python 3.12)..."
    py -3.12 -m venv .venv
}
$py = ".\.venv\Scripts\python.exe"
& $py -m pip install --upgrade pip
# The engine (qversus, from PyPI) + dev tooling + the dedicated precompute frameworks (Qiskit + qiskit-aer,
# PennyLane, ... ). The precompute engines are what the cases actually use to generate the committed
# statevector/measurement traces: see docs/guides/01_precompute-pipeline.md.
& $py -m pip install -r requirements.txt -r requirements-dev.txt -r requirements-precompute.txt

Write-Host ""
Write-Host "Optional real-hardware lane (qiskit-ibm-runtime / amazon-braket-sdk / azure-quantum):"
Write-Host "  $py -m pip install -r requirements-hardware.txt   # see docs/guides/03_real-hardware-lane.md"
Write-Host "  (needs your own provider token in .env, copied from .env.example)"
Write-Host ""
Write-Host "Ready. Next:"
Write-Host "  $py -m pytest                       # run the tests"
Write-Host "  .\scripts\precompute.ps1 state-prep --all   # rebuild the state-prep traces + manifests"
