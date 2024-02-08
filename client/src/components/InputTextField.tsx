import { HTMLInputTypeAttribute } from "react";

type Props = {
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value: string;
  setValue: (val: string) => void;
};

const InputTextField = ({
  type = "text",
  label,
  placeholder,
  setValue,
  value,
}: Props) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-semibold  capitalize">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-md border-2 border-gray-200 p-2 outline-gray-600"
      />
    </div>
  );
};

export default InputTextField;
