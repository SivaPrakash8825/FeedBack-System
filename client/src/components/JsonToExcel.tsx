import axios from "axios";
import { useEffect } from "react";
import * as XLSX from "xlsx";
import { Question, QuestionDb } from "../../types";

export const JsonToExcel = () => {
  const convertJsonToSheet = (data: QuestionDb[]) => {
    try {
      // console.log(data);

      // const data = [
      //   {
      //     id: 1,
      //     question:
      //       '{"question":"How much portion of the syllabus was covered by the teacher?","options":["75 to 84%","74 to 65%","Below 65%"]}',
      //   },
      //   {
      //     id: 2,
      //     question:
      //       '{"question":"Has the teacher covered relevant topics beyond the syllabus?","options":["Usually","Sometimes","Rarely","Never"]}',
      //     type: "theory",
      //   },
      //   {
      //     id: 3,
      //     question:
      //       '{"question":"Did the teacher teach the subject with suitable illustrations, case studies and applications?","options":["Everytime","Usually","Sometimes","Rarely","Never"]}',
      //     type: "theory",
      //   },
      // ];

      // Determine the maximum number of options
      const maxOptions = Math.max(
        ...data.map(
          (entry) =>
            JSON.parse(entry.question.slice(1, entry.question.length - 1))
              .options.length,
        ),
      );

      // Create the header row dynamically
      const headers = ["ID", "Type", "Question"];
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

        const { id, type, question } = entry;
        const parsedQuestion = JSON.parse(
          question.slice(1, question.length - 1),
        );
        const { question: q, options } = parsedQuestion;
        const row = [id, type, q];
        for (let i = 0; i < maxOptions; i++) {
          row.push(options[i] || null);
        }
        XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });
      });

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Generate Excel file and trigger download
      XLSX.writeFile(wb, "survey_data.xlsx");
    } catch (error) {
      console.log("convertJsonToSheet Error : ", error.message);
    }
  };

  const getQuestions = async () => {
    try {
      const { data } = await axios.get<QuestionDb[]>(
        `${import.meta.env.VITE_ENDPOINT}/getQuestions`,
      );

      console.log(data);

      convertJsonToSheet(data);

      // createExcelFile(data, "sheet.xlsx");
      // return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      JsonToExcel
    </div>
  );
};
