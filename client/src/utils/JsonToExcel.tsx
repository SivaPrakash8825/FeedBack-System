import * as XLSX from "xlsx";

const JsonToExcel = ({ data, fileName }: { data: any; fileName: string }) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Save the workbook to an Excel file
    XLSX.writeFile(workbook, fileName);
    return { msg: "Sheet Downloaded :)", variant: "success" };
  } catch (error) {
    console.log("convertJsonToSheet Error : ", error.message);
    return { msg: error.message as string, variant: "error" };
  }
};

export default JsonToExcel;
