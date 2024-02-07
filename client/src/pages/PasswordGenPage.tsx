import { useState } from "react";
// import InputTextField from "../components/InputTextField";
import SelectTextField from "../components/SelectTextField";
import InputTextField from "../components/InputTextField";
import Button from "../components/Button";
import axios from "axios";
// SelectTextField


const PasswordGenPage = () => {
//   const [value, setValue] = useState({
// value
  //   });
  const [academicyr, setAcademicyr] = useState("");
  const [graduation, setGraduation] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [asstype, setAsstype] = useState("");
  const [noOfstd, setNoOfstd] = useState(0);
  const [validfrom, setValidfrom] = useState("");
  const [validto, setValidto] = useState("");
  
  const [password, setPassword] = useState("");
  
  const value= [
    {
      list: ["2021-22", "2022-23"],
      label: "academic year",
      value: academicyr,
      setValue:setAcademicyr
    },
    {
      list: ["UG", "PG"],
      label:"graduation",
      value:graduation,
      setValue:setGraduation
    },
    {
      list: ["CS", "AD","ME","EE","EC"],
      label:"department",
      value: department,
      setValue:setDepartment
    },
    {
      list: ["1", "2","3","4","5","6","7","8"],
      label:"semester",
      value:semester,
      setValue:setSemester
    },
    {
      list: ["A", "B","C"],
      label:"section",
      value: section,
      setValue:setSection
    },
    {
      list: ["pre", "post","msmg-pre","msmg-post"],
      label:"assignment type",
      value: asstype,
      setValue:setAsstype
    }, {
      label: "number of student",
      value: noOfstd,
      setValue: setNoOfstd,
type:"number",
    }, {
      label: "from date",
      value: validfrom,
      setValue: setValidfrom,
      type:"date"
    },  {
      label: "to date",
      value: validto,
      setValue:setValidto,
      type:"date"
    }, {
      label: "password",
      value: password,
      setValue:setPassword,
      type:"password"
    }
  ];
  
  const genLoginId = async () => {
    
    
    const isAnyEmpty = value.some(item => item.value =="" || 0);
    if (isAnyEmpty) {
      alert("fill the details")
    } else {
      const { data } = await axios.post(`${import.meta.env.VITE_ENDPOINT}/generateLogin`, {
        
        count: noOfstd,
        validfrom: validfrom,
        validto: validto,
        dept: department,
        degree: graduation,
        sem: parseInt(semester),
        section: section,
        assessmenttype: asstype,
        academicyear: academicyr,
        password: password
        
      }, { withCredentials: true });
      console.log(data);
      
    }
}
  

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-6 py-4">
      <section className="mx-auto w-full max-w-4xl p-3">
        <h1 className="text-2xl font-semibold">Generate User Credentials</h1>
        <div className="mt-2 flex flex-col gap-3 rounded-md border-2 border-black p-5 ">
         
          {
            value.map((data,index) => {
              return (
                
                data.list ? <SelectTextField list={data.list} value={data.value} setValue={data.setValue} label={data.label} key={index} /> :
                  <InputTextField key={index} label={data.label} type={data.type}  value={data.value} setValue={data.setValue} />
              )
            })
          }
          <Button title="Generate" onClick={genLoginId}/>
        </div>
      </section>
    </main>
  );
};

export default PasswordGenPage;
