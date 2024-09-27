import { useState } from "react";
import "./App.css";
import Loader from "./Loader";
import FourColumnsTable from "./FourColumnsTable";
import DistanceColumnsTable from "./DistanceColumnsTable";
import EdgePartitions from "./EdgePartitions";
import ChartComponent from "./chartComponent";
import Spline from "@splinetool/react-spline";

function App() {
  // const APILINK = "https://chem-graph.onrender.com";
  // const APILINK = "http://localhost:5000";
  const APILINK = "https://vpqebjeug2dtqoi3exx6nlfdta0jnxyl.lambda-url.us-east-1.on.aws";

  const [chartHTML, setChartHTML] = useState("");
  const [file, setFile] = useState(null);
  const [values, setValues] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");

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
  const convertMatrixToList = (matrix) => {
    const adjacencyList = {};
    for (let i = 0; i < matrix.length; i++) {
      adjacencyList[i] = [];
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          adjacencyList[i].push(j);
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
      setChartHTML(data.data.graph);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative" }}>
        {/* <Spline
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "20%",
          }}
          scene="https://prod.spline.design/9NYWdodoCJuvjZdX/scene.splinecode"
        /> */}
        <h1>Chem Graph</h1>
      </div>
      <form onSubmit={onFormSubmit}>
        <input
          type="file"
          accept=".pdb, .txt, .mol"
          onChange={onFileChange}
          disabled={loading}
        />
        <textarea
          style={{ width: "100%", height: "200px" }}
          value={textareaValue}
          onChange={handleTextareaChange}
          disabled={loading}
          placeholder="Paste the adjacency matrix obtained from newGraph here"
        ></textarea>
        <select onChange={handleSelectChange}>
          <option>Graph Information</option>
          <option>Degree Based Values</option>
          <option>Distance Based Values</option>
        </select>
        <button type="submit" disabled={loading}>
          Upload
        </button>
      </form>
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
