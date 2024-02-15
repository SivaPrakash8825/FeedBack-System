import axios from "axios";
import React from "react";
import * as XLSX from "xlsx";
import useToast from "../store/useToast";

type Props = {
  e: React.ChangeEvent<HTMLInputElement>;
  apiType: string;
};

const useExcelToJson = () => {
  const setToast = useToast((state) => state.setToast);
  const setDataIntoDb = async (originalData: any, apiType: string) => {
    try {
      const resData = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/${apiType}`,
        {
          data: originalData,
        },
      );
      console.log(resData.data);
      setToast({ msg: resData.data, variant: "success" });
    } catch (error) {
      console.log(error.response);
      setToast({ msg: error.response.data, variant: "error" });
    }
  };

  const ExcelToJson = async (
    e: React.ChangeEvent<HTMLInputElement>,
    apiType: string,
  ) => {
    try {
      // let status = {};
      const file = e.target.files?.[0];
      // console.log(file);

      if (!file) return;

      const reader = new FileReader();

      reader.onload = (event) => {
        // console.log("in");

        const data = event.target?.result;
        // if (data && typeof data === "string") {
        // console.log("inn");

        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0]; // Assuming first sheet
        const sheet = workbook.Sheets[sheetName];
        const jsonResult = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        // Assuming first row as header
        const headers = jsonResult[0];
        const jsonData = jsonResult.slice(1).map((row) => {
          const obj: { [key: string]: any } = {};
          row.forEach((cellValue, index) => {
            const header = headers[index];
            // Check if cellValue is undefined or null, then replace with empty space
            obj[header] =
              cellValue === undefined || cellValue === null
                ? "null"
                : cellValue;
          });
          return obj;
        });
        //   setJsonData(jsonData);
        console.log(jsonData);

        setDataIntoDb(jsonData, apiType);

        // }
      };

      reader.readAsArrayBuffer(file);
      // console.log(status);

      // return status;
    } catch (error) {
      console.log(error.response.data);
      setToast({ msg: error.response.data, variant: "error" });
    }
  };

  const setQuestionsIntoDb = async (originalData: any, typee: string) => {
    try {
      console.log("in");

      const resData = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/setQuestions/${typee}`,
        {
          data: originalData,
        },
      );
      console.log(resData.data);
      setToast({ msg: resData.data, variant: "success" });
    } catch (error) {
      console.log(error.message);
      setToast({ msg: error.response.data, variant: "error" });
    }
  };

  const ExcelToJsonQuestions = (
    e: React.ChangeEvent<HTMLInputElement>,
    typee: string,
  ) => {
    const file = e.target.files?.[0];
    console.log(file);

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
          type: typee,
          question: JSON.stringify({
            question: text.question,
            options: text.options,
          }),
        };
      });
      // setJsonData(jsonData);
      console.log(jsonData);
      setQuestionsIntoDb(jsonData, typee);
    };
    reader.readAsArrayBuffer(file);
  };

  return { ExcelToJson, ExcelToJsonQuestions };
};

export default useExcelToJson;
