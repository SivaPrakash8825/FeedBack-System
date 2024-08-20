import { RefAttributes, RefObject, useEffect, useRef, useState } from "react";
import Button from "../components/Button";
// import JsonToExcel from "../utils/JsonToExcel";
import { QuestionDb } from "../../types";
import axios from "axios";
// import { JsonToExcelQuestions } from "../utils/JsonToExcelQuestion";
import SelectTextField from "../components/SelectTextField";
import useToast from "../store/useToast";
import useExcelToJson from "../hooks/useExcelToJson";
import useJsonToExcel from "../hooks/useJsonToExcel";

type Props = { academicyearlist: string[] };

const UpdatePage = ({ academicyearlist }: Props) => {
  const { ExcelToJson, ExcelToJsonQuestions } = useExcelToJson();
  const { JsonToExcel, JsonToExcelQuestions } = useJsonToExcel();
  const setToast = useToast((state) => state.setToast);
  const deptmentFileRef = useRef<HTMLInputElement>(null);
  const questionFileRef = useRef<HTMLInputElement>(null);
  const masterFileRef = useRef<HTMLInputElement>(null);
  const masterLoginFileRef = useRef<HTMLInputElement>(null);
  // const [options,setOptions] = useState();
  const [subType, setSubType] = useState<string>("lab");
  const [departments, setDepartments] = useState<Array<string>>([]);
  const [dept, setDept] = useState("all dept");
  const [academicYear, setAcademicYear] = useState("all");
  //   const type = "lab";

  const updatePageData = [
    {
      title: "Questions",
      select: {
        list: ["lab", "theory", "infra"],
        // list: ["lab", "theory", "infra", "others"],
        value: subType,
        setValue: setSubType,
        placeholder: "Type",
      },
      ref: questionFileRef,
      upload: {
        type: "question",
        param1: subType,
      },
      download: {
        api: `getQuestions/${subType}`,
        filename: `${subType.toUpperCase()}_QUESTIONS.xlsx`,
        type: "question",
        value: subType,
      },
    },
    {
      title: "Master Table",
      select: {
        placeholder: "Department",
        list: departments,
        value: dept,
        setValue: setDept,
      },
      select1: {
        placeholder: "Academic Year",
        list: ["all", ...academicyearlist],
        value: academicYear,
        setValue: setAcademicYear,
      },
      ref: masterFileRef,
      upload: {
        api: `setMasterData/${dept}/${academicYear}`,
        dept: dept,
      },
      download: {
        api: `getMasterData/${dept}/${academicYear}`,
        filename: dept
          ? `${academicYear.toUpperCase()} AY_${dept.toUpperCase()} DEPT_MasterTable.xlsx`
          : `${academicYear.toUpperCase()}_MasterTable.xlsx`,
        type: "masterlogin",
      },
    },
    {
      title: "Departments",
      ref: deptmentFileRef,
      upload: {
        api: "setDepartments",
      },
      download: {
        api: "getDepartments",
        filename: "Departments.xlsx",
      },
    },
    {
      title: "Master Login",
      ref: masterLoginFileRef,
      upload: {
        api: `setMasterLogin`,
      },
      download: {
        api: "getMasterLogin",
        filename: "MasterLogin.xlsx",
      },
    },
  ];

  const fetchDataAndDownload = async (
    api: string,
    filename: string,
    type?: string,
  ) => {
    try {
      const { data } = await axios.get<QuestionDb[]>(
        `${import.meta.env.VITE_ENDPOINT}/${api}`,
      );
      console.log(data);
      // if (data.length == 0) {
      //   setToast({ msg: "No data", variant: "error" });
      //   return;
      // }
      type == "question"
        ? JsonToExcelQuestions(data, filename, subType)
        : JsonToExcel(data, filename, data.length == 0);
    } catch (error) {
      console.log(error.message);
    }
  };

  const triggerFileUpload = (currRef: RefObject<HTMLInputElement>) => {
    if (currRef.current) {
      currRef.current.click(); // Simulate a click event on the input
    }
  };

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_ENDPOINT}/getDepartments`,
        );
        setDepartments([
          "all dept",
          ...data.map((d: { deptsname: string }) => d.deptsname),
        ]);
        // setDept(data[0]?.deptsname: React.ChangeEvent<HTMLInputElement>, typee: string, subType?: string;
      } catch (err) {
        console.log(err.message);
      }
    };
    getDepartments();
  }, []);

  return (
    <div className="borde mx-auto grid min-h-[calc(100vh-6rem)] w-2/3 grid-cols-1 flex-col flex-wrap place-items-center border-black p-5 *:w-1/2 md:grid-cols-2">
      {updatePageData.map((data, i) => {
        return (
          <div key={i} className="flex flex-col gap-5">
            <h1 className="text-center text-2xl font-bold">{data.title}</h1>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                {data.select && (
                  <div className="w-full">
                    <SelectTextField
                      list={data.select.list}
                      value={data.select.value}
                      setValue={data.select.setValue}
                      placeholder={data.select.placeholder}
                    />
                  </div>
                )}
                {data.select1 && (
                  <div className="w-full">
                    <SelectTextField
                      list={data.select1.list}
                      value={data.select1.value}
                      setValue={data.select1.setValue}
                      placeholder={data.select1.placeholder}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-6">
                <input
                  className="hidden"
                  type="file"
                  ref={data.ref}
                  onChange={(e) => {
                    if (data.upload.type == "question") {
                      ExcelToJsonQuestions(e, data.upload.param1);
                    } else {
                      ExcelToJson(
                        e,
                        data.upload.api as string,
                        data.upload.dept && data.upload.dept,
                      );
                    }
                    e.target.value = "";
                  }}
                />
                <Button
                  title="Upload"
                  type="secondary"
                  onClick={() => triggerFileUpload(data.ref)}
                />
                <Button
                  title="Download"
                  type="primary"
                  onClick={() =>
                    fetchDataAndDownload(
                      data.download.api,
                      data.download.filename,
                      data.download.type,
                    )
                  }
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* <div className="flex flex-col gap-5">
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
              onClick={() => triggerFileUpload(questionFileRef)}
            />
            <Button
              title="Download"
              type="primary"
              onClick={() =>
                fetchDataAndDownload(
                  `getQuestions/${subType}`,
                  `${subType.toUpperCase()}_QUESTIONS.xlsx`,
                )
              }
            />
          </div>
        </div>
      </div>
      
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
            onClick={() => triggerFileUpload(masterFileRef)}
          />
          <Button title="Download" type="primary" onClick={getMasterData} />
        </div>
      </div>
    
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
            onClick={() => triggerFileUpload(deptmentFileRef)}
          />
          <Button title="Download" type="primary" onClick={getDepartments} />
        </div>
      </div>
     
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
            onClick={() => triggerFileUpload(masterLoginFileRef)}
          />
          <Button
            title="Download"
            type="primary"
            onClick={getMasterLoginData}
          />
        </div>
      </div> */}
    </div>
  );
};

export default UpdatePage;
