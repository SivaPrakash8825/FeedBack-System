import axios from "axios";
import * as XLSX from "xlsx";

const setDataIntoDb = async (originalData: any, apiName: string) => {
  try {
    const resData = await axios.post(
      `${import.meta.env.VITE_ENDPOINT}/${apiName}`,
      {
        data: originalData,
      },
    );
    console.log(resData.data);
    // return { msg: "Data Updated :)", variant: "success" };
  } catch (error) {
    console.log(error.message);
  }
};

export const ExcelToJson = async (
  e: React.ChangeEvent<HTMLInputElement>,
  apiType: string,
) => {
  try {
    // let status = {};
    const file = e.target.files?.[0];
    // console.log(file);

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      // console.log("in");

      const data = event.target?.result;
      // if (data && typeof data === "string") {
      // console.log("inn");

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Assuming first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonResult = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      // Assuming first row as header
      const headers = jsonResult[0];
      const jsonData = jsonResult.slice(1).map((row) => {
        const obj: { [key: string]: any } = {};
        row.forEach((cellValue, index) => {
          const header = headers[index];
          // Check if cellValue is undefined or null, then replace with empty space
          obj[header] =
            cellValue === undefined || cellValue === null ? "null" : cellValue;
        });
        return obj;
      });
      //   setJsonData(jsonData);
      console.log(jsonData);

      setDataIntoDb(jsonData, apiType);

      // }
    };

    reader.readAsArrayBuffer(file);
    // console.log(status);

    // return status;
  } catch (error) {
    console.log(error.message);
    return { msg: error.message as string, variant: "error" };
  }
};
