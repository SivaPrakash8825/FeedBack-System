import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import InputTextField from "../components/InputTextField";
import SelectTextField from "../components/SelectTextField";
import generatePdf from "../utils/Generatepdf2";
import generatePdf1 from "../utils/Generatepdf";
import useToast from "../store/useToast";
import useReportGenerator from "../hooks/useReportGenerator";
import useDepartment from "../store/useDepartment";

const ReportGenPage = ({
  academicyearlist,
}: {
  academicyearlist: string[];
}) => {
  const { dept } = useDepartment();
  const setToast = useToast((state) => state.setToast);
  const { ForTheoryAndLab, ForInfra } = useReportGenerator();

  const [academicyr, setAcademicyr] = useState("");
  const [graduation, setGraduation] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [asstype, setAsstype] = useState("");
  const [subtype, setSubtype] = useState("");
  const [reporttype, setReporttype] = useState("");
  const [password, setPassword] = useState("");

  const GenerateSubjectWisePdf = (
    data: { [x: string]: any; subject_marks: any }[],
  ) => {
    function assessMark(markk: string) {
      const mark = parseFloat(markk);
      if (mark >= 0 && mark < 40) {
        return "Normal";
      } else if (mark >= 40 && mark < 60) {
        return "Average";
      } else if (mark >= 60 && mark < 80) {
        return "Good";
      } else if (mark >= 80 && mark < 90) {
        return "Very Good";
      } else if (mark >= 90 && mark <= 100) {
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
        const finalAvg = (
          (calculateAverageMarks(averageMarks) / 5) *
          100
        ).toFixed(2);
        // console.log((parseFloat(finalAvg) / 5) * 100);
        const assessment = assessMark(finalAvg);

        const { subject_marks, ...rest } = student;
        return { ...rest, finalAvg, assessment };
      },
    );

    console.log("data : ", updatedData);
    if (updatedData.length == 0)
      return setToast({
        msg: "No Data!!",
        variant: "error",
      });
    const header = [...Object.keys(updatedData[0])];
    const rows = updatedData.map(
      (item: { [s: string]: unknown } | ArrayLike<unknown>) =>
        Object.values(item),
    );
    // console.log(header);
    // console.log(rows);
    console.log([rows, rows]);
    const status = generatePdf(
      header,
      rows,
      reporttype.replace(/\s+/g, ""),
      department,
      academicyr,
      parseInt(semester),
      subtype,
      section,
      asstype,
    );
    return setToast(status);
  };

  const getDepartmentList = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_ENDPOINT}/getDepartments`,
    );
    let list: string[] = [];
    for (const val of data) {
      list = [...list, val.deptsname];
    }
  };

  useEffect(() => {
    getDepartmentList();
  }, []);

  const value = [
    {
      list: academicyearlist,
      label: "academic year",
      value: academicyr,
      setValue: setAcademicyr,
    },
    {
      list: ["theory", "lab", "infra"],
      label: "subject type",
      value: subtype,
      setValue: setSubtype,
    },
    {
      list: dept,
      label: "department",
      value: department,
      setValue: setDepartment,
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
      list: ["A", "B", "C", "D", "E"],
      label: "section",
      value: section,
      setValue: setSection,
    },
    {
      label: "report type",
      value: reporttype,
      setValue: setReporttype,
      list: ["Mark wise", "subject wise"],
    },
    // {
    //   list: subcodelist,
    //   label: "subject code",
    //   value: subcode,
    //   setValue: setSubcode,
    // },

    {
      list: ["pre", "post"],
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

  const fetchData = async () => {
    try {
      const apiType =
        reporttype.replace(/\s+/g, "").toLowerCase().trim() == "markwise" ||
        subtype == "infra"
          ? "generateReport"
          : "generateReportSubject";

      const { data } = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/${apiType}`,
        {
          dept: department,
          degree: graduation,
          sem: parseInt(semester),
          section: section,
          assessmenttype: asstype,
          academicyear: academicyr,
          // coursecode: subcode,
          password: password,
          subtype: subtype,
        },
        { withCredentials: true },
      );
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  const genLoginId = async () => {
    const isAnyEmpty =
      subtype != "infra"
        ? value.some((item) => item.value == "" || 0)
        : academicyr != ""
          ? false
          : true;
    if (subtype.trim() == "infra") {
      setReporttype("markwise");
    }

    if (isAnyEmpty) {
      alert("fill the details");
    } else {
      const data = await fetchData();

      // console.log(data);

      if (data.length) {
        if (
          reporttype.replace(/\s+/g, "").toLowerCase().trim() == "markwise" ||
          subtype == "infra"
        ) {
          if (subtype.trim() != "infra") {
            console.log(data);

            const { header, newallfield, avgheader } = ForTheoryAndLab(data);
            generatePdf1(
              header,
              newallfield,
              reporttype,
              department,
              academicyr,
              parseInt(semester),
              subtype,
              section,
              avgheader,
              asstype,
            );
          } else {
            const { header, newallfield, avgheader } = ForInfra(data);
            generatePdf1(
              header,
              newallfield,
              reporttype,
              department,
              academicyr,
              parseInt(semester),
              subtype,
              section,
              avgheader,
              asstype,
            );
          }
        } else {
          GenerateSubjectWisePdf(data);
        }
      } else {
        setToast({
          msg: "No Data!!",
          variant: "error",
        });
      }
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-6 py-4">
      <section className="mx-auto w-full max-w-4xl p-3">
        <h1 className="text-2xl font-semibold">Report Generation</h1>
        <div className="mt-2 flex flex-col gap-y-3  rounded-md border-2  border-black p-5 ">
          <div className="grid grid-cols-2 gap-3">
            {value.map((data, index) => {
              return data.list ? (
                <div
                  key={index}
                  className={`${subtype == "infra" && index > 1 ? "pointer-events-none opacity-[0.5]" : null}`}
                >
                  <SelectTextField
                    list={data.list}
                    value={data.value}
                    setValue={data.setValue}
                    label={data.label}
                  />
                </div>
              ) : (
                <InputTextField
                  key={index}
                  label={data.label}
                  type={data.type}
                  value={data.value}
                  setValue={data.setValue}
                />
              );
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
