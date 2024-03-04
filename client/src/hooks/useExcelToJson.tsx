import axios from "axios";
import React from "react";
import * as XLSX from "xlsx";
import useToast from "../store/useToast";

const useExcelToJson = () => {
  const setToast = useToast((state) => state.setToast);
  const setDataIntoDb = async (
    originalData: Array<object>,
    apiType: string,
  ) => {
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
    type?: string,
  ) => {
    try {
      // let status = {};
      const file = e.target.files?.[0];
      // console.log(file);

      if (!file) return;
      console.log(file.name, type);
      if (
        type &&
        !file.name.toLowerCase().trim().includes(type.toLowerCase())
      ) {
        setToast({ msg: "Insert the Valid Excel File", variant: "error" });
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        // console.log("in");

        const data = event.target?.result;
        // if (data && typeof data === "string") {
        // console.log("inn");

        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonResult: Array<Array<string>> = XLSX.utils.sheet_to_json(
          sheet,
          {
            header: 1,
            defval: " ",
          },
        );
        // Assuming first row as header
        console.log(type && type != "all dept");

        const headers =
          type && type != "all dept"
            ? [...jsonResult[0], "Dept"]
            : jsonResult[0];
        // console.log(headers);
        // console.log(jsonResult);
        // console.log(headers);

        const jsonData = jsonResult
          .slice(1)
          .filter((subArray) => {
            return !subArray.every((value) => value.toString().trim() === "");
          })
          .map((row) => {
            const obj: { [key: string]: string } = {};
            // console.log(row);
            // console.log(row.length);

            row.forEach((cellValue, index) => {
              const header = headers[index];
              // console.log(
              //   cellValue,
              //   (obj[header] = cellValue.toString().trim() == ""),
              // );

              obj[header] =
                cellValue.toString().trim() === "" ? " " : cellValue;
            });
            // const jsonLen = Object.keys(obj).length;

            // console.log(obj);

            const ans =
              type && type != "all dept" ? { ...obj, Dept: type } : { ...obj };
            // console.log(ans);

            return ans;
          });
        // setJsonData(jsonData);
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

  const setQuestionsIntoDb = async (
    originalData: Array<object>,
    typee: string,
  ) => {
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
    const isOthers = typee == "others";

    const file = e.target.files?.[0];
    // console.log(typee);

    if (!file) return;

    // console.log(file.name, typee);
    if (!file.name.toLowerCase().trim().includes(typee.toLowerCase())) {
      setToast({ msg: "Insert the Valid Excel File", variant: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target) return;

      const data = new Uint8Array(event.target.result as ArrayBuffer);

      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows: Array<Array<string | number>> = XLSX.utils.sheet_to_json(
        sheet,
        { header: 1, defval: " " },
      );
      // console.log(rows);

      const headers = rows.shift() as string[];
      // console.log(headers);
      console.log(rows);

      // const jsonData = rows.map((row) => {

      // });
      let errorMsg = "";
      const jsonData = [];
      const filteredRows = rows.filter((subArray) => {
        return !subArray.every((value) => value.toString().trim() === "");
      });
      for (let i = 0; i < filteredRows.length; i++) {
        const row = filteredRows[i];

        let question: string | null = null;
        let options: Array<string> = [];
        let type: string | null = null;

        for (let index = 0; index < headers.length; index++) {
          const header = headers[index];
          const value = row[index] !== undefined ? row[index] : null;

          if (header.toLowerCase() === "question") {
            // if (value?.trim() == "") {
            //   console.log("hai");
            //   return;
            // }
            // console.log(value);

            question = value;
            options = undefined;
          } else if (header.toLowerCase().includes("option")) {
            if (!options) {
              options = [];
            }
            options.push(value);
          } else if (header.toLowerCase() === "type") {
            type = value;
          } else {
            // Handle additional headers if needed
          }
          // console.log(question);
        }

        if (question?.trim() == "") {
          errorMsg = "Question shouldn't be empty";
          break;
        } else if (
          options?.filter((option) => option.trim() != "").length < 2
        ) {
          // console.log(options?.filter((option) => option.trim() != "").length);
          errorMsg = "A Question must have atleast two options";
          break;
        } else {
          let questionObj: { type: string; question: string } = {
            type: isOthers ? text.type : typee,
            question: JSON.stringify({
              question: question || "",
              options: options || [],
            }),
          };
          jsonData.push(questionObj);
        }
        console.log(options.length);

        //  return questionObj;
      }
      // setJsonData(jsonData);
      console.log(jsonData);
      // setQuestionsIntoDb(jsonData, typee);
      if (errorMsg == "") setQuestionsIntoDb(jsonData, typee);
      else setToast({ msg: errorMsg, variant: "error" });
    };
    reader.readAsArrayBuffer(file);
  };

  return { ExcelToJson, ExcelToJsonQuestions };
};

export default useExcelToJson;
