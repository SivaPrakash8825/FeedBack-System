type Props = {
  options: string[];
  setOption: (opt: string | null) => void;
  option: string | null;
};

const RadioField = ({ options, option, setOption }: Props) => {
  return (
    <div className="flex items-center justify-around gap-3 ">
      {options.map((opt, i) => (
        <div
          key={i}
          onClick={() => setOption(opt)}
          className="flex cursor-pointer items-center gap-2"
        >
          {/* Radio  */}
          <div
            className={`h-4 w-4  rounded-full  border-gray-500  ${opt === option ? "border-4" : "border-2"}  `}
          />
          {/* Radio Label */}
          <p className="capitalize">{opt}</p>
        </div>
      ))}
    </div>
  );
};

export default RadioField;
