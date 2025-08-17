const InstructionsTab = () => {
  return (
    <div className="bg-white shadow-lg rounded-4xl p-8 max-w-4xl mx-auto text-justify times-new-roman-font">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Detailed Instructions</h2>
      <p className="mb-6">
        ChemGraphX is a web-based computational tool designed to calculate topological indices (TIs) and graph entropies for both chemical and general networks. The backend is built using Python, leveraging libraries like Flask for handling web requests, Flask-CORS for cross-origin resource sharing, NetworkX for graph theory computations, and NumPy for efficient numerical calculations. Gunicorn serves as the application server, ensuring scalability and performance, with cloud-based deployment managed via Amazon Web Services (AWS) and serverless computing through AWS Lambda. This cloud integration enables real-time processing and high computational efficiency. On the front end, the interface is crafted using CSS, JavaScript, and React, ensuring a dynamic, responsive, and user-friendly experience. The combination of a powerful backend and an intuitive frontend makes ChemGraphX a fast, reliable, and accessible tool for users across various fields.
      </p>

      <h3 className="text-xl font-semibold mb-2">1 Input files</h3>
      <p className="mb-6">
        ChemGraphX offers four input methods, enabling users to select the most appropriate option based on the type of graph they intend to analyze. For chemical graphs, users can upload .mol and .pdb files, while adjacency lists and matrices are available for general network analyses.
      </p>
      <ul className="list-disc list-inside mb-6">
        <li><b>Molecular Data File (.mol)</b>: Used for chemical graphs, storing detailed molecular information. Files can be obtained from open-source platforms like ChemSpider or created with tools such as <a className="text-blue-600 underline" href="http://acdlabs.com/resources/free-chemistry-software-apps/chemsketch-freeware/" target="_blank" rel="noopener noreferrer">ChemSketch</a>.</li>
        <li><b>Protein Data Bank (.pdb)</b>: Provides detailed three-dimensional experimental structures of macromolecules. PDB files are available from resources like RCSB PDB or can be exported from software like <a className="text-blue-600 underline" href="https://www.crystalmaker.com/crystalmaker/download/index.html" target="_blank" rel="noopener noreferrer">CrystalMaker 11</a> and <a className="text-blue-600 underline" href="https://software.stanford.edu/software/chemoffice-professional" target="_blank" rel="noopener noreferrer">Chem3D</a>.</li>
        <li><b>Adjacency Matrix</b>: For general graph analysis, users can generate adjacency matrices using the <a className="text-blue-600 underline" href="https://www.mi.sanu.ac.rs/newgraph/" target="_blank" rel="noopener noreferrer">newGraph</a> software, then copy and paste them directly into ChemGraphX.</li>
        <li><b>Adjacency List (.txt)</b>: Users can manually create adjacency lists for their graphs and save them as a .txt file using a basic text editor like Notepad.</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-2">2 Work flow with ChemGraphX</h3>
      <p className="mb-6">
        ChemGraphX is a user-friendly web application offering two primary input methods on its homepage. The first is an upload area where users can submit .mol, .pdb, or .txt files containing graph adjacency data. The second is a text area, accessible via the "Adjacency Matrix" button, allowing users to directly paste adjacency matrices generated using the newGraph software. After providing input, users can select the desired computation from a drop-down menu featuring three options: Graph Information, Degree-Based Indices, and Distance-Based Indices. The selection generates corresponding results based on the input graph data.
      </p>
      <ul className="list-disc list-inside mb-6">
        <li><b>Graph Information</b>: Delivers key graph metrics including order, size, and various degree-based partitions.</li>
        <li><b>Degree-Based Indices</b>: Computes a range of degree-based indices, their degree sum-based variants, newly introduced hybrid geometric-harmonic-Zagreb indices, and entropy measures using Shannon’s information formula.</li>
        <li><b>Distance-Based Indices</b>: Provides several distance-based indices (e.g., Wiener, Szeged, PI, Mostar-type), their weighted variants, and entropy measures calculated using Shannon’s information formula.</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-2">3 References</h3>
      <ol className="list-decimal list-inside mb-6">
        <li>I. Gutman, O.E. Polansky, Topological Indices. In: Mathematical Concepts in Organic Chemistry. Springer, Berlin, Heidelberg (1986)</li>
        <li>A.D. Hunter, ACD/ChemSketch 1.0 (freeware); ACD/ChemSketch 2.0 and its tautomers, dictionary, and 3D plug-ins; ACD/HNMR 2.0; ACD/CNMR 2.0, J. Chem. Educ. 74(8) (1997) 905.</li>
        <li>D.C. Palmer, Visualization and analysis of crystal structures using CrystalMaker software, Z. Kristallogr.- Cryst. Mater. 230(9-10) (2015) 559–572.</li>
        <li>V. Brankov, D. Stevanovic, An invitation to newgraph, Rendiconti del Seminario Matematico di Messina, 25 (2003) 211–216.</li>
      </ol>
    </div>
  );
};

export default InstructionsTab;
