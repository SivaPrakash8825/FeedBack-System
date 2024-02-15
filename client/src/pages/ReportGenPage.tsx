import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import InputTextField from "../components/InputTextField";
import SelectTextField from "../components/SelectTextField";
import generatePdf from "../utils/Generatepdf2";
import generatePdf1 from "../utils/Generatepdf";
import useToast from "../store/useToast";

const ReportGenPage = ({
  academicyearlist,
}: {
  academicyearlist: string[];
}) => {
  const setToast = useToast((state) => state.setToast);

  const [academicyr, setAcademicyr] = useState("");
  const [graduation, setGraduation] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentlist, setDepartmentList] = useState<string[]>([]);
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [asstype, setAsstype] = useState("");
  const [subtype, setSubtype] = useState("");
  const [reporttype, setReporttype] = useState("");
  // const [subcode, setSubcode] = useState("");
  const [password, setPassword] = useState("");
  // const [subcodelist, setSubCodeList] = useState<string[]>([]);

  const GenerateSubjectWisePdf = (
    data: { [x: string]: any; subject_marks: any }[],
  ) => {
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
    setDepartmentList(list);
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
      list: departmentlist,
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
      list: ["A", "B", "C"],
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
        reporttype.replace(/\s+/g, "").toLowerCase().trim() == "markwise"
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
    const allfields: any = {};
    //   [{
    //   staffname: "hema",
    //   coursecode: "adsf",

    //
    // }]
    const isAnyEmpty =
      subtype != "infra"
        ? value.some((item) => item.value == "" || 0)
        : academicyr != ""
          ? false
          : true;
    if (subtype == "infra") {
      console.log("infra");

      setReporttype("markwise");
    }

    if (isAnyEmpty) {
      alert("fill the details");
    } else {
      const data = await fetchData();

      // console.log(data);

      if (reporttype.replace(/\s+/g, "").toLowerCase().trim() == "markwise") {
        if (data.length) {
          const header = [];
          const avgheader = [];
          // const rows: any[] = [];
          // const avgrows: any[] = [];

          if (subtype.toLowerCase() == "infra") {
            header.push(
              ...Object.keys(data[0]).filter(
                (val) =>
                  ![
                    "marks",
                    "Staff",
                    "coursecode",
                    "academicyear",
                    "degreetype",
                    "comments",
                    "Sub Name",
                    "dept",
                    "section",
                    "sem",
                    "assessmenttype",
                  ].includes(val),
              ),
            );
          } else {
            header.push(
              ...Object.keys(data[0]).filter(
                (val) =>
                  ![
                    "marks",
                    "Staff",
                    "coursecode",
                    "academicyear",
                    "degreetype",
                    "comments",
                    "Sub Name",
                    "dept",
                  ].includes(val),
              ),
            );
          }

          JSON.parse(data[0].marks).answers.forEach(
            (val: any, index: number) => {
              header.push(`Q${index + 1}`);
              avgheader.push(`Q${index + 1}`);
            },
          );
          header.push("Total");
          avgheader.push("AVG");
          const parseanswer = (val: any) => {
            const arr: any[] = [];
            let total = 0;
            JSON.parse(val.marks).answers.map((mark: number, index: number) => {
              total += mark;
              arr[index] = mark;
              if (JSON.parse(val.marks).answers.length - 1 == index) {
                arr[index + 1] = total;
              }
            });
            return arr;
          };
          data.forEach((val: any) => {
            const key = subtype == "infra" ? val.dept : val.coursecode;
            if (!allfields[key]) {
              allfields[key] = {
                ...val,
                dept: val.dept,
                marks: [[val.username, ...parseanswer(val)]],
                usercomments: [[val.username, val.comments]],
              };
            } else {
              const usercom = [val.username, val.comments];

              allfields[key].marks.push([val.username, ...parseanswer(val)]);
              allfields[key].usercomments.push(usercom);
            }
          });

          const newallfield = Object.values(allfields);
          const transpose = (matrix: any[]) => {
            return matrix[0]
              .map((_: any, colIndex: number) =>
                matrix.map((row) => row[colIndex]),
              )
              .slice(1);
          };

          const calculateAverage = (column: any) => {
            const sum = column.reduce((acc: any, value: any) => acc + value, 0);
            return (sum / column.length).toFixed(2);
          };
          // const newallfield.
          // console.log(newallfield);

          newallfield.forEach((data: any) => {
            const transposedData = transpose(data.marks);

            // Calculate average for each column
            const columnAverages = transposedData.map((column: any) =>
              calculateAverage(column),
            );

            data.avgrow = columnAverages;
          });
          console.log(newallfield);

          const status = generatePdf1(
            header,
            newallfield,
            reporttype,
            department,
            academicyr,
            parseInt(semester),
            subtype,
            section,
            avgheader,
          );
          setToast(status);
        } else {
          setToast({
            msg: "No Data!!",
            variant: "error",
          });
        }
      } else {
        GenerateSubjectWisePdf(data);
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
                  className={`${subtype == "infra" && index > 1 ? "pointer-events-none opacity-[0.5]" : null}`}
                >
                  <SelectTextField
                    list={data.list}
                    value={data.value}
                    setValue={data.setValue}
                    label={data.label}
                    key={index}
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
