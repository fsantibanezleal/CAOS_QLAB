// Reference integrity per ADR-0017 §4 / ADR-0016 §7.
// Every entry MUST carry a real, verifiable `doi` (preferred) or `url`. A bare
// author-year with no link is a FAIL (it reads as fabricated). DOI-verified.
//
// id convention: authorYYYY[suffix] — lowercase, no spaces.

export interface Citation {
  id: string;
  /** Short author-year label shown inline, e.g. "Nielsen & Chuang 2010". */
  label: string;
  /** Full bibliographic string (authors, title, venue, year). */
  citation: string;
  /** Preferred — a DOI (bare, e.g. "10.1038/…"). */
  doi?: string;
  /** Fallback — only for standards / books / software with no DOI. */
  url?: string;
}

export const CITATIONS: Citation[] = [
  // ── Foundations ──────────────────────────────────────────────────────────
  {
    id: "nielsen2010",
    label: "Nielsen & Chuang 2010",
    citation:
      "M. A. Nielsen & I. L. Chuang, Quantum Computation and Quantum Information (10th Anniversary Ed.), Cambridge University Press, 2010.",
    doi: "10.1017/CBO9780511976667",
  },
  {
    id: "feynman1982",
    label: "Feynman 1982",
    citation:
      "R. P. Feynman, “Simulating physics with computers,” International Journal of Theoretical Physics 21, 467–488 (1982).",
    doi: "10.1007/BF02650179",
  },
  {
    id: "feynman1965",
    label: "Feynman, Leighton & Sands 1965",
    citation:
      "R. P. Feynman, R. B. Leighton & M. Sands, The Feynman Lectures on Physics, Vol. III: Quantum Mechanics, Addison-Wesley, 1965.",
    url: "https://www.feynmanlectures.caltech.edu/III_toc.html",
  },
  {
    id: "epr1935",
    label: "EPR 1935",
    citation:
      "A. Einstein, B. Podolsky & N. Rosen, “Can quantum-mechanical description of physical reality be considered complete?,” Physical Review 47, 777 (1935).",
    doi: "10.1103/PhysRev.47.777",
  },
  {
    id: "bell1964",
    label: "Bell 1964",
    citation:
      "J. S. Bell, “On the Einstein Podolsky Rosen paradox,” Physics Physique Физика 1, 195 (1964).",
    doi: "10.1103/PhysicsPhysiqueFizika.1.195",
  },
  {
    id: "chsh1969",
    label: "CHSH 1969",
    citation:
      "J. F. Clauser, M. A. Horne, A. Shimony & R. A. Holt, “Proposed experiment to test local hidden-variable theories,” Physical Review Letters 23, 880 (1969).",
    doi: "10.1103/PhysRevLett.23.880",
  },

  // ── Oracle / interference algorithms ─────────────────────────────────────
  {
    id: "deutsch1992",
    label: "Deutsch & Jozsa 1992",
    citation:
      "D. Deutsch & R. Jozsa, “Rapid solution of problems by quantum computation,” Proceedings of the Royal Society A 439, 553–558 (1992).",
    doi: "10.1098/rspa.1992.0167",
  },
  {
    id: "bernstein1997",
    label: "Bernstein & Vazirani 1997",
    citation:
      "E. Bernstein & U. Vazirani, “Quantum complexity theory,” SIAM Journal on Computing 26, 1411–1473 (1997).",
    doi: "10.1137/S0097539796300921",
  },
  {
    id: "simon1997",
    label: "Simon 1997",
    citation:
      "D. R. Simon, “On the power of quantum computation,” SIAM Journal on Computing 26, 1474–1483 (1997).",
    doi: "10.1137/S0097539796298637",
  },

  {
    id: "dvc2000",
    label: "Dür, Vidal & Cirac 2000",
    citation:
      "W. Dür, G. Vidal & J. I. Cirac, “Three qubits can be entangled in two inequivalent ways,” Physical Review A 62, 062314 (2000).",
    doi: "10.1103/PhysRevA.62.062314",
  },
  {
    id: "holevo1973",
    label: "Holevo 1973",
    citation:
      "A. S. Holevo, “Bounds for the quantity of information transmitted by a quantum communication channel,” Problemy Peredachi Informatsii 9(3), 3–11 (1973).",
    url: "https://www.mathnet.ru/eng/ppi903",
  },

  // ── Flagship algorithms ──────────────────────────────────────────────────
  {
    id: "coppersmith1994",
    label: "Coppersmith 1994",
    citation:
      "D. Coppersmith, “An approximate Fourier transform useful in quantum factoring,” IBM Research Report RC19642 (1994); arXiv:quant-ph/0201067.",
    url: "https://arxiv.org/abs/quant-ph/0201067",
  },
  {
    id: "kitaev1995",
    label: "Kitaev 1995",
    citation:
      "A. Yu. Kitaev, “Quantum measurements and the Abelian Stabilizer Problem,” arXiv:quant-ph/9511026 (1995).",
    url: "https://arxiv.org/abs/quant-ph/9511026",
  },
  {
    id: "grover1996",
    label: "Grover 1996",
    citation:
      "L. K. Grover, “A fast quantum mechanical algorithm for database search,” Proc. 28th ACM STOC, 212–219 (1996).",
    doi: "10.1145/237814.237866",
  },
  {
    id: "shor1997",
    label: "Shor 1997",
    citation:
      "P. W. Shor, “Polynomial-time algorithms for prime factorization and discrete logarithms on a quantum computer,” SIAM Journal on Computing 26, 1484–1509 (1997).",
    doi: "10.1137/S0097539795293172",
  },
  {
    id: "gidney2025",
    label: "Gidney 2025",
    citation:
      "C. Gidney, “How to factor 2048-bit RSA integers with less than a million noisy qubits,” arXiv:2505.15917 (2025).",
    url: "https://arxiv.org/abs/2505.15917",
  },

  // ── Variational / QML ────────────────────────────────────────────────────
  {
    id: "farhi2014",
    label: "Farhi, Goldstone & Gutmann 2014",
    citation:
      "E. Farhi, J. Goldstone & S. Gutmann, “A Quantum Approximate Optimization Algorithm,” arXiv:1411.4028 (2014).",
    url: "https://arxiv.org/abs/1411.4028",
  },
  {
    id: "goemans1995",
    label: "Goemans & Williamson 1995",
    citation:
      "M. X. Goemans & D. P. Williamson, “Improved approximation algorithms for maximum cut and satisfiability problems using semidefinite programming,” Journal of the ACM 42, 1115–1145 (1995).",
    doi: "10.1145/227683.227684",
  },
  {
    id: "barak2021",
    label: "Barak & Marwaha 2021",
    citation:
      "B. Barak & K. Marwaha, “Classical algorithms and quantum limitations for maximum cut on high-girth graphs,” arXiv:2106.05900 (2021).",
    url: "https://arxiv.org/abs/2106.05900",
  },
  {
    id: "peruzzo2014",
    label: "Peruzzo et al. 2014",
    citation:
      "A. Peruzzo et al., “A variational eigenvalue solver on a photonic quantum processor,” Nature Communications 5, 4213 (2014).",
    doi: "10.1038/ncomms5213",
  },
  {
    id: "mcclean2018",
    label: "McClean et al. 2018",
    citation:
      "J. R. McClean, S. Boixo, V. N. Smelyanskiy, R. Babbush & H. Neven, “Barren plateaus in quantum neural network training landscapes,” Nature Communications 9, 4812 (2018).",
    doi: "10.1038/s41467-018-07090-4",
  },
  {
    id: "mcardle2020",
    label: "McArdle et al. 2020",
    citation:
      "S. McArdle, S. Endo, A. Aspuru-Guzik, S. C. Benjamin & X. Yuan, “Quantum computational chemistry,” Reviews of Modern Physics 92, 015003 (2020).",
    doi: "10.1103/RevModPhys.92.015003",
  },
  {
    id: "huang2021",
    label: "Huang et al. 2021",
    citation:
      "H.-Y. Huang et al., “Power of data in quantum machine learning,” Nature Communications 12, 2631 (2021).",
    doi: "10.1038/s41467-021-22539-9",
  },
  {
    id: "havlicek2019",
    label: "Havlíček et al. 2019",
    citation:
      "V. Havlíček et al., “Supervised learning with quantum-enhanced feature spaces,” Nature 567, 209–212 (2019).",
    doi: "10.1038/s41586-019-0980-2",
  },
  {
    id: "schuld2019",
    label: "Schuld & Killoran 2019",
    citation:
      "M. Schuld & N. Killoran, “Quantum machine learning in feature Hilbert spaces,” Physical Review Letters 122, 040504 (2019).",
    doi: "10.1103/PhysRevLett.122.040504",
  },

  // ── Noise, mitigation & error correction ─────────────────────────────────
  {
    id: "preskill2018",
    label: "Preskill 2018",
    citation:
      "J. Preskill, “Quantum Computing in the NISQ era and beyond,” Quantum 2, 79 (2018).",
    doi: "10.22331/q-2018-08-06-79",
  },
  {
    id: "temme2017",
    label: "Temme, Bravyi & Gambetta 2017",
    citation:
      "K. Temme, S. Bravyi & J. M. Gambetta, “Error mitigation for short-depth quantum circuits,” Physical Review Letters 119, 180509 (2017).",
    doi: "10.1103/PhysRevLett.119.180509",
  },
  {
    id: "giurgicatiron2020",
    label: "Giurgica-Tiron et al. 2020",
    citation:
      "T. Giurgica-Tiron, Y. Hindy, R. LaRose, A. Mari & W. J. Zeng, “Digital zero noise extrapolation for quantum error mitigation,” Proc. IEEE Int. Conf. on Quantum Computing and Engineering (QCE), 306–316 (2020); arXiv:2005.10921.",
    doi: "10.1109/QCE49297.2020.00045",
  },
  {
    id: "fowler2012",
    label: "Fowler et al. 2012",
    citation:
      "A. G. Fowler, M. Mariantoni, J. M. Martinis & A. N. Cleland, “Surface codes: Towards practical large-scale quantum computation,” Physical Review A 86, 032324 (2012).",
    doi: "10.1103/PhysRevA.86.032324",
  },
  {
    id: "google2024willow",
    label: "Google Quantum AI 2024 (Willow)",
    citation:
      "Google Quantum AI, “Quantum error correction below the surface code threshold,” Nature 638, 920–926 (2024).",
    doi: "10.1038/s41586-024-08449-y",
  },
  {
    id: "kim2023",
    label: "Kim et al. 2023",
    citation:
      "Y. Kim et al., “Evidence for the utility of quantum computing before fault tolerance,” Nature 618, 500–505 (2023).",
    doi: "10.1038/s41586-023-06096-3",
  },

  {
    id: "bennett1993",
    label: "Bennett et al. 1993",
    citation:
      "C. H. Bennett et al., “Teleporting an unknown quantum state via dual classical and Einstein-Podolsky-Rosen channels,” Physical Review Letters 70, 1895 (1993).",
    doi: "10.1103/PhysRevLett.70.1895",
  },
  {
    id: "bennett1992",
    label: "Bennett & Wiesner 1992",
    citation:
      "C. H. Bennett & S. J. Wiesner, “Communication via one- and two-particle operators on Einstein-Podolsky-Rosen states,” Physical Review Letters 69, 2881 (1992).",
    doi: "10.1103/PhysRevLett.69.2881",
  },
  {
    id: "arute2019",
    label: "Arute et al. 2019",
    citation:
      "F. Arute et al., “Quantum supremacy using a programmable superconducting processor,” Nature 574, 505–510 (2019).",
    doi: "10.1038/s41586-019-1666-5",
  },
  {
    id: "reiher2017",
    label: "Reiher et al. 2017",
    citation:
      "M. Reiher, N. Wiebe, K. M. Svore, D. Wecker & M. Troyer, “Elucidating reaction mechanisms on quantum computers,” Proceedings of the National Academy of Sciences 114, 7555–7560 (2017).",
    doi: "10.1073/pnas.1619152114",
  },

  // ── Statistical-learning / held-out-evaluation methodology ───────────────
  {
    id: "cortes1995",
    label: "Cortes & Vapnik 1995",
    citation:
      "C. Cortes & V. Vapnik, “Support-vector networks,” Machine Learning 20, 273–297 (1995).",
    doi: "10.1007/BF00994018",
  },
  {
    id: "stone1974",
    label: "Stone 1974",
    citation:
      "M. Stone, “Cross-validatory choice and assessment of statistical predictions,” Journal of the Royal Statistical Society: Series B 36, 111–147 (1974).",
    doi: "10.1111/j.2517-6161.1974.tb00994.x",
  },
  {
    id: "kohavi1995",
    label: "Kohavi 1995",
    citation:
      "R. Kohavi, “A study of cross-validation and bootstrap for accuracy estimation and model selection,” Proc. 14th Int. Joint Conf. on Artificial Intelligence (IJCAI), 1137–1143 (1995).",
    url: "https://dl.acm.org/doi/10.5555/1643031.1643047",
  },
  {
    id: "hastie2009",
    label: "Hastie, Tibshirani & Friedman 2009",
    citation:
      "T. Hastie, R. Tibshirani & J. Friedman, The Elements of Statistical Learning (2nd ed.), §7 (Model Assessment and Selection), Springer (2009).",
    doi: "10.1007/978-0-387-84858-7",
  },

  // ── Standards / software / vendor (url-only by nature) ────────────────────
  {
    id: "qiskit2024",
    label: "Qiskit 2024",
    citation:
      "Qiskit contributors, Qiskit: An Open-source Framework for Quantum Computing (and Qiskit Aer high-performance simulator).",
    url: "https://www.ibm.com/quantum/qiskit",
  },
  {
    id: "pennylane2018",
    label: "Bergholm et al. 2018 (PennyLane)",
    citation:
      "V. Bergholm et al., “PennyLane: Automatic differentiation of hybrid quantum-classical computations,” arXiv:1811.04968 (2018).",
    url: "https://arxiv.org/abs/1811.04968",
  },
  {
    id: "gidney2021stim",
    label: "Gidney 2021 (Stim)",
    citation:
      "C. Gidney, “Stim: a fast stabilizer circuit simulator,” Quantum 5, 497 (2021).",
    doi: "10.22331/q-2021-07-06-497",
  },
  {
    id: "gottesman1998",
    label: "Gottesman 1998",
    citation:
      "D. Gottesman, “The Heisenberg representation of quantum computers,” in Group22: Proc. XXII Int. Colloquium on Group Theoretical Methods in Physics, 32–43 (1999); arXiv:quant-ph/9807006.",
    url: "https://arxiv.org/abs/quant-ph/9807006",
  },
  {
    id: "aaronson2004",
    label: "Aaronson & Gottesman 2004",
    citation:
      "S. Aaronson & D. Gottesman, “Improved simulation of stabilizer circuits,” Physical Review A 70, 052328 (2004).",
    doi: "10.1103/PhysRevA.70.052328",
  },
  {
    id: "higgott2022",
    label: "Higgott & Gidney 2022 (PyMatching)",
    citation:
      "O. Higgott & C. Gidney, “PyMatching v2: A fast and flexible minimum-weight perfect matching decoder,” arXiv:2303.15933 (2022).",
    url: "https://arxiv.org/abs/2303.15933",
  },
  {
    id: "jones2019quest",
    label: "Jones et al. 2019 (QuEST)",
    citation:
      "T. Jones, A. Brown, I. Bush & S. C. Benjamin, “QuEST and high performance simulation of quantum computers,” Scientific Reports 9, 10736 (2019).",
    doi: "10.1038/s41598-019-47174-9",
  },
  {
    id: "knuth1997",
    label: "L’Ecuyer & PCG (deterministic RNG)",
    citation:
      "M. E. O’Neill, “PCG: A family of simple fast space-efficient statistically good algorithms for random number generation,” HMC-CS-2014-0905 (2014) — the bit-generator family underlying NumPy’s default_rng.",
    url: "https://www.pcg-random.org/paper.html",
  },
  {
    id: "ecma404",
    label: "ECMA-404 (JSON)",
    citation:
      "ECMA International, “The JSON Data Interchange Syntax,” Standard ECMA-404, 2nd edition (2017).",
    url: "https://www.ecma-international.org/publications-and-standards/standards/ecma-404/",
  },
];

/** Map for O(1) lookups by id. */
export const CITATION_BY_ID: Record<string, Citation> = Object.fromEntries(
  CITATIONS.map((c) => [c.id, c]),
);
