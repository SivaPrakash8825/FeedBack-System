import React from "react";
import * as XLSX from "xlsx";

const DeleteEmptyCells = () => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Iterate through each row and column to remove empty cells
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
        for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
          const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
          if (!worksheet[cellAddress]) continue; // Cell is empty

          const cellValue = worksheet[cellAddress].v;
          if (cellValue === "") {
            delete worksheet[cellAddress]; // Remove empty cell
          }
        }
      }

      // Save the modified Excel file
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, worksheet, sheetName);
      XLSX.writeFile(newWorkbook, "modified_file.xlsx");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default DeleteEmptyCells;
