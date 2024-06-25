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
  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const [selectedOption, setSelectedOption] = useState("Edge Partitions");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
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
            : "edge_partitions"
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
          accept=".pdb, .txt"
          onChange={onFileChange}
          disabled={loading}
        />
        <select onChange={handleSelectChange}>
          <option>Edge Partitions</option>
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
          <FourColumnsTable values={values.four_columns} />
        ) : selectedOption === "Distance Based Values" ? (
          <DistanceColumnsTable
            distance_indices={values["Distance Indices"]}
            distance_entropies={values["Distance Entropies"]}
          />
        ) : (
          <EdgePartitions
            edgeCount={values["Edge Count"]}
            vertexCount={values["Vertices Count"]}
            edgeList={values["Edge List"]}
          />
        ))}
    </div>
  );
}

export default App;
