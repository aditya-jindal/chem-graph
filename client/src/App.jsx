import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [values, setValues] = useState({});
  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const APILINK = "http://localhost:5000/upload";
  // const APILINK = "https://chem-graph.onrender.com/upload";

  const onFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(APILINK, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      setValues(data.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <form onSubmit={onFormSubmit}>
        <input type="file" accept=".pdb, .txt" onChange={onFileChange} />
        <button type="submit">Upload</button>
      </form>
      {Object.entries(values).map(([key, value]) => (
        <p key={key}>{`${key}: ${value}`}</p>
      ))}
    </div>
  );
}

export default App;
