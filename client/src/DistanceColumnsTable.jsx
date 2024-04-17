import { useState } from "react";

function DistanceColumnsTable({ distance_indices, distance_entropies }) {
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

  const queryResults1 = filterObject(distance_indices, query);
  const queryResults2 = filterObject(distance_entropies, query);
  const keys = queryResults1 && Object.keys(queryResults1);

  return (
    <>
      <h2>Distance Based Values</h2>
      {queryResults1 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
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
                <th style={{ border: "1px solid black", padding: "10px" }}>
                  Distance Indices
                </th>
                <th style={{ border: "1px solid black", padding: "10px" }}>
                  Distance Entropies
                </th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {key}
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {queryResults1[key]}
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {queryResults2[key] ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default DistanceColumnsTable;
