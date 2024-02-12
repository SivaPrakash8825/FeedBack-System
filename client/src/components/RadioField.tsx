type Props = {
  options: string[];
  setOption: (opt: string, index?: number) => void;
  option: string | null;
  index?: number;
  array?: boolean;
};

const RadioField = ({
  options,
  option,
  setOption,
  index,
  array = false,
}: Props) => {
  return (
    <div
      className={`flex  ${options.length > 2 ? "flex-col" : "items-center justify-around"}   gap-3 `}
    >
      {options.map((opt, i) => (
        <div
          key={i}
          onClick={() => (array ? setOption(opt, index) : setOption(opt))}
          className={`flex cursor-pointer items-center gap-2`}
        >
          {/* Radio  */}
          <div
            className={`h-4 w-4  rounded-full   ${opt === option ? "border-4  border-gray-700" : "border-2  border-gray-500"}  `}
          />
          {/* Radio Label */}
          <p className="capitalize">{opt}</p>
        </div>
      ))}
    </div>
  );
};

export default RadioField;
