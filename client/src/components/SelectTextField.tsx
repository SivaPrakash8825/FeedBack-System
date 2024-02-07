import { HTMLInputTypeAttribute, useState } from "react";

type Props = {
  label?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value: string;
  setValue: (val: string) => void;
};

const SelectTextField = ({ label, placeholder, setValue, value }: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const list = [
    "One",
    "Two",
    "One",
    "Two",
    "One",
    "Two",
    "One",
    "Two",
    "One",
    "Two",
  ];

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-semibold ">{label}</label>}
      <div
        onClick={() => setShowDropdown((e) => !e)}
        className={`relative w-full rounded-md border-2 ${showDropdown ? "border-gray-600" : "border-gray-200"} select-none  p-2`}
      >
        <p className="">{value || placeholder || "Red"}</p>
        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute left-0 top-full flex max-h-48 w-full translate-y-2 flex-col overflow-hidden overflow-y-auto rounded-md border-2 border-gray-600 bg-white">
            {list.length > 0 ? (
              list.map((li) => (
                <p className="cursor-pointer px-2 py-1.5 transition-all  hover:bg-gray-100">
                  {li}
                </p>
              ))
            ) : (
              <p className="py-1.5  font-medium">No Data</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectTextField;
