import jsPDF from "jspdf";
import "jspdf-autotable";
const formatDate = (dateString: any) => {
  if (!dateString) {
    return "-";
  }
  const options: any = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", options);
};
export const exportToPDF = (data:any,franchise_Name:any) => {
  // Create a new jsPDF instance
  const doc:any = new jsPDF({
    orientation: "landscape",
  });

  // Define columns and rows from JSON data
  const columns = Object.keys(data[0]);
 
  // console.log(data,franchise_Name,"data for pdf")
  const rows = data.map((obj:any) => columns.map((col) => obj[col]));
// const rows2=formatData(data,franchise_Name)

  // Add table using autoTable plugin
  doc.autoTable({
    head: [columns],
    body: rows,
    theme: "grid",
    headStyles: {
      fillColor:[239,184,71], // Blue color for the table header
    },
  });

  // Save the PDF
  doc.save("logger_franchisee.pdf");
};
