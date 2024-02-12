import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import InputTextField from "../components/InputTextField";
import SelectTextField from "../components/SelectTextField";
import generatePdf from "../utils/Generatepdf2";

const ReportGenPage = () => {
  const [academicyearlist, setAcademicyearlist] = useState<string[]>([]);
  const [academicyr, setAcademicyr] = useState("");
  const [graduation, setGraduation] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [asstype, setAsstype] = useState("");
  const [subtype, setSubtype] = useState("");
  const [reporttype, setReporttype] = useState("");
  const [subcode, setSubcode] = useState("");
  const [password, setPassword] = useState("");
  const [subcodelist, setSubCodeList] = useState<string[]>([]);

  const fetchCourseCode = async () => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_ENDPOINT}/getcoursecode`,
      {
        dept: department,
        degree: graduation,
        sem: parseInt(semester),
        section: section,

        academicyear: academicyr,
      },
    );

    data.forEach((val: any) => {
      setSubCodeList((pre) => [...pre, val["Sub Code"]]);
    });
  };

  useEffect(() => {
    const curYear = new Date().getFullYear();
    for (let i = curYear - 5; i < curYear + 3; i++) {
      setAcademicyearlist((pre) => [...pre, `${i}-${(i + 1) % 100}`]);
    }
  }, []);

  useEffect(() => {
    if (
      academicyr &&
      graduation &&
      department &&
      semester &&
      section &&
      reporttype.toLowerCase() == "markwise"
    ) {
      fetchCourseCode();
    } else if (reporttype.toLowerCase() == "markwise") {
      setReporttype("");
      alert("fill the above details");
    }
  }, [reporttype]);

  const value = [
    {
      list: [
        "AD",
        "CS",
        "EE",
        "EI",
        "CI",
        "BT",
        "IT",
        "ME",
        "MT",
        "EC",
        "PT",
        "PS",
        "MB",
      ],
      label: "department",
      value: department,
      setValue: setDepartment,
    },
    {
      list: academicyearlist,
      label: "academic year",
      value: academicyr,
      setValue: setAcademicyr,
    },
    {
      list: ["UG", "PG"],
      label: "graduation",
      value: graduation,
      setValue: setGraduation,
    },
    {
      list: ["1", "2", "3", "4", "5", "6", "7", "8"],
      label: "semester",
      value: semester,
      setValue: setSemester,
    },
    {
      list: ["A", "B", "C"],
      label: "section",
      value: section,
      setValue: setSection,
    },
    {
      label: "report type",
      value: reporttype,
      setValue: setReporttype,
      list: ["MarkWise", "subjectwise"],
    },
    {
      list: subcodelist,
      label: "subject code",
      value: subcode,
      setValue: setSubcode,
    },
    {
      list: ["theory", "lab", "infra"],
      label: "subject type",
      value: subtype,
      setValue: setSubtype,
    },
    {
      list: ["pre", "post", "mgmt-pre", "mgmt-final"],
      label: "assignment type",
      value: asstype,
      setValue: setAsstype,
    },
    {
      label: "password",
      value: password,
      setValue: setPassword,
      type: "password",
    },
  ];

  const genLoginId = async () => {
    const isAnyEmpty = value.some((item) => item.value == "" || 0);
    if (isAnyEmpty) {
      alert("fill the details");
    } else {
      const { data } = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/generateReport`,
        {
          dept: department,
          degree: graduation,
          sem: parseInt(semester),
          section: section,
          assessmenttype: asstype,
          academicyear: academicyr,
          password: password,
        },
        { withCredentials: true },
      );
      const header = [];
      const rows: any[] = [];
      header.push(...Object.keys(data[0]).filter((val) => val != "marks"));

      JSON.parse(data[0].marks).answers.forEach((_: any, index: number) => {
        header.push(`Q${index + 1}`);
      });

      data.forEach((val: any) => {
        const row = [];
        const value = Object.keys(data[0])
          .filter((val) => val != "marks")
          .map((key) => {
            return val[key];
          });

        row.push(...value);
        if (val.marks) {
          JSON.parse(val.marks).answers.forEach((mark: any) => {
            row.push(mark);
          });
        }
        rows.push([row]);
      });
      generatePdf(header, rows);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-6 py-4">
      <section className="mx-auto w-full max-w-4xl p-3">
        <h1 className="text-2xl font-semibold">Report Generation</h1>
        <div className="mt-2 flex flex-col gap-y-3  rounded-md border-2  border-black p-5 ">
          <div className="grid grid-cols-2 gap-3">
            {value.map((data, index) => {
              if (
                (reporttype.toLowerCase() == "subjectwise" &&
                  data.label == "subject code") ||
                (reporttype.toLowerCase() == "" && data.label == "subject code")
              ) {
                return null;
              }
              return data.list ? (
                <SelectTextField
                  list={data.list}
                  value={data.value}
                  setValue={data.setValue}
                  label={data.label}
                  key={index}
                />
              ) : (
                <InputTextField
                  key={index}
                  label={data.label}
                  type={data.type}
                  value={data.value}
                  setValue={data.setValue}
                />
              );
              // null
            })}
          </div>
          <Button
            title="Generate"
            onClick={genLoginId}
            disable={password == "Kcet@" ? false : true}
          />
        </div>
      </section>
    </main>
  );
};

export default ReportGenPage;
