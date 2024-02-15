import * as XLSX from "xlsx";
import { QuestionDb } from "../../types";

export const JsonToExcelQuestions = (data: QuestionDb[], filename: string) => {
  try {
    const maxOptions = Math.max(
      ...data.map(
        (entry) =>
          JSON.parse(entry.question.slice(1, entry.question.length - 1)).options
            .length,
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
      const parsedQuestion = JSON.parse(question.slice(1, question.length - 1));
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
    return { msg: "Questions Sheet Downloaded :)", variant: "success" };
  } catch (error) {
    console.log("convertJsonToSheet Error : ", error.message);
    return { msg: error.message as string, variant: "error" };
  }
};
