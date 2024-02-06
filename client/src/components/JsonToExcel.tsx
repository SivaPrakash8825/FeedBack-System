import axios from "axios";
import { useEffect } from "react";
import * as XLSX from "xlsx";
import { Question, QuestionDb } from "../../types";

export const JsonToExcel = () => {
  // const createExcelFile = (jsonData: Array<QuestionDb>, filePath: string) => {
  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = XLSX.utils.json_to_sheet(jsonData);
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //   XLSX.writeFile(workbook, filePath);
  // };

  // const getQuestions = async () => {
  //   try {
  //     const { data } = await axios.get<QuestionDb[]>(
  //       `${import.meta.env.VITE_ENDPOINT}/getQuestions`,
  //     );
  //     // console.log();
  //     const newVal = data.map((d, i) => {
  //       const parsedData = JSON.parse(d.question);
  //       const { question, options } = parsedData;
  //       // console.log(parsedData);

  //       // Prepare data for Excel sheet
  //       const excelData = [[question], ...options.map((option) => [option])];
  //       console.log(excelData);
  //     });
  //     console.log(newVal);

  //     // createExcelFile(data, "sheet.xlsx");
  //     // return data;
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // const dataFromDatabase = `[{"question":"How much portion of the syllabus was covered by the teacher?","options":["95 to 100%","85 to 94%","75 to 84%","Below 65%"],"type":"theory"},{"question":"Has the teacher covered relevant topics beyond the syllabus?","options":["Everytime","Usually","Sometimes","Rarely","Never"],"type":"theory"},{"question":"Did the teacher teach the subject with suitable illustrations, case studies and applications?","options":["Everytime","Usually","Sometimes","Rarely","Never"],"type":"theory"},{"question":"How well the teacher was able to communicate with the students?","options":["Always effective","Sometimes effective","Satisfactory","Generally ineffective","Very poor communication"],"type":"theory"},{"question":"The percentage use of ICT tools by the teacher, such as LCD projector, Multimedia, etc. while teaching was,","options":["Above 90%","70 to 89%","50 to 69%","30 to 59%","Below 29%"],"type":"theory"}]`;

  // second Attempt

  // const data: QuestionDb[] = [
  //   {
  //     id: 1,
  //     question:
  //       '{"question":"How much portion of the syllabus was covered by the teacher?","options":["95 to 100%","85 to 94%","75 to 84%","74 to 65%","Below 65%"]}',
  //     type: "theory",
  //   },
  //   {
  //     id: 2,
  //     question:
  //       '{"question":"Has the teacher covered relevant topics beyond the syllabus?","options":["Everytime","Usually","Sometimes","Rarely","Never"]}',
  //     type: "theory",
  //   },
  //   {
  //     id: 3,
  //     question:
  //       '{"question":"Did the teacher teach the subject with suitable illustrations, case studies and applications?","options":["Everytime","Usually","Sometimes","Rarely","Never"]}',
  //     type: "theory",
  //   },
  // ];

  const convertJsonToSheet = (data: QuestionDb[]) => {
    try {
      const maxOptions = Math.max(
        ...data.map((entry) => JSON.parse(entry.question).options.length),
      );

      // Create the header row dynamically
      const headers = ["ID", "Question", "Type"];
      for (let i = 0; i < maxOptions; i++) {
        headers.push(`Option ${i + 1}`);
      }

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Create a new worksheet
      const ws = XLSX.utils.aoa_to_sheet([headers]);

      // Insert data into the worksheet
      data.forEach((entry: any) => {
        const { id, question, type } = entry;
        const parsedQuestion = JSON.parse(question);
        const { question: q, options } = parsedQuestion;
        const row = [id, q, type];
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
      // console.log();
      // const newVal = data.map((d, i) => {
      //   const parsedData = JSON.parse(d.question);
      //   // const { question, options } = parsedData;
      //   // console.log(parsedData);

      //   // Prepare data for Excel sheet
      //   // const excelData = [[question], ...options.map((option) => [option])];
      //   console.log(parsedData);
      // });

      // const finalVal = [] as Question[];
      // for (let i = 0; i < data.length; i++) {
      //   finalVal.push(JSON.parse(data[i].question));
      // }

      // console.log(data);

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

  return <div>JsonToExcel</div>;
};
