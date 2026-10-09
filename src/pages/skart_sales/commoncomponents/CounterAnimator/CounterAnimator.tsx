import React, { useEffect, useState } from "react";
export const CounterAnimator = ({ value, not_decimal = 0 }) => {
  const [count, setCount] = useState("0.00");
  const fractionDigits = not_decimal === 1 ? 0 : 3;
  useEffect(() => {
    function animatedCounter() {
      let start = 0;
      const end = Number(value) || 0;
      if (start === end) {
        setCount("0");
        return;
      }
      function updateCounter() {
        start += (end - start) / 10;
        if (start >= end) {
          start = end;
        }
        setCount(start.toFixed(3));
        if (start < end) {
          requestAnimationFrame(updateCounter);
        }
      }
      updateCounter();
    }
    animatedCounter();
  }, [value]);
  return (
    <div>
      {Number(count).toLocaleString("en-IN", {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      })}
    </div>
  );
};
export default CounterAnimator;
