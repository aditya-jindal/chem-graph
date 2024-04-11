import { useState } from "react";
import "./App.css";
import Loader from "./Loader";

function App() {
  const APILINK = "https://chem-graph.onrender.com/upload";
  // const APILINK = "http://localhost:5000/upload";

  const [file, setFile] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };


  const onFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      setError(false)
      setLoading(true);
      const response = await fetch(APILINK, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      setValues(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(true)
    }
  };
  return (
    <div>
      <h1>Chem Graph</h1>
      {loading && <Loader/>}
      {error && <p>Error Computing Values</p>}
      <form onSubmit={onFormSubmit}>
        <input type="file" accept=".pdb, .txt" onChange={onFileChange} disabled={loading}/>
        <button type="submit" disabled={loading}>Upload</button>
      </form>
      {Object.entries(values).map(([key, value]) => (
        <p key={key}>{`${key}: ${value}`}</p>
      ))}
    </div>
  );
}

export default App;
