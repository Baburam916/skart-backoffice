import React from "react";
import styles from "./floatext.module.css"

const FloatingText = (props:any) => {
  const {text,textcolor}=props
  return (
    <div className="overflow-hidden w-full bg-gray-300 h-6 mb-2 ">
      <div className={`${styles.floatRightLeft} whitespace-nowrap `}>
        <span className={`text-lg font-bold ${textcolor}`}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default FloatingText;
