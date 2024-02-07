import { HTMLInputTypeAttribute, useState } from "react";
import Spinner from "./Spinner";
import  "../index.css"

type Props = {
  label?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value:string;
  list: string[];

  setValue: (val: string) => void;
};

const SelectTextField = ({  label,list,value,setValue }: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-semibold capitalize">{label}</label>}
      <div
        onClick={() => setShowDropdown((e) => !e)}
        className={`relative w-full rounded-md border-2 ${showDropdown ? "border-gray-600" : "border-gray-200"} select-none  p-2`}
      >
        <p className="">{ value || "none"}</p>
        {/* Dropdown */}
        {showDropdown && (
          <div className={`absolute left-0 top-full flex max-h-48 w-full bg-white z-10 translate-y-2 flex-col  overflow-hidden overflow-y-auto scrollbar ${list.length > 0 ?"":"py-2 justify-center items-center"} rounded-md border-2 border-gray-600 bg-white`}>
            {list.length > 0 ? (
              list.map((li,ind) => (
                <p key={ind} className="cursor-pointer px-2 py-1.5 transition-all   hover:bg-gray-100" onClick={()=>setValue(li)}>
                  {li}
                </p>
              ))
            ) : (
              <Spinner />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectTextField;
