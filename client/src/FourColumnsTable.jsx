import {useState } from "react";

function FourColumnsTable({ values }) {
  const [query, setQuery] = useState("");
  function handleChange(e) {
    e.preventDefault();
    setQuery(e.target.value);
  }
  function filterObject(object, substring) {
    if (substring.length === 0) return object;
    const entries = Object.entries(object);
    const filteredEntries = entries.filter(([key, _]) => {
      return key.includes(substring);
    });
    const filteredObject = Object.fromEntries(filteredEntries);
    return filteredObject;
  }
  function filterObjectObject(object, substring) {
    if (substring.length === 0) return object;
    let filteredObject = {};
    filteredObject["columnA: Degree Indices"] = filterObject(
      object["columnA: Degree Indices"],
      substring
    );
    filteredObject["columnB: Degree Entropy"] = filterObject(
      object["columnB: Degree Entropy"],
      substring
    );
    filteredObject["columnC: Degree Sum Indices"] = filterObject(
      object["columnC: Degree Sum Indices"],
      substring
    );
    filteredObject["columnD: Degree Sum Entropy"] = filterObject(
      object["columnD: Degree Sum Entropy"],
      substring
    );
    return filteredObject;
  }

  const queryResults = filterObjectObject(values, query);
  const keys =
    queryResults && Object.keys(queryResults[Object.keys(queryResults)[0]]);
  return (
    <>
      <h2>Degree Based Values</h2>
      {queryResults && (
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
      )}
    </>
  );
}

export default FourColumnsTable;
