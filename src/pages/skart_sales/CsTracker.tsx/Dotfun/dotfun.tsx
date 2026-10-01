import React from "react";
import { formatDate } from "../../commoncomponents/commondateformat/datetoreqformat";
// import { formatDate } from "../commoncomponents/commondateformat/datetoreqformat";

const DateDot = ({ tat_date,is_open }) => {

  const currentDate = new Date();
  const targetDate = new Date(tat_date);

  // Calculate the difference in days
  const diffInTime = targetDate - currentDate;
  const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24)); // Convert to days

  // Determine dot color based on conditions
  const dotColor =
    diffInDays < 0
      ?is_open==0?"bg-green-500": "bg-red-500" // Past date
      : diffInDays <= 1
      ? "bg-yellow-500" // Same day or less than 1 day
      : diffInDays <= 2
      ? "bg-green-500" // Less than or equal to 2 days
      : "bg-gray-300"; // Default case

  return (
    <div className="flex items-center">
      <span>{formatDate(targetDate.toLocaleDateString()).split(",")[0]}</span>
      <div
        className={`ml-2 w-3 h-3 rounded-full ${dotColor}`}
        title={`Due in ${diffInDays} day(s)`}
      ></div>
    </div>
  );
};

export default DateDot;
