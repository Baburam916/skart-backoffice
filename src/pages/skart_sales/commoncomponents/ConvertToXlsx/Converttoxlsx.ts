import * as XLSX from "xlsx";
export const convertJSONtoXLSX = async (data: any, fileName: string) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  } catch (error: any) {
    // console.log(error.message);
  }
};
