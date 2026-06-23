import { type ReactNode } from "react";
import { Eq, type TabDef, Tabs } from "../components/Tabs";
import { useUI } from "../lib/ui";

function Honest({ children }: { children: ReactNode }) {
  return <p className="honest-note"><strong>Quantum vs classical — </strong>{children}</p>;
}

function Refs({ items }: { items: string[] }) {
  return (
    <ul className="fine refs-inline">
      {items.map((r, i) => <li key={i}>{r}</li>)}
    </ul>
  );
}

export function Methodology() {
  const { lang } = useUI();
  const en = lang === "en";

  const tabs: TabDef[] = [
    {
      id: "gates",
      label: en ? "Gates & entanglement" : "Compuertas y entrelazamiento",
      content: (
        <div className="method-body">
          <p>{en
            ? "A pure single-qubit state is a point on the Bloch sphere; gates are unitary rotations of it. The Hadamard maps a pole to the equator (superposition); CNOT couples two qubits and creates entanglement that cannot be factored into independent qubit states."
            : "Un estado puro de un qubit es un punto en la esfera de Bloch; las compuertas son rotaciones unitarias. La Hadamard lleva un polo al ecuador (superposición); la CNOT acopla dos qubits y crea entrelazamiento que no se puede factorizar en estados de qubits independientes."}</p>
          <Eq tex={String.raw`H=\tfrac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}\qquad H\lvert0\rangle=\lvert+\rangle=\tfrac{\lvert0\rangle+\lvert1\rangle}{\sqrt2}`} />
          <Eq tex={String.raw`\lvert\Phi^+\rangle=\mathrm{CNOT}\,(H\otimes I)\,\lvert00\rangle=\tfrac{\lvert00\rangle+\lvert11\rangle}{\sqrt2}`} />
          <Honest>{en
            ? "at 2–4 qubits the classical 2ⁿ amplitude vector is instant and exact; entanglement is the concept, not yet an advantage."
            : "con 2–4 qubits el vector clásico de 2ⁿ amplitudes es instantáneo y exacto; el entrelazamiento es el concepto, todavía no una ventaja."}</Honest>
          <Refs items={["Nielsen & Chuang, Quantum Computation and Quantum Information (2010).", "Einstein–Podolsky–Rosen, Phys. Rev. 47, 777 (1935)."]} />
        </div>
      ),
    },
    {
      id: "oracle",
      label: en ? "Oracle algorithms" : "Algoritmos de oráculo",
      content: (
        <div className="method-body">
          <p>{en
            ? "An oracle encodes an unknown function f as a phase: it flips the sign of the marked inputs. Interference across a Hadamard sandwich then reads a global property of f in far fewer queries than reading f entry by entry. Bernstein–Vazirani recovers a hidden string s in one quantum query."
            : "Un oráculo codifica una función desconocida f como fase: invierte el signo de las entradas marcadas. La interferencia en un sándwich de Hadamards lee una propiedad global de f en muchas menos consultas que leerla entrada por entrada. Bernstein–Vazirani recupera una cadena oculta s en una consulta cuántica."}</p>
          <Eq tex={String.raw`U_f\lvert x\rangle=(-1)^{f(x)}\lvert x\rangle\qquad H^{\otimes n}U_f H^{\otimes n}\lvert0\rangle^{\otimes n}=\lvert s\rangle`} />
          <Honest>{en
            ? "BV needs 1 query vs n classical; Simon is exponential (O(n) vs ~2^(n/2)). Real separations — but on contrived oracle problems, not tasks you'd pay for."
            : "BV necesita 1 consulta vs n clásicas; Simon es exponencial (O(n) vs ~2^(n/2)). Separaciones reales — pero en problemas de oráculo artificiales, no tareas que pagarías."}</Honest>
          <Refs items={["Deutsch & Jozsa, Proc. R. Soc. A 439 (1992). doi:10.1098/rspa.1992.0167", "Bernstein & Vazirani, SIAM J. Comput. 26 (1997). doi:10.1137/S0097539796300921", "Simon, SIAM J. Comput. 26 (1997). doi:10.1137/S0097539796298637"]} />
        </div>
      ),
    },
    {
      id: "qft",
      label: "QFT & QPE",
      content: (
        <div className="method-body">
          <p>{en
            ? "The quantum Fourier transform is the change of basis at the heart of the famous speedups. Quantum phase estimation uses it to read the eigenphase φ of a unitary U; Shor's factoring is QPE applied to modular multiplication (order finding), followed by classical continued fractions."
            : "La transformada cuántica de Fourier es el cambio de base en el corazón de las aceleraciones famosas. La estimación cuántica de fase la usa para leer la fase propia φ de un unitario U; la factorización de Shor es QPE aplicada a la multiplicación modular (búsqueda de orden), seguida de fracciones continuas clásicas."}</p>
          <Eq tex={String.raw`\text{QFT}:\ \lvert j\rangle\ \mapsto\ \tfrac{1}{\sqrt N}\sum_{k=0}^{N-1}e^{2\pi i\,jk/N}\lvert k\rangle`} />
          <Eq tex={String.raw`U\lvert\psi\rangle=e^{2\pi i\varphi}\lvert\psi\rangle\ \xrightarrow{\ \text{QPE}\ }\ \hat\varphi\ \text{to } t\text{ bits}`} />
          <Honest>{en
            ? "the QFT is exponentially cheap to apply but its output is unmeasurable directly — it is a subroutine, not a drop-in FFT. Shor's RSA-2048 needs ~10⁶ fault-tolerant qubits (Gidney 2025); a laptop still factors anything you can run here instantly."
            : "la QFT es exponencialmente barata de aplicar pero su salida no es medible directamente — es una subrutina, no un FFT reemplazable. El RSA-2048 de Shor necesita ~10⁶ qubits tolerantes a fallos (Gidney 2025); un laptop aún factoriza al instante lo que corras aquí."}</Honest>
          <Refs items={["Shor, SIAM J. Comput. 26 (1997). doi:10.1137/S0097539795293172", "Gidney, “How to factor 2048-bit RSA integers with less than a million noisy qubits,” arXiv:2505.15917 (2025)."]} />
        </div>
      ),
    },
    {
      id: "qaoa",
      label: "QAOA",
      badge: en ? "learned" : "aprendido",
      content: (
        <div className="method-body">
          <p>{en
            ? "The Quantum Approximate Optimization Algorithm is a hybrid loop: a parameterized circuit alternates a cost-Hamiltonian phase and a mixing rotation; a classical optimizer tunes the angles (γ, β) to maximize the measured cost. For MaxCut the cost counts cut edges."
            : "El Algoritmo de Optimización Aproximada Cuántica es un bucle híbrido: un circuito parametrizado alterna una fase del Hamiltoniano de costo y una rotación de mezcla; un optimizador clásico ajusta los ángulos (γ, β) para maximizar el costo medido. Para MaxCut el costo cuenta aristas cortadas."}</p>
          <Eq tex={String.raw`\lvert\gamma,\beta\rangle=e^{-i\beta H_M}e^{-i\gamma H_C}\lvert+\rangle^{\otimes n}\qquad H_C=\!\!\sum_{(i,j)\in E}\!\!\tfrac{1-Z_iZ_j}{2}`} />
          <Eq tex={String.raw`\max_{\gamma,\beta}\ F(\gamma,\beta)=\langle\gamma,\beta\rvert H_C\lvert\gamma,\beta\rangle`} />
          <Honest>{en
            ? "on every lab graph, exact brute force returns the optimal cut in microseconds and Goemans–Williamson guarantees 0.878×; QAOA (Qiskit and PennyLane agree) matches but never beats it, at far higher cost. The (γ,β) landscape on the App is the real, committed grid."
            : "en cada grafo del lab, la fuerza bruta exacta da el corte óptimo en microsegundos y Goemans–Williamson garantiza 0.878×; QAOA (Qiskit y PennyLane coinciden) lo iguala pero nunca lo supera, a mucho mayor costo. El paisaje (γ,β) en la App es la grilla real commiteada."}</Honest>
          <Refs items={["Farhi, Goldstone & Gutmann, “A Quantum Approximate Optimization Algorithm,” arXiv:1411.4028 (2014).", "Goemans & Williamson, J. ACM 42 (1995). doi:10.1145/227683.227684"]} />
        </div>
      ),
    },
    {
      id: "vqe",
      label: "VQE",
      badge: en ? "learned" : "aprendido",
      content: (
        <div className="method-body">
          <p>{en
            ? "The Variational Quantum Eigensolver finds a molecule's ground-state energy by minimizing the energy expectation of a parameterized ansatz. The variational principle guarantees the estimate never dips below the true ground energy, so the minimum over θ is a rigorous upper bound. QLab runs real H₂ at several bond lengths."
            : "El Solucionador Variacional Cuántico de Autovalores halla la energía del estado fundamental de una molécula minimizando el valor esperado de la energía de un ansatz parametrizado. El principio variacional garantiza que la estimación nunca baja de la energía fundamental real, así que el mínimo sobre θ es una cota superior rigurosa. QLab corre H₂ real a varias distancias de enlace."}</p>
          <Eq tex={String.raw`E(\theta)=\langle\psi(\theta)\rvert H\lvert\psi(\theta)\rangle\ \ge\ E_0\qquad \min_{\theta}E(\theta)`} />
          <Honest>{en
            ? "for H₂ (4 qubits) the Hamiltonian is a 16×16 matrix exact diagonalization (FCI) solves instantly; VQE reaches chemical accuracy everywhere but adds nothing classically. It is pedagogy — and a preview of the barren-plateau problem at scale."
            : "para H₂ (4 qubits) el Hamiltoniano es una matriz 16×16 que la diagonalización exacta (FCI) resuelve al instante; VQE alcanza precisión química en todas partes pero no aporta nada clásicamente. Es pedagogía — y un anticipo del problema de mesetas áridas a escala."}</Honest>
          <Refs items={["Peruzzo et al., “A variational eigenvalue solver…,” Nat. Commun. 5, 4213 (2014). doi:10.1038/ncomms5213", "McClean et al., “Barren plateaus…,” Nat. Commun. 9, 4812 (2018). doi:10.1038/s41467-018-07090-4"]} />
        </div>
      ),
    },
    {
      id: "qml",
      label: en ? "Quantum ML" : "ML cuántico",
      badge: en ? "learned" : "aprendido",
      content: (
        <div className="method-body">
          <p>{en
            ? "A quantum feature map embeds classical data into a high-dimensional Hilbert space; the inner product of two embedded states defines a kernel that a classical SVM can use. The hope is that a hard-to-simulate feature map yields a useful kernel."
            : "Un mapa de características cuántico embebe datos clásicos en un espacio de Hilbert de alta dimensión; el producto interno de dos estados embebidos define un kernel que un SVM clásico puede usar. La esperanza es que un mapa difícil de simular dé un kernel útil."}</p>
          <Eq tex={String.raw`K(x,x')=\bigl\lvert\langle\phi(x)\mid\phi(x')\rangle\bigr\rvert^{2}\qquad \text{SVM in feature space}`} />
          <Honest>{en
            ? "on the lab datasets the quantum-kernel SVM ties or loses to a classical RBF-SVM (moons: 0.875 vs 0.938). No advantage at this scale, and no proven generic advantage — kernel choice, not quantumness, drives most gains."
            : "en los datasets del lab el SVM de kernel cuántico empata o pierde contra un RBF-SVM clásico (moons: 0.875 vs 0.938). Sin ventaja a esta escala, y sin ventaja genérica demostrada — la elección del kernel, no lo cuántico, explica la mayoría de las mejoras."}</Honest>
          <Refs items={["Havlíček et al., “Supervised learning with quantum-enhanced feature spaces,” Nature 567 (2019). doi:10.1038/s41586-019-0980-2", "Schuld & Killoran, Phys. Rev. Lett. 122, 040504 (2019). doi:10.1103/PhysRevLett.122.040504"]} />
        </div>
      ),
    },
    {
      id: "qec",
      label: en ? "Noise & QEC" : "Ruido y QEC",
      content: (
        <div className="method-body">
          <p>{en
            ? "Real devices are noisy. Error mitigation (zero-noise extrapolation) reduces bias on a single circuit by amplifying noise and extrapolating to zero. Error correction instead encodes one logical qubit across many physical ones; below a threshold, increasing the code distance makes the logical error fall."
            : "Los dispositivos reales tienen ruido. La mitigación de errores (extrapolación a ruido cero) reduce el sesgo en un circuito amplificando el ruido y extrapolando a cero. La corrección de errores en cambio codifica un qubit lógico en muchos físicos; bajo un umbral, aumentar la distancia del código hace caer el error lógico."}</p>
          <Eq tex={String.raw`\text{depolarizing}:\ \rho\ \mapsto\ (1-p)\,\rho+p\,\tfrac{I}{2^{n}}`} />
          <Eq tex={String.raw`\text{ZNE}:\ \langle O\rangle(\lambda)\big|_{\lambda=1,3,5}\ \xrightarrow{\ \text{fit}\ }\ \langle O\rangle(\lambda{=}0)`} />
          <Honest>{en
            ? "ZNE cuts the error but is bias-reduction, NOT correction, and its sampling cost grows exponentially. QEC genuinely scales (Google Willow crossed threshold, 2024) — but that was one logical qubit, ~8 orders from useful. A noiseless simulator gives the exact answer for free at lab scale."
            : "ZNE recorta el error pero es reducción de sesgo, NO corrección, y su costo de muestreo crece exponencialmente. La QEC sí escala (Google Willow cruzó el umbral, 2024) — pero fue un qubit lógico, a ~8 órdenes de ser útil. Un simulador sin ruido da la respuesta exacta gratis a escala de lab."}</Honest>
          <Refs items={["Temme, Bravyi & Gambetta, Phys. Rev. Lett. 119, 180509 (2017). doi:10.1103/PhysRevLett.119.180509", "Google Quantum AI, Nature 638 (2024). doi:10.1038/s41586-024-08449-y", "Fowler et al., Phys. Rev. A 86, 032324 (2012). doi:10.1103/PhysRevA.86.032324"]} />
        </div>
      ),
    },
  ];

  return (
    <div className="page doc-page">
      <div className="page-head">
        <h1>{en ? "Methodology" : "Metodología"}</h1>
        <p className="lede">
          {en
            ? "One sub-tab per method family — the formulation, the core math term by term, and the honest quantum-vs-classical verdict, with sourced references. Three families are learned (variational): QAOA, VQE and quantum ML."
            : "Una sub-pestaña por familia de método — la formulación, la matemática central término a término, y el veredicto honesto cuántico-vs-clásico, con referencias citadas. Tres familias son aprendidas (variacionales): QAOA, VQE y ML cuántico."}
        </p>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}
