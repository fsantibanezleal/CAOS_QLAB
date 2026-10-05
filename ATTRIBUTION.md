# Attribution

CAOS_QLAB, a CAOS research investigation by **Felipe Santibáñez-Leal**.

## Frameworks & engines

QLab is a teaching layer over the real quantum-computing ecosystem. It claims no novelty in the engines;
its value is the honest, comparative curriculum and the uniform Problem × Solver harness around them, which
is published separately as the **qversus** engine (MIT, https://github.com/fsantibanezleal/CAOS_QVersus).

Used to author the committed traces (pinned in `requirements-precompute.txt`):

- **Qiskit** & **qiskit-aer**: IBM Quantum. https://www.ibm.com/quantum/qiskit
- **PennyLane**: Xanadu. https://pennylane.ai
- **Cirq** (`cirq-core`): Google Quantum AI. https://quantumai.google
- **Stim**: Craig Gidney / Google Quantum AI; **PyMatching**: Oscar Higgott and Craig Gidney.
- **scikit-learn** and **NumPy**: the classical baselines.

On the roadmap, not wired: **pytket / TKET** (Quantinuum), **Qulacs** (QunaSys et al.), **OpenFermion**
(Google Quantum AI), **Mitiq** (Unitary Foundation; GPL-3.0).

## Didactic & scientific sources

Case content draws on standard references (each cited inline in the app and the docs with a real DOI/URL):
Nielsen & Chuang (2010); the Qiskit Textbook / IBM Quantum Learning; PennyLane demos; Farhi–Goldstone–Gutmann
QAOA (2014); Goemans–Williamson (1995); the hardware/limits literature catalogued in
[docs/state-of-the-art.md](docs/state-of-the-art.md).

## In-browser (web SPA)

- **React** + **react-router-dom** + **Vite** (MIT): the static single-page app.
- **KaTeX** (MIT): typeset display equations on the Methodology page.
- The live lane's exact state-vector simulator is QLab's own TypeScript (`web/src/live/statevector.ts`); no
  third-party quantum library runs in the browser.
- The Bloch sphere / circuit / landscape / ZNE viz are hand-rolled SVG (no third-party chart lib).

Synthetic or illustrative content is labeled as such throughout. Numbers shown are computed by the engines,
not hand-entered.
