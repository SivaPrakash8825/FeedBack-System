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

  useEffect(() => {
    const curYear = new Date().getFullYear();
    for (let i = curYear - 5; i < curYear + 3; i++) {
      setAcademicyearlist((pre) => [...pre, `${i}-${(i + 1) % 100}`]);
    }
  }, []);

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
      list: ["theory", "lab", "infra"],
      label: "subject type",
      value: subtype,
      setValue: setSubtype,
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
      list: ["pre", "post", "mgmt-pre", "mgmt-final"],
      label: "assignment type",
      value: asstype,
      setValue: setAsstype,
    },
    {
      label: "report type",
      value: reporttype,
      setValue: setReporttype,
      list: ["MarkWise", "subjectwise"],
    },
    {
      list: ["VAI11", "CAI899", "AI2201"],
      label: "subject code",
      value: subcode,
      setValue: setSubcode,
    },
    {
      label: "password",
      value: password,
      setValue: setPassword,
      type: "password",
    },
  ];

  const fetchData = async () => {
    try {
      const apiType =
        reporttype == "MarkWise" ? "generateReport" : "generateReportSubject";
      const { data } = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/${apiType}`,
        {
          dept: department,
          degree: graduation,
          sem: parseInt(semester),
          section: section,
          assessmenttype: asstype,
          academicyear: academicyr,
          password: password,
          subcode: subcode,
        },
        { withCredentials: true },
      );
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  const genLoginId = async () => {
    const isAnyEmpty = value.some((item) => item.value == "" || 0);
    if (isAnyEmpty) {
      alert("fill the details");
    } else {
      const data = await fetchData();
      // console.log(data);

      if (reporttype == "MarkWise") {
        const header = [];
        const rows: any[] = [];
        header.push(...Object.keys(data[0]).filter((val) => val != "marks"));

        JSON.parse(data[0].marks).answers.forEach((val: any, index: number) => {
          header.push(`Q${index + 1}`);
        });

        data.forEach((val: { [x: string]: any; marks: string }) => {
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
        generatePdf(
          header,
          rows,
          subtype,
          department,
          academicyr,
          parseInt(semester),
          subtype,
          section,
        );
      } else {
        // return;
        // const header = [...Object.keys(data[0])];
        // const rows = data.map((item) => Object.values(item));

        function assessMark(markk: string) {
          const mark = parseFloat(markk);
          if (mark >= 0 && mark < 1) {
            return "Normal";
          } else if (mark >= 1 && mark < 2) {
            return "Average";
          } else if (mark >= 2 && mark < 3) {
            return "Good";
          } else if (mark >= 3 && mark < 4) {
            return "Very Good";
          } else if (mark >= 4 && mark <= 5) {
            return "Excellent";
          } else {
            return "Invalid mark";
          }
        }
        // console.log(rows);
        function calculateAverageMarks(arr: number[]) {
          // console.log(arr);

          const sum = arr.reduce((acc, val) => acc + val, 0);
          const avg = sum / arr.length; // Nan
          return avg;

          // return sum / marksArray.length;
        }

        // Calculate and add average marks to the data and remove subject_marks
        const updatedData = data.map(
          (student: { [x: string]: any; subject_marks: any }) => {
            const marksArray = student.subject_marks
              .split("-")
              .map((subMarks: string) => JSON.parse(subMarks).answers);
            // console.log(marksArray);

            const averageMarks = marksArray.map((mark: number[]) => {
              return calculateAverageMarks(mark);
            });
            // console.log(averageMarks);
            const finalAvg = calculateAverageMarks(averageMarks).toFixed(2);
            // console.log(finalAvg);
            const assessment = assessMark(finalAvg);

            const { subject_marks, ...rest } = student;
            return { ...rest, finalAvg, assessment };
          },
        );

        console.log("data : ", updatedData);
        const header = [...Object.keys(updatedData[0])];
        const rows = updatedData.map(
          (item: { [s: string]: unknown } | ArrayLike<unknown>) =>
            Object.values(item),
        );
        // console.log(header);
        // console.log(rows);
        console.log([rows, rows]);
        generatePdf(
          header,
          rows,
          reporttype,
          department,
          academicyr,
          parseInt(semester),
          subtype,
          section,
        );
      }
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-6 py-4">
      <section className="mx-auto w-full max-w-4xl p-3">
        <h1 className="text-2xl font-semibold">Generate User Credentials</h1>
        <div className="mt-2 flex flex-col gap-y-3  rounded-md border-2  border-black p-5 ">
          <div className="grid grid-cols-2 gap-3">
            {value.map((data, index) => {
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
