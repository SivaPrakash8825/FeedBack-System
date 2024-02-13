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
  } catch (error) {
    console.log(error.message);
  }
};

export const ExcelToJson = (
  e: React.ChangeEvent<HTMLInputElement>,
  apiType: string,
) => {
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
    const jsonData = jsonResult.slice(1).map((row: any[]) => {
      const obj: { [key: string]: any } = {};
      row.forEach((cellValue, index) => {
        const header = headers[index];
        obj[header] = cellValue;
      });
      return obj;
    });
    //   setJsonData(jsonData);
    console.log(jsonData);
    setDataIntoDb(jsonData, apiType);
    // }
  };

  reader.readAsArrayBuffer(file);
};
