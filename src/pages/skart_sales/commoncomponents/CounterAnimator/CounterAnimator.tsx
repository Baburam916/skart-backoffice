import React, { useEffect, useState } from "react";
export const CounterAnimator = ({ value }) => {
  const [count, setCount] = useState("0.00");
  useEffect(() => {
    function animatedCounter() {
      let start = 0;
      const end = value;
      if (start === end) return end;
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
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}
    </div>
  );
};
export default CounterAnimator;
