import { useState } from "react";
// import InputTextField from "../components/InputTextField";
import SelectTextField from "../components/SelectTextField";
import InputTextField from "../components/InputTextField";
// SelectTextField


const PasswordGenPage = () => {
//   const [value, setValue] = useState({
// value
//   });
  const [value, setValue] = useState<{ list?: string[]; label: string; value: string; }[]>([
    {
      list: ["2021-22", "2022-23"],
      label: "academic year",
      value:"none"
    },
    {
      list: ["UG", "PG"],
      label:"graduation",
      value:"none"
    },
    {
      list: ["CS", "AD","ME","EE","EC"],
      label:"department",
      value:"none"
    },
    {
      list: ["1", "2","3","4","5","6","7","8"],
      label:"semester",
      value:"none"
    },
    {
      list: ["1-A", "2-B","3-C"],
      label:"section",
      value:"none"
    },
    {
      list: ["1-pre", "2-post","3-msmg-pre","4-msmg-post"],
      label:"assignment type",
      value:"none"
    }, {
      label: "number of student",
      value: "",
    }, {
      label: "date",
      value: "",
    }, {
      label: "password",
      value:"",
    }
  ]);
  
  // console.log(value);
  

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-6 py-4">
      <section className="mx-auto w-full max-w-4xl p-3">
        <h1 className="text-2xl font-semibold">Generate User Credentials</h1>
        <div className="mt-2 flex flex-col gap-3 rounded-md border-2 border-black p-5 ">
          {/* <InputTextField label="Academic Year" setValue={setValue} /> */}
          {
            value.map((data,index) => {
              return (
                
                data.list ? <SelectTextField list={data.list} value={data.value} index={index} setValue={setValue} label={data.label} key={index} /> :
                  <InputTextField label={data.label} setValue={setValue} />
              )
            })
          }
          
        </div>
      </section>
    </main>
  );
};

export default PasswordGenPage;
