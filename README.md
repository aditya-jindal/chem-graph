# ChemGraphX

ChemGraphX is a web-based computational tool designed to calculate **topological indices (TIs)** and **graph entropies** for both chemical and general networks.

The backend is powered by **Python** (Flask, Flask-CORS, NetworkX, NumPy) and deployed via **AWS** with Gunicorn and AWS Lambda for scalability and efficiency. The frontend is built using **React**, **JavaScript**, and **CSS**, ensuring a responsive and user-friendly experience.

---

## Features

- Calculate **graph information** such as order, size, and degree partitions.
- Compute **degree-based indices and entorpies**.
- Evaluate **distance-based indices and entropies**.
- Support for **chemical graphs** (.mol, .pdb) and **general networks** (adjacency list/matrix).

---

## Input Files

ChemGraphX supports four types of input depending on the graph:

- **Molecular Data File (.mol)**\
  Used for chemical graphs, storing detailed molecular information.\
  Files can be obtained from [ChemSpider](http://www.chemspider.com/) or created with [ChemSketch](http://acdlabs.com/resources/free-chemistry-software-apps/chemsketch-freeware/).

- **Protein Data Bank (.pdb)**\
  Provides 3D experimental structures of macromolecules.\
  Available at [RCSB PDB](https://www.rcsb.org/) or exportable from [CrystalMaker 11](https://www.crystalmaker.com/crystalmaker/download/index.html) and [Chem3D](https://software.stanford.edu/software/chemoffice-professional).

- **Adjacency Matrix**\
  For general networks. Can be generated via [newGraph](https://www.mi.sanu.ac.rs/newgraph/) and pasted directly into ChemGraphX.

- **Adjacency List (.txt)**\
  Manually create and save using a text editor like Notepad.

---

## Workflow

ChemGraphX offers two input options on its homepage:

1. **Upload** `.mol`, `.pdb`, or `.txt` adjacency list files.
2. **Paste Adjacency Matrix** using the provided text area.

After input, choose a computation type from the dropdown:

- **Graph Information** → Basic metrics (order, size, degree partitions).
- **Degree-Based Indices** → Degree indices, sum-based variants, hybrid indices, entropy (Shannon).
- **Distance-Based Indices** → Wiener, Szeged, PI, Mostar-type, weighted variants, entropy (Shannon).

---

## References

1. I. Gutman, O.E. Polansky, *Topological Indices*, in: Mathematical Concepts in Organic Chemistry. Springer, Berlin, Heidelberg (1986).
2. A.D. Hunter, *ACD/ChemSketch 1.0 (freeware); ACD/ChemSketch 2.0 and its tautomers, dictionary, and 3D plug-ins; ACD/HNMR 2.0; ACD/CNMR 2.0*, J. Chem. Educ. 74(8) (1997) 905.
3. D.C. Palmer, *Visualization and analysis of crystal structures using CrystalMaker software*, Z. Kristallogr.- Cryst. Mater. 230(9-10) (2015) 559–572.
4. V. Brankov, D. Stevanovic, *An invitation to newgraph*, Rendiconti del Seminario Matematico di Messina, 25 (2003) 211–216.

---

## Tech Stack

- **Frontend**: React, JavaScript, CSS
- **Backend**: Python (Flask, Flask-CORS, NetworkX, NumPy)
- **Deployment**: AWS (Lambda, S3), Gunicorn

---

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
