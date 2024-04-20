import { useState } from "react";
import "./App.css";
import Loader from "./Loader";
import FourColumnsTable from "./FourColumnsTable";
import DistanceColumnsTable from "./DistanceColumnsTable";
import ChartComponent from "./chartComponent";
import ProteinViewer, { ViewerStage } from "@jowillianto/ngl-viewer/dist";
// import { ComponentUIDataT } from "@jowillianto/ngl-viewer/dist/ngl-viewer/user-interface/component-data";

function App() {
  // const APILINK = "https://chem-graph.onrender.com";
  const APILINK = "http://localhost:5000";
  const component = {
    type: "file",
    props: {
      file: "../../server/data/FAR23.pdb",
      fileSettings: {},
      viewSettings: [
        {
          type: "cartoon",
          params: {},
        },
      ],
    },
    config: {},
  };

  const [chartHTML, setChartHTML] = useState("");
  const [file, setFile] = useState(null);
  const [values, setValues] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const [selectedOption, setSelectedOption] = useState("Degree Based Values");

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
            : "distance_based"
        }`,
        {
          method: "POST",
          body: formData,
        }
      );

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
    <div>
      {/* <ProteinViewer initialComponents={[component]}>
        <ViewerStage height="800px" width="800px" />
      </ProteinViewer> */}
      <h1>Chem Graph</h1>
      <form onSubmit={onFormSubmit}>
        <input
          type="file"
          accept=".pdb, .txt"
          onChange={onFileChange}
          disabled={loading}
        />
        <select onChange={handleSelectChange}>
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
          <>
            <ChartComponent
              chartHTML={chartHTML}
              edgeCount={values.edgeCount}
              verticesCount={values.verticesCount}
            />
            <FourColumnsTable values={values.four_columns} />
          </>
        ) : (
          <>
            <ChartComponent
              chartHTML={chartHTML}
              edgeCount={values.edgeCount}
              verticesCount={values.verticesCount}
            />
            <DistanceColumnsTable
              distance_indices={values["Distance Indices"]}
              distance_entropies={values["Distance Entropies"]}
            />
          </>
        ))}
    </div>
  );
}

export default App;
