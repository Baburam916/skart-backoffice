import React from "react";

const Excutive_performace_chart = () => {
  const size = 170;
  const strokeWidth = 17;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { value: 35, color: "#fca2a2" }, // Dark Brown
    { value: 30, color: "#25cac2" }, // Orange
    { value: 20, color: "#3d9658" }, // Light Beige
    { value: 15, color: "#f1ca1c" }, // Gray
  ];

  let offset = 0;

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          {segments.map((segment, index) => {
            const dash = (segment.value / 100) * circumference;
            const dashOffset = circumference - dash;

            const circle = (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={-offset}
              />
            );

            offset += dash;
            return circle;
          })}
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-gray-900">124</h2>
          <p className="text-sm tracking-[3px] text-gray-700 uppercase">
            Total
          </p>
        </div>
      </div>
    </div>
  );
};

export default Excutive_performace_chart;