export function convertUTCtoIST(dateString: any) {
  const hasTime = typeof dateString === "string" && dateString.includes("T");

  const utcDate = new Date(dateString);
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  if (!hasTime) {
    const day = String(utcDate.getDate()).padStart(2, "0");
    const month = monthNames[utcDate.getMonth()];
    const year = utcDate.getFullYear();
    return `${day} ${month} ${year}`;
  }

  const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
  const istTime = new Date(utcDate.getTime() + istOffset);
  const day = String(istTime.getDate()).padStart(2, "0");
  const month = monthNames[istTime.getMonth()];
  const year = istTime.getFullYear();
  let hours = istTime.getHours();
  const minutes = String(istTime.getMinutes()).padStart(2, "0");
  const seconds = String(istTime.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
}












