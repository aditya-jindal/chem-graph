function EdgePartitions({
  edgeCount,
  vertexCount,
  degreeEdgePartitions,
  degreeEdgeCounts,
  degreeSumEdgePartitions,
  degreeSumEdgeCounts,
}) {
  return (
    edgeCount && (
      <div>
        <p>Number of vertices: {vertexCount}</p>
        <p>Number of edges: {edgeCount}</p>
        <p>Degree Edge Partitions:-</p>
        <table
          style={{
            margin: "auto",
            border: "1px solid black",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid black" }}>Partition</th>
              <th style={{ border: "1px solid black" }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {degreeEdgePartitions?.map((partition, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black" }}>
                  {partition[0]}, {partition[1]}
                </td>
                <td style={{ border: "1px solid black" }}>
                  {degreeEdgeCounts[index]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Degree Sum Edge Partitions:-</p>
        <table
          style={{
            margin: "auto",
            border: "1px solid black",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid black" }}>Partition</th>
              <th style={{ border: "1px solid black" }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {degreeSumEdgePartitions?.map((partition, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black" }}>
                  {partition[0]}, {partition[1]}
                </td>
                <td style={{ border: "1px solid black" }}>
                  {degreeSumEdgeCounts[index]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}

export default EdgePartitions;
