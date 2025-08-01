import { useState } from "react";
import Loader from "../Loader";
import FourColumnsTable from "../FourColumnsTable";
import DistanceColumnsTable from "../DistanceColumnsTable";
import EdgePartitions from "../EdgePartitions";

const APILINK = "https://vpqebjeug2dtqoi3exx6nlfdta0jnxyl.lambda-url.us-east-1.on.aws";

function HomeTab() {
  const [file, setFile] = useState(null);
  const [values, setValues] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const [showTextarea, setShowTextarea] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Graph Information");

  const onFileChange = (event) => setFile(event.target.files[0]);
  const handleSelectChange = (e) => setSelectedOption(e.target.value);
  const handleTextareaChange = (e) => setTextareaValue(e.target.value);
  const handleTextareaToggle = () => setShowTextarea(!showTextarea);

  const convertMatrixToList = (matrix) => {
    const adj = {};
    matrix.forEach((row, i) => {
      adj[i + 1] = row.reduce((acc, val, j) => (val === 1 ? [...acc, j + 1] : acc), []);
    });
    return adj;
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (textareaValue) {
      const jsonString = textareaValue.match(/=\s*(\[.*\])/)[1];
      formData.append("textareaData", JSON.stringify(convertMatrixToList(JSON.parse(jsonString))));
    }
    formData.append("file", file);

    setError(false);
    setLoading(true);
    try {
      const ep =
        selectedOption === "Degree-Based Indices"
          ? "degree_based"
          : selectedOption === "Distance-Based Indices"
          ? "distance_based"
          : "graph_information";
      const res = await fetch(`${APILINK}/${ep}`, { method: "POST", body: formData });
      const data = await res.json();
      setValues(data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8 flex items-center justify-center space-x-4">
        <img src="logo.png" alt="ChemGraphX Logo" style={{ width: 200, height: 143 }} />
        <h2 className="text-blue-600 text-5xl">ChemGraphX</h2>
      </div>
      <p className="text-center text-blue-600 mb-6 -mt-5 text-lg">
        A web-based tool for computing topological invariants of chemical and general networks
      </p>

      {/* Descriptive paragraph */}
      <div className="max-w-4xl mx-auto mt-4">
        <p className="text-gray-700 text-justify leading-tight text-[18px] mb-8">
          <strong>ChemGraphX</strong> is an open-source, web-based tool specifically designed to compute various matrices, including degree-based and distance-based indices along with their entropy measures, for both molecular and general graphs. The tool supports four distinct input methods, two of which are tailored for chemical applications, and the remaining two are for general graph analysis.
        </p>
      </div>

      {/* Upload Form */}
      <form onSubmit={onFormSubmit} className="bg-white p-8 rounded-4xl shadow-lg w-full px-[2cm]">
        <h2 className="text-xl font-semibold mb-6">Choose input format:</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {["mol", "pdb", "adj-list", "textarea"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                if (type === "mol") document.getElementById("mol").click();
                else if (type === "pdb") document.getElementById("pdb").click();
                else if (type === "adj-list") document.getElementById("adj-list").click();
                else handleTextareaToggle();
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl"
            >
              {type === "mol"
                ? "MOL file"
                : type === "pdb"
                ? "PDB file"
                : type === "adj-list"
                ? "Adjacency list"
                : "Adjacency matrix"}
            </button>
          ))}
        </div>
        <input id="mol" type="file" accept=".mol" onChange={onFileChange} className="hidden" />
        <input id="pdb" type="file" accept=".pdb" onChange={onFileChange} className="hidden" />
        <input id="adj-list" type="file" accept=".txt" onChange={onFileChange} className="hidden" />
        {showTextarea && (
          <textarea
            className="w-full h-32 border-2 border-gray-300 p-2 rounded-md mb-4"
            value={textareaValue}
            onChange={handleTextareaChange}
            placeholder="Paste adjacency matrix here"
          />
        )}
        <select
          value={selectedOption}
          onChange={handleSelectChange}
          className="border-black border-2 rounded-xl w-full py-2 px-4 mb-6"
        >
          <option>Graph Information</option>
          <option>Degree-Based Indices</option>
          <option>Distance-Based Indices</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-xl"
        >
          Upload
        </button>
        {file && <p className="text-blue-800 mt-2">Uploaded file: {file.name}</p>}
      </form>

      {/* Output */}
      {error && <h2 className="text-red-600 mt-4">Error computing values</h2>}
      {loading && <Loader className="mt-4" />}
      {!loading && !error && values && (
        <div className="w-full px-[2cm] mt-8">
          {selectedOption === "Degree-Based Indices" ? (
            <FourColumnsTable values={values.four_columns} timeTaken={values.time_taken} />
          ) : selectedOption === "Distance-Based Indices" ? (
            <DistanceColumnsTable
              distance_indices={values["Distance Indices"]}
              distance_entropies={values["Distance Entropies"]}
              timeTaken={values.time_taken}
            />
          ) : (
            <EdgePartitions
              edgeCount={values["Edge Count"]}
              vertexCount={values["Vertices Count"]}
              energy={values["Energy"]}
              degreeEdgePartitions={values["Degree Edge Partitions"]}
              degreeEdgeCounts={values["Degree Edge Counts"]}
              degreeSumEdgePartitions={values["Degree Sum Edge Partitions"]}
              degreeSumEdgeCounts={values["Degree Sum Edge Counts"]}
              timeTaken={values.time_taken}
            />
          )}
        </div>
      )}

      {/* How to Cite Section */}
      <div className="bg-white shadow-md rounded-3xl p-6 text-left max-w-4xl mx-auto mt-8">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">How to Cite:</h3>
        <p className="text-gray-700 leading-relaxed">
          J. Clement, K. Jacob, M. Arockiaraj, A. Jindal, <strong>ChemGraphX:</strong> A web-based tool for computing topological invariants of chemical and general networks <em>SoftwareX</em>, (Submitted).
        </p>
      </div>
    </div>
  );
}

export default HomeTab;
