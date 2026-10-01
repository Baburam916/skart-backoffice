const currentDate = new Date();

// Define options for formatting
const options = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

// Format the current date
export const CurrentformattedDate = currentDate
  .toLocaleDateString("en-GB", options)
  .toUpperCase();

