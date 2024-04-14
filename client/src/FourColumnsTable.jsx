function FourColumnsTable({ values }) {
  const keys = values && Object.keys(values[Object.keys(values)[0]]);

  return (
    <>
    <h2>Degree Based Values</h2>
      <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "10px" }}>Key</th>
            {Object.keys(values).map((column, index) => (
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
              {Object.keys(values).map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  style={{ border: "1px solid black", padding: "10px" }}
                >
                  {values[column][key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default FourColumnsTable;
