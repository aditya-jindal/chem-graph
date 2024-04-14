function DistanceColumnsTable({ distance_indices, distance_entropies }) {
  const keys = Object.keys(distance_indices);

  return (
    <>
      <h2>Distance Based Values</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table
          style={{ border: "1px solid black", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "10px" }}>
                Key
              </th>
              <th style={{ border: "1px solid black", padding: "10px" }}>
                distance_indices
              </th>
              <th style={{ border: "1px solid black", padding: "10px" }}>
                distance_entropies
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
                  {distance_indices[key]}
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {distance_entropies[key] ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DistanceColumnsTable;
