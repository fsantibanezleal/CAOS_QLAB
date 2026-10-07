# 07 · Quantum Fourier Transform: 04 · The honest verdict

## Honest verdict

> The QFT applies the Fourier transform in **O(n²)** gates vs the classical FFT's **O(n·2ⁿ)**, exponentially
> cheaper to *apply*. But measurement returns one sample, so the transformed amplitudes are unreadable. That
> is precisely why the QFT lives *inside* phase estimation and Shor rather than as a faster spectrum
> calculator, for a readable spectrum, the classical FFT wins. (Validated: fidelity 1.000 vs the analytic DFT.)

Back to [07 · Quantum Fourier Transform](../07_qft.md).
