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
