import { useEffect, useRef, useState } from "react";
import "./App.css";
import Loader from "./Loader";
import FourColumnsTable from "./FourColumnsTable";
import DistanceColumnsTable from "./DistanceColumnsTable";
import ChartComponent from "./chartComponent";
import * as NGL from "ngl";

function App() {
  // const APILINK = "https://chem-graph.onrender.com";
  const APILINK = "http://localhost:5000";

  // testing area start
  const stageRef = useRef(null);
  const fileRef = useRef(null);
  useEffect(() => {
    stageRef.current = new NGL.Stage("viewport");
    return () => {
      stageRef.current.dispose();
    };
  }, []);

  // testing area end

  const [chartHTML, setChartHTML] = useState("");
  const [file, setFile] = useState(null);
  const [values, setValues] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const onFileChange = (event) => {
    const newFile = event.target.files[0];
    setFile(newFile);
    fileRef.current = newFile;

    stageRef.current
      .loadFile(URL.createObjectURL(newFile), { ext: "pdb" })
      .then(function (component) {
        component.addRepresentation("surface");
        stageRef.current.autoView();
      })
      .catch((error) => {
        console.error("Error loading PDB file:", error);
      });
  };
  const [selectedOption, setSelectedOption] = useState("Degree Based Values");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log("hi");
    console.log(file);
    try {
      const stage = new NGL.Stage("viewport");

      // Load PDB data into NGL Stage
      stage
        .loadFile(file, { ext: "pdb" })
        .then(function (component) {
          component.addRepresentation("cartoon"); // Change representation type
          stage.autoView();
        })
        .catch(function (error) {
          console.error("Error loading PDB file:", error); // Log any errors
        });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
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
      <div id="viewport" style={{ width: "600px", height: "400px" }}></div>

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
