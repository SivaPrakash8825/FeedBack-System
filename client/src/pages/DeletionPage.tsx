import { useEffect, useState } from "react";
import RadioField from "../components/RadioField";
import SelectTextField from "../components/SelectTextField";
import axios from "axios";
import useToast from "../store/useToast";
import Button from "../components/Button";

// type Props = {};
type responseType = {
  validto: string;
  validfrom: string;
  username: string;
  dept: string;
  academicyear: string;
  sem: number;
  assessmenttype: string;
  section: string;
};

const DeletionPage = ({ academicyearlist }: { academicyearlist: string[] }) => {
  const [option, setOption] = useState("");
  const setToast = useToast((state) => state.setToast);
  const [value, setValue] = useState("Feedbacklogin");
  const [rows, setRows] = useState([]);
  const [duplicaterows, setDuplicateRows] = useState<responseType[]>([]);
  const [asstype, setAssType] = useState("All");
  const [academicyr, setAcademicyr] = useState("All");
  const setOptionFun = (val: string) => {
    setOption(val);
  };

  const deleteRecords = async (option: string) => {
    const val = confirm("Are you sure to delete?");
    if (val) {
      const { data } = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/deleterecords`,
        {
          data: {
            option: option,
            table: value,
          },
        },
      );
      if (data) {
        setToast({
          msg: "deleted successfully",
          variant: "success",
        });
        getDeletionData();
      }
    }
  };

  const filter = (data: responseType[]) => {
    if (asstype.toLowerCase() == "all" && academicyr.toLowerCase() == "all") {
      setDuplicateRows(data);
    } else {
      const arr = data.filter((val: responseType) => {
        return academicyr.toLowerCase() != "all" &&
          asstype.toLowerCase() != "all"
          ? val.academicyear == academicyr &&
              val.assessmenttype.toLowerCase() == asstype.toLowerCase()
          : asstype.toLowerCase() == "all"
            ? val.academicyear == academicyr
            : val.assessmenttype.toLowerCase() == asstype.toLowerCase();
      });

      setDuplicateRows(arr);
    }
  };

  const getDeletionData = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_ENDPOINT}/getdeletiondata/${value}`,
    );
    console.log(data);

    setRows(data);
    value != "Feedbacklogin" ? filter(data) : null;
  };

  useEffect(() => {
    getDeletionData();
  }, [value]);

  useEffect(() => {
    filter(rows);
  }, [asstype, academicyr]);

  const SetTableHead = () => {
    if (rows.length <= 0) {
      return <th>no data</th>;
    } else {
      return (
        <>
          {Object.keys(rows[0]).map((val, index) => {
            return (
              <th key={index} className=" border p-3 capitalize  ">
                {val}
              </th>
            );
          })}
          <th>Trash</th>
        </>
      );
    }
  };
  const SetTableBody = () => {
    return duplicaterows.map((data, index) => {
      return (
        <tr key={index}>
          {Object.values(data).map((val, index) => {
            return (
              <td key={index} className=" border p-3 text-center uppercase ">
                {val}
              </td>
            );
          })}
          <td
            onClick={() =>
              deleteRecords(
                `${data.assessmenttype}/${data.academicyear}/${data.dept}/${data.sem}/${data.section} `,
              )
            }
            className={` cursor-pointer border p-3 text-center`}
          >
            🗑️
          </td>
        </tr>
      );
    });
  };
  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] items-center justify-center gap-0 ">
      <div className="flex min-h-[60vh] w-[80vw] gap-x-5 ">
        <div className=" justify-enter flex h-[60vh] w-[30%] flex-col items-center ">
          <div className=" flex w-full flex-col gap-y-3 rounded-3xl  border p-5">
            <h1 className=" text-xl font-black capitalize tracking-wider">
              Filter here
            </h1>
            <SelectTextField
              list={["Feedbacklogin", "theory", "lab", "infra"]}
              value={value}
              setValue={setValue}
            />
            <div
              className={`grid grid-cols-2  ${value == "Feedbacklogin" ? "pointer-events-none opacity-[0.5]" : null} gap-x-3`}
            >
              <SelectTextField
                list={["all", "pre", "post"]}
                value={asstype}
                setValue={setAssType}
              />
              <SelectTextField
                list={["all", ...academicyearlist]}
                value={academicyr}
                setValue={setAcademicyr}
              />
            </div>
          </div>
        </div>
        <div className=" mt-4  flex w-[60%]  flex-col items-center ">
          <table className=" w-full border-collapse ">
            <thead>
              <tr className=" rounded-sm border ">
                {value == "Feedbacklogin" ? (
                  <th className="  p-3 capitalize  ">
                    delete the expired login data
                  </th>
                ) : (
                  <SetTableHead />
                )}
              </tr>
            </thead>
            <tbody>
              {value == "Feedbacklogin" ? (
                rows.length == 0 ? (
                  <tr>
                    <td className="pointer-events-none p-2 opacity-[0.5]">
                      <Button title=" Delete⚡" />
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="p-2">
                      <Button
                        title="Delete⚡"
                        onClick={() => deleteRecords("")}
                      />
                    </td>
                  </tr>
                )
              ) : (
                <SetTableBody />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeletionPage;
