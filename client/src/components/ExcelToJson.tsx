import React, { ChangeEvent, useState } from "react";
import * as XLSX from "xlsx";

const ExcelToJsonConverter = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.files && setFile(event?.target?.files[0]);
  };

  const convertSheetDataToJson = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // Assuming you want to convert the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet data to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

      console.log(jsonData);
      // You can now use jsonData in your application state or send it to the server
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    convertSheetDataToJson();
  };

  return (
    <div className="">
      <div>hai</div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Convert to JSON</button>
      </form>
    </div>
  );
};

export default ExcelToJsonConverter;
