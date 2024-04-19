import { useEffect, useRef } from "react";

const ChartComponent = ({ chartHTML, edgeCount, verticesCount }) => {
  const ref = useRef();

  useEffect(() => {
    if (chartHTML && ref.current) {
      ref.current.innerHTML = chartHTML;

      const scripts = Array.from(ref.current.getElementsByTagName("script"));
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  }, [chartHTML]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={ref} />
      <div
        style={{ position: "absolute", top: "10%", right: "7%", width: "45%" }}
      >
        <p>Number of vertices: {verticesCount}</p>
        <p>Number of edges: {edgeCount}</p>
      </div>
    </div>
  );
};

export default ChartComponent;
