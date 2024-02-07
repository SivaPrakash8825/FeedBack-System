import axios from "axios";
import React, { ChangeEvent, useEffect } from "react";
import * as XLSX from "xlsx";

export const ExcelToJson: React.FC = () => {
  // Function to handle file upload
  const handleFileUploadd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    // console.log(file);

    if (file) {
      // console.log("in");

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;

        const workbook = XLSX.read(data, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const originalData = parseExcelData(worksheet);
        console.log(originalData);
        // }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const parseExcelData = (worksheet: XLSX.WorkSheet): any[] => {
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Extract headers
    const header = rows[0]; // First row contains headers
    const dataRows = rows.slice(1); // Skip first row (header row)

    // Define a mapping of Excel column names to JSON keys
    const columnToKeyMap: { [key: string]: string } = {
      ID: "id",
      Question: "question",
      Type: "type",
    };

    const originalData = dataRows.map((row: any) => {
      const entry: any = {};
      for (let i = 0; i < header.length; i++) {
        const columnName = header[i];
        const key = columnToKeyMap[columnName];
        if (key) {
          if (key === "question") {
            entry[key] = JSON.stringify({ question: row[i], options: [] });
          } else {
            entry[key] = row[i];
          }
        }
      }
      // Extract options
      const optionStartIndex = header.indexOf("Option 1");
      const optionEndIndex = header.indexOf("Type") - 1; // Exclude 'Type' column
      for (let i = optionStartIndex; i <= optionEndIndex; i++) {
        const option = row[i] || null; // Set missing option value to null
        entry.question.options.push(option);
        console.log(option);
      }

      return entry;
    });
    return originalData;
  };

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

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target) return;
      const data = new Uint8Array(event.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const headers = rows.shift() as string[];
      console.log(headers);

      const jsonData = rows.map((row: any) => {
        const text = headers.reduce(
          (acc: any, header: string, index: number) => {
            const value = row[index] !== undefined ? row[index] : null;
            if (header.toLowerCase() === "question") {
              acc.question = value;
              acc.options = undefined;
            } else if (header.toLowerCase().includes("option")) {
              if (!acc.options) {
                acc.options = [];
              }
              acc.options.push(value);
            } else {
              acc[header] = value;
            }
            // console.log(acc.question);

            return acc;
          },
          {},
        );
        return {
          id: text.ID,
          type: text.Type,
          question: JSON.stringify({
            question: text.question,
            options: text.options,
          }),
        };
      });
      // setJsonData(jsonData);
      console.log(jsonData);
      setDataIntoDb(jsonData);
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
