function EdgePartitions({ edgeCount, vertexCount, edgeList }) {
  return (
    edgeCount && (
      <div>
        <p>Number of vertices: {vertexCount}</p>
        <p>Number of edges: {edgeCount}</p>
        <p>Edge Partitions:</p>
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
              <th style={{ border: "1px solid black" }}>Vertex 1</th>
              <th style={{ border: "1px solid black" }}>Vertex 2</th>
            </tr>
          </thead>
          <tbody>
            {edgeList.map((partition, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black" }}>{index + 1}</td>
                <td style={{ border: "1px solid black" }}>{partition[0]}</td>
                <td style={{ border: "1px solid black" }}>{partition[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}

export default EdgePartitions;
