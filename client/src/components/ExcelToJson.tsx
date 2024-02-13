import axios from "axios";
import React, { ChangeEvent } from "react";
import * as XLSX from "xlsx";

export const ExcelToJson: React.FC = () => {
  const setDataIntoDb = async (originalData: any) => {
    try {
      const resData = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/setQuestions`,
        {
          data: originalData,
        },
      );
      console.log(resData.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target?.result;
      if (data && typeof data === "string") {
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
        //  setJsonData(jsonData);
        console.log(jsonData);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};
// export default ExcelToJson;
