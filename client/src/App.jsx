import { useState } from "react";
import "./App.css";
import Loader from "./Loader";
import FourColumnsTable from "./FourColumnsTable";
import DistanceColumnsTable from "./DistanceColumnsTable";
import EdgePartitions from "./EdgePartitions";

function App() {
  // const APILINK = "https://chem-graph.onrender.com";
  // const APILINK = "http://localhost:5000";
  const APILINK =
    "https://vpqebjeug2dtqoi3exx6nlfdta0jnxyl.lambda-url.us-east-1.on.aws";

  // const [chartHTML, setChartHTML] = useState("");
  const [file, setFile] = useState(null);
  const [values, setValues] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const [showTextarea, setShowTextarea] = useState(false);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const [selectedOption, setSelectedOption] = useState("Graph Information");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  };
  const handleTextareaToggle = () => {
    setShowTextarea(!showTextarea);
  };
  const convertMatrixToList = (matrix) => {
    const adjacencyList = {};
    for (let i = 0; i < matrix.length; i++) {
      adjacencyList[i + 1] = [];
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          adjacencyList[i + 1].push(j + 1);
        }
      }
    }
    return adjacencyList;
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    const inputString = textareaValue;
    if (inputString) {
      const jsonString = inputString.match(/=\s*(\[.*\])/)[1];
      const matrix = JSON.parse(jsonString);
      const adjacencyList = convertMatrixToList(matrix);
      formData.append("textareaData", JSON.stringify(adjacencyList));
    }
    formData.append("file", file);

    try {
      setError(false);
      setLoading(true);
      const response = await fetch(
        `${APILINK}/${
          selectedOption === "Degree Based Values"
            ? "degree_based"
            : selectedOption === "Distance Based Values"
            ? "distance_based"
            : "graph_information"
        }`,
        {
          method: "POST",
          body: formData,
        }
      );
      console.log(response);
      const data = await response.json();
      console.log(data);
      setValues(data.data);
      // setChartHTML(data.data.graph);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="text-center bg-slate-200 min-h-screen w-screen">
      {/* Header */}
      <div className="bg-blue-800 py-4 text-white flex justify-between px-8 items-center">
        <div className="font-bold text-xl">
          ChemGraph
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Instructions
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
        {/* <div className="text-xl font-bold">
          <span className="rounded-full bg-white text-blue-800 px-4 py-2">
            KJ
          </span>
        </div> */}
      </div>

      {/* Main Content */}
      <div className="py-16">
        <h1 className="text-4xl font-bold mb-8 text-blue-800">ChemGraph</h1>

        {/* Form Section */}
        <form
          onSubmit={onFormSubmit}
          className="bg-white p-8 rounded-lg shadow-md mx-auto max-w-4xl"
        >
          <p className="text-xl font-semibold mb-4 text-blue-800">
            Choose input format:
          </p>
          {/* Input Buttons */}
          <div className="flex justify-center space-x-8 mb-4">
            <button
              type="button"
              onClick={() => document.getElementById("mol-file-input").click()}
              className="bg-blue-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700"
            >
              MOL file
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("pdb-file-input").click()}
              className="bg-blue-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700"
            >
              PDB file
            </button>
            <button
              type="button"
              onClick={() =>
                document.getElementById("adjacency-list-input").click()
              }
              className="bg-blue-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700"
            >
              Adjacency list
            </button>
            <button
              type="button"
              onClick={handleTextareaToggle}
              className="bg-blue-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700"
            >
              Adjacency matrix
            </button>
          </div>

          {/* Hidden File Inputs */}
          <input
            id="mol-file-input"
            type="file"
            accept=".mol"
            onChange={onFileChange}
            disabled={loading}
            className="hidden"
          />
          <input
            id="pdb-file-input"
            type="file"
            accept=".pdb"
            onChange={onFileChange}
            disabled={loading}
            className="hidden"
          />
          <input
            id="adjacency-list-input"
            type="file"
            accept=".txt"
            onChange={onFileChange}
            disabled={loading}
            className="hidden"
          />
          {showTextarea && (
            <textarea
              className="block mb-4 w-full h-32 border-2 border-gray-300 p-2 rounded-md"
              value={textareaValue}
              onChange={handleTextareaChange}
              disabled={loading}
              placeholder="Paste the adjacency matrix obtained from newGraph here"
            ></textarea>
          )}
          <select
            onChange={handleSelectChange}
            className="block mb-4 w-full border-2 border-gray-300 p-2 rounded-md"
          >
            <option>Graph Information</option>
            <option>Degree Based Values</option>
            <option>Distance Based Values</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700"
          >
            Upload
          </button>
          {file && <p className="text-blue-800 mt-2">Uploaded file: {file.name}</p>}
        </form>
      </div>

      {/* Display uploaded file name */}
      {error && <h2>Error Computing Values</h2>}
      {loading && <Loader />}
      {!error &&
        !loading &&
        values &&
        (selectedOption === "Degree Based Values" ? (
          <FourColumnsTable
            values={values.four_columns}
            timeTaken={values.time_taken}
          />
        ) : selectedOption === "Distance Based Values" ? (
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
        ))}
    </div>
  );
}

export default App;
