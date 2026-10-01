import React, { useState } from "react";

export const CommonTooltip = ({ text, children }:any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className=" opacity-100 transition-opacity duration-200 ease-in-out font-medium text-primary text-center text-xs rounded py-2 absolute top-3 z-400 bottom-full ">
          {text}
         
        </div>
      )}
    </div>
  );
};
