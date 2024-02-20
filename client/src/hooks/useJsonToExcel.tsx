import React from "react";
import * as XLSX from "xlsx";
import useToast from "../store/useToast";
import { QuestionDb } from "../../types";

type Props = {};

const useJsonToExcel = () => {
  const setToast = useToast((state) => state.setToast);

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
      setToast({ msg: "Sheet Downloaded :)", variant: "success" });
    } catch (error) {
      console.log("convertJsonToSheet Error : ", error.message);
      setToast({ msg: error.message, variant: "error" });
    }
  };

  const JsonToExcelQuestions = (data: QuestionDb[], filename: string) => {
    try {
      const maxOptions = Math.max(
        ...data.map(
          (entry) =>
            JSON.parse(entry.question.slice(1, entry.question.length - 1))
              .options.length,
        ),
      );

      // Create the header row dynamically
      const headers = ["ID", "Question"];
      for (let i = 0; i < maxOptions; i++) {
        headers.push(`Option ${i + 1}`);
      }

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Create a new worksheet
      const ws = XLSX.utils.aoa_to_sheet([headers]);

      // Insert data into the worksheet
      data.forEach((entry) => {
        // console.log(entry);

        const { id, question } = entry;
        const parsedQuestion = JSON.parse(
          question.slice(1, question.length - 1),
        );
        const { question: q, options } = parsedQuestion;
        const row = [id, q];
        for (let i = 0; i < maxOptions; i++) {
          row.push(options[i] || null);
        }
        XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });
      });

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Generate Excel file and trigger download
      XLSX.writeFile(wb, filename);
      setToast({ msg: "Questions Sheet Downloaded :)", variant: "success" });
    } catch (error) {
      console.log("convertJsonToSheet Error : ", error.message);
      setToast({ msg: error.message as string, variant: "error" });
    }
  };

  return { JsonToExcel, JsonToExcelQuestions };
};

export default useJsonToExcel;