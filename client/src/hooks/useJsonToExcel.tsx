import * as XLSX from "xlsx";
import useToast from "../store/useToast";
import { QuestionDb } from "../../types";

const useJsonToExcel = () => {
  const setToast = useToast((state) => state.setToast);

  const JsonToExcel = (
    data: Array<object>,
    fileName: string,
    isEmpty?: boolean,
  ) => {
    try {
      let worksheet;
      let workbook: XLSX.WorkBook;
      workbook = XLSX.utils.book_new();
      console.log(data.length);

      if (Object.keys(data[0])[0] == "COLUMN_NAME") {
        const header = data.map((item) => item.COLUMN_NAME);
        const emptyData = [header];
        worksheet = XLSX.utils.aoa_to_sheet(emptyData);
      } else {
        worksheet = XLSX.utils.json_to_sheet(data);
      }
      console.log(data);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, fileName);
      setToast({ msg: "Sheet Downloaded :)", variant: "success" });
    } catch (error) {
      console.log("convertJsonToSheet Error : ", error.message);
      setToast({ msg: error.message, variant: "error" });
    }
  };

  const JsonToExcelQuestions = (
    data: QuestionDb[],
    filename: string,
    typee: string,
  ) => {
    try {
      const isOthers = typee == "others";
      // console.log(isOthers, typee);

      const maxOptions = Math.max(
        ...data.map((entry) => JSON.parse(entry.question).options.length),
      );

      // console.log(JSON.parse(data[0].question));

      // Create the header row dynamically
      const headers = isOthers ? ["Question", "Type"] : ["Question"];
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
        const { question, type } = entry;
        const parsedQuestion = JSON.parse(question);
        const { question: q, options } = parsedQuestion;
        const row = isOthers ? [q, type] : [q];
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
