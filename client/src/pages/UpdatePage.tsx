import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
// import JsonToExcel from "../utils/JsonToExcel";
import { QuestionDb } from "../../types";
import axios from "axios";
// import { JsonToExcelQuestions } from "../utils/JsonToExcelQuestion";
import SelectTextField from "../components/SelectTextField";
import useToast from "../store/useToast";
import useExcelToJson from "../hooks/useExcelToJson";
import useJsonToExcel from "../hooks/useJsonToExcel";

type Props = {};

const UpdatePage = () => {
  const { ExcelToJson, ExcelToJsonQuestions } = useExcelToJson();
  const { JsonToExcel, JsonToExcelQuestions } = useJsonToExcel();
  const setToast = useToast((state) => state.setToast);
  const deptmentFileRef = useRef<HTMLInputElement>(null);
  const questionFileRef = useRef<HTMLInputElement>(null);
  const masterFileRef = useRef<HTMLInputElement>(null);
  const masterLoginFileRef = useRef<HTMLInputElement>(null);
  // const [options,setOptions] = useState();
  const [subType, setSubType] = useState("lab");
  const [departments, setDepartments] = useState<Array<string>>([]);
  const [dept, setDept] = useState("all dept");
  //   const type = "lab";
  const getQuestions = async () => {
    try {
      const { data } = await axios.get<QuestionDb[]>(
        `${import.meta.env.VITE_ENDPOINT}/getQuestions/${subType}`,
      );
      console.log(data);
      if (data.length == 0) {
        setToast({ msg: "No data", variant: "error" });
        return;
      }
      JsonToExcelQuestions(data, `${subType.toUpperCase()}_QUESTIONS.xlsx`);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDepartments = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/getDepartments`,
      );
      console.log(data);
      if (data.length == 0) {
        setToast({ msg: "No data", variant: "error" });
        return;
      }
      JsonToExcel({ data, fileName: "Departments.xlsx" });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getMasterLoginData = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/getMasterLogin`,
      );
      console.log(data);
      if (data.length == 0) {
        setToast({ msg: "No data", variant: "error" });
        return;
      }
      JsonToExcel({ data, fileName: "MasterLogin.xlsx" });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getMasterData = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/getMasterData/${dept}`,
      );
      console.log(data);
      if (data.length == 0) {
        setToast({ msg: "No data", variant: "error" });
        return;
      }
      JsonToExcel({
        data,
        fileName: dept
          ? `${dept.toUpperCase()}_MasterTable.xlsx`
          : "MasterTable.xlsx",
        type: "masterlogin",
      });
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

  const triggerMasterLoginFileUpload = () => {
    if (masterLoginFileRef.current) {
      masterLoginFileRef.current.click(); // Simulate a click event on the input
    }
  };

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_ENDPOINT}/getDepartments`,
        );
        setDepartments(["all dept", ...data.map((d) => d.deptsname)]);
        // setDept(data[0]?.deptsname);
      } catch (error) {
        console.log(error.message);
      }
    };
    getDepartments();
  }, []);

  return (
    <div className="borde mx-auto grid min-h-[calc(100vh-6rem)] w-2/3 grid-cols-1 flex-col flex-wrap place-items-center border-black p-5 *:w-1/2 md:grid-cols-2">
      {/* Questions */}
      <div className="flex flex-col gap-5">
        <h1 className="text-center text-2xl font-bold">Questions</h1>
        <div className="flex flex-col gap-4">
          <div className="">
            <SelectTextField
              list={["lab", "theory", "infra", "others"]}
              value={subType}
              setValue={setSubType}
              placeholder="Type"
            />
          </div>
          <div className="flex gap-6">
            <input
              className="hidden"
              type="file"
              ref={questionFileRef}
              onChange={(e) => {
                ExcelToJsonQuestions(e, subType);
                e.target.value = "";
              }}
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
      {/* Master Table */}
      <div className="flex flex-col gap-5">
        <h1 className="text-center text-2xl font-bold">Master Table</h1>

        <SelectTextField
          placeholder="Department"
          list={departments}
          value={dept}
          setValue={setDept}
        />
        <div className="flex gap-6">
          <input
            className="hidden"
            type="file"
            ref={masterFileRef}
            onChange={(e) => {
              ExcelToJson(e, `setMasterData/${dept}`, dept);
              e.target.value = "";
            }}
          />
          <Button
            title="Upload"
            type="secondary"
            onClick={triggerMasterFileUpload}
          />
          <Button title="Download" type="primary" onClick={getMasterData} />
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
              ExcelToJson(e, "setDepartments");
              e.target.value = "";
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
      {/* Master Login */}
      <div className="flex flex-col gap-5">
        <h1 className="text-center text-2xl font-bold">Master Login</h1>

        <div className="flex gap-6">
          <input
            className="hidden"
            type="file"
            ref={masterLoginFileRef}
            onChange={(e) => {
              ExcelToJson(e, `setMasterLogin`);
              e.target.value = "";
            }}
          />
          <Button
            title="Upload"
            type="secondary"
            onClick={triggerMasterLoginFileUpload}
          />
          <Button
            title="Download"
            type="primary"
            onClick={getMasterLoginData}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;
