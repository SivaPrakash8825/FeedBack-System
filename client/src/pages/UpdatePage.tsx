import React, { useRef, useState } from "react";
import Button from "../components/Button";
// import JsonToExcel from "../utils/JsonToExcel";
import { QuestionDb } from "../../types";
import axios from "axios";
import { JsonToExcelQuestions } from "../utils/JsonToExcelQuestion";
import SelectTextField from "../components/SelectTextField";
import { ExcelToJsonQuestions } from "../utils/ExcelToJsonQuestions";
import JsonToExcel from "../utils/JsonToExcel";
import { ExcelToJson } from "../utils/ExcelToJson";
import useToast from "../store/useToast";

type Props = {};

const UpdatePage = (props: Props) => {
  const setToast = useToast((state) => state.setToast);
  const deptmentFileRef = useRef<HTMLInputElement>(null);
  const questionFileRef = useRef<HTMLInputElement>(null);
  const masterFileRef = useRef<HTMLInputElement>(null);
  // const [options,setOptions] = useState();
  const [subType, setSubType] = useState("lab");
  //   const type = "lab";
  const getQuestions = async () => {
    try {
      const { data } = await axios.get<QuestionDb[]>(
        `${import.meta.env.VITE_ENDPOINT}/getQuestions/${subType}`,
      );
      console.log(data);
      const status = JsonToExcelQuestions(
        data,
        `${subType.toUpperCase()}_QUESTIONS.xlsx`,
      );
      setToast(status);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDepartments = async () => {
    try {
      const { data } = await axios.get<QuestionDb[]>(
        `${import.meta.env.VITE_ENDPOINT}/getDepartments`,
      );
      console.log(data);
      const status = JsonToExcel({ data, fileName: "Departments.xlsx" });
      setToast(status);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getMasterData = async () => {
    try {
      const { data } = await axios.get<QuestionDb[]>(
        `${import.meta.env.VITE_ENDPOINT}/getMasterData`,
      );
      console.log(data);
      const status = JsonToExcel({ data, fileName: "MasterTable.xlsx" });
      setToast(status);
    } catch (error) {
      console.log(error.message);
    }
  };

  const triggerDepartmentFileUpload = () => {
    if (deptmentFileRef.current) {
      deptmentFileRef.current.click(); // Simulate a click event on the input
    }
  };

  const triggerQuestionFileUpload = () => {
    if (questionFileRef.current) {
      questionFileRef.current.click(); // Simulate a click event on the input
    }
  };

  const triggerMasterFileUpload = () => {
    if (masterFileRef.current) {
      masterFileRef.current.click(); // Simulate a click event on the input
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] flex-col flex-wrap items-center gap-10 border border-black p-5 ">
      {/* Questions */}
      <div className="flex flex-col gap-5">
        <h1 className="text-center text-2xl font-bold">Questions</h1>
        <div className="flex flex-col gap-4">
          <div className="">
            <SelectTextField
              list={["lab", "theory", "infra"]}
              value={subType}
              setValue={setSubType}
            />
          </div>
          <div className="flex gap-6">
            <input
              className="hidden"
              type="file"
              ref={questionFileRef}
              onChange={(e) => ExcelToJsonQuestions(e, subType)}
            />
            <Button
              title="Upload"
              type="secondary"
              onClick={triggerQuestionFileUpload}
            />
            <Button title="Download" type="primary" onClick={getQuestions} />
          </div>
        </div>
      </div>

      {/* Department Table */}
      <div className="flex flex-col gap-5">
        <h1 className="text-center text-2xl font-bold">Departments</h1>
        <div className="flex gap-6">
          <input
            className="hidden"
            type="file"
            ref={deptmentFileRef}
            onChange={(e) => {
              const status = ExcelToJson(e, "setDepartments");
              // setToast(status);
            }}
          />
          <Button
            title="Upload"
            type="secondary"
            onClick={triggerDepartmentFileUpload}
          />
          <Button title="Download" type="primary" onClick={getDepartments} />
        </div>
      </div>

      {/* Master Table */}
      <div className="flex flex-col gap-5">
        <h1 className="text-center text-2xl font-bold">Master Table</h1>
        <div className="flex gap-6">
          <input
            className="hidden"
            type="file"
            ref={masterFileRef}
            onChange={(e) => ExcelToJson(e, "setMasterData")}
          />
          <Button
            title="Upload"
            type="secondary"
            onClick={triggerMasterFileUpload}
          />
          <Button title="Download" type="primary" onClick={getMasterData} />
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;
