export const handleFileUpload = (
  file: File,
  setUploadcsvdata: React.Dispatch<React.SetStateAction<any>>,
  
  setCSVData: React.Dispatch<React.SetStateAction<any[]>>
) => {
  // console.log(file,"filecoming")
  const reader = new FileReader();

  reader.onload = (event) => {
    if (!event.target) return;
    const text = event.target.result as string;
    const data = parseCSV(text);
  
    setUploadcsvdata((prev: any) => ({ ...prev, csvData: data }));
    setCSVData(data);
  };

  reader.readAsText(file);
};

export const parseCSV = (text: string): any => {
  const [headers, ...rows] = text.split("\n").map((row) => row.split(","));
  const data = rows.map((row) => {
    const rowData: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      rowData[header.trim()] = row[index]?.trim() || "";
    });
    return rowData;
  });

  return data;
};
