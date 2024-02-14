import { HTMLInputTypeAttribute, useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import "../index.css";

type Props = {
  label?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value: string ;
  list: string[];

  setValue: (val: string) => void;
};

const SelectTextField = ({ label, list, value, setValue }: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const selectRef = useRef<null | HTMLDivElement>(null);

  const handleCloseDropdown = (e: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      setShowDropdown(false);
    }
  };

  // closes dropdown on click
  useEffect(() => {
    document.addEventListener("mousedown", handleCloseDropdown);
    return () => document.removeEventListener("mousedown", handleCloseDropdown);
  }, [showDropdown]);

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-semibold capitalize">{label}</label>}
      <div
        ref={selectRef}
        onClick={() => setShowDropdown((e) => !e)}
        className={`relative w-full rounded-md border-2 ${showDropdown ? "border-gray-500 " : "border-gray-300"} cursor-pointer select-none p-2 transition-all`}
      >
        <p className={` ${value ? "uppercase" : "capitalize text-gray-400"}`}>
          {value || `Select ${label}`}
        </p>
        {/* Dropdown */}
        {
          <div
            className={`scrollbar absolute left-0 top-full z-10 flex max-h-48 w-full translate-y-2  flex-col  overflow-hidden overflow-y-auto bg-white ${list.length > 0 ? "" : "items-center justify-center py-2"} rounded-md border-2 border-gray-500 bg-white ${showDropdown ? "scale-100" : "scale-0"} origin-top transition-all `}
          >
            {list.length > 0 ? (
              list.map((li, ind) => (
                <p
                  key={ind}
                  className="cursor-pointer px-2 py-1.5 uppercase transition-all  hover:bg-gray-100"
                  onClick={() => setValue(li)}
                >
                  {li}
                </p>
              ))
            ) : (
              <Spinner />
            )}
          </div>
        }
      </div>
    </div>
  );
};

export default SelectTextField;
