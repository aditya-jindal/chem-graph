function EdgePartitions({
  edgeCount,
  vertexCount,
  energy,
  degreeEdgePartitions,
  degreeEdgeCounts,
  degreeSumEdgePartitions,
  degreeSumEdgeCounts,
  timeTaken,
}) {
  return (
    edgeCount && (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
        className="text-black font-semibold"
      >
        <p>Time Taken: {timeTaken} seconds</p>
        <p>Number of vertices: {vertexCount}</p>
        <p>Number of edges: {edgeCount}</p>
        <p>{energy && `Energy: ${energy}`}</p>
        <div className="flex justify-around min-w-[50vw] mt-5">
          <div className="flex flex-col justify-start items-center ">
            <p className="mb-4">Degree Edge Partitions:-</p>
            <table
              style={{
                // margin: "auto",
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
          </div>
          <div className="flex justify-center items-center flex-col mb-12">
            <p className="mb-4">Degree Sum Edge Partitions:-</p>
            <table
              style={{
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
        </div>
      </div>
    )
  );
}

export default EdgePartitions;
