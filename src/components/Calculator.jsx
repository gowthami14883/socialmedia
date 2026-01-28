import { useState } from "react";

function Calculator() {
  const [input, setInput] = useState("");

  const buttons = [
    "C", "DEL", "÷",
    "7", "8", "9", "×",
    "4", "5", "6", "−",
    "1", "2", "3", "+",
    "0", ".", "="
  ];

  const handleClick = (value) => {
    if (value === "C") {
      setInput("");
    } 
    else if (value === "DEL") {
      setInput(input.slice(0, -1));
    } 
    else if (value === "=") {
      try {
        setInput(
          eval(
            input
              .replace(/×/g, "*")
              .replace(/÷/g, "/")
              .replace(/−/g, "-")
          ).toString()
        );
      } catch {
        setInput("Error");
      }
    } 
    else {
      setInput(input + value);
    }
  };

  return (
    <div className="calculator">
      <div className="display">
        {input || "0"}
      </div>

      <div className="buttons">
        {buttons.map((btn, index) => (
          <button
            key={index}
            className={
              btn === "C"
                ? "clear"
                : btn === "DEL"
                ? "del"
                : ["+", "−", "×", "÷"].includes(btn)
                ? "operator"
                : btn === "="
                ? "equal"
                : ""
            }
            onClick={() => handleClick(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Calculator;
