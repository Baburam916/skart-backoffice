import React, { useEffect, useState } from "react";

const AnimatedCounter = ({ value }) => {
  if(!value || value == 0){
    return <div>0</div>;
  }
  
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;

    const duration = 2000;
    const stepTime = 20;
    const increment = Math.ceil(end / (duration / stepTime));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <div>{count}</div>;
};

export default AnimatedCounter;