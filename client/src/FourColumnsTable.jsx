import { useState } from "react";

function FourColumnsTable({ values, timeTaken }) {
  const [query, setQuery] = useState("");
  function handleChange(e) {
    e.preventDefault();
    setQuery(e.target.value);
  }
  function filterObject(object, substring) {
    if (substring.length === 0) return object;
    const entries = Object.entries(object);
    const filteredEntries = entries.filter(([key]) => {
      return key.toLowerCase().includes(substring.toLowerCase());
    });
    const filteredObject = Object.fromEntries(filteredEntries);
    return filteredObject;
  }
  function filterObjectObject(object, substring) {
    if (substring.length === 0) return object;
    let filteredObject = {};
    filteredObject[" Degree Based Indices"] = filterObject(
      object[" Degree Based Indices"],
      substring
    );
    filteredObject[" Degree Based Entropies"] = filterObject(
      object[" Degree Based Entropies"],
      substring
    );
    filteredObject["Degree Sum Based Indices"] = filterObject(
      object["Degree Sum Based Indices"],
      substring
    );
    filteredObject["Degree Sum Based Entropies"] = filterObject(
      object["Degree Sum Based Entropies"],
      substring
    );
    return filteredObject;
  }

  const queryResults = filterObjectObject(values, query);
  const keys =
    queryResults && Object.keys(queryResults[Object.keys(queryResults)[0]]);
  return (
    <>
      {queryResults && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
          className="text-black"
        >
          <h2 className="text-2xl font-bold mb-8 text-blue-800">Degree Based Values</h2>
          <p>Time Taken: {timeTaken} seconds</p>
          <table
            style={{ border: "1px solid black", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "10px" }}>
                  <input
                    type="text"
                    placeholder="search for values here"
                    value={query}
                    onChange={(e) => handleChange(e)}
                    className="bg-white placeholder-yellow-500 text-yellow-500 rounded-lg p-1 text-center"
                  />
                </th>
                {Object.keys(queryResults).map((column, index) => (
                  <th
                    key={index}
                    style={{ border: "1px solid black", padding: "10px" }}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map((key, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {key}
                  </td>
                  {Object.keys(queryResults).map((column, columnIndex) => (
                    <td
                      key={columnIndex}
                      style={{ border: "1px solid black", padding: "10px" }}
                    >
                      {queryResults[column][key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default FourColumnsTable;
