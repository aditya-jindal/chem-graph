import { useEffect, useRef } from "react";

const ChartComponent = ({ chartHTML }) => {
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

  return <div ref={ref} />;
};

export default ChartComponent;
